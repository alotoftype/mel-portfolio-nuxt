/**
 * Composable for fetching data from Sanity CMS with fallback to local JSON data.
 *
 * During development or when Sanity is not yet configured, the local JSON files
 * from the original project serve as the data source. Once Sanity schemas are set up
 * and populated, the CMS data takes precedence.
 */

// Local fallback data (migrated from original React project)
import homeData from '~/data/home.json'
import portfolioData from '~/data/portfolio.json'
import aboutData from '~/data/about.json'
import contactCardsData from '~/data/contact.json'
import blogData from '~/data/blog.json'
import { canUseSanityInProcess, handleSanityFetchError } from '~/composables/useSanityFallback'

function normalizeSeoData(seo?: any) {
  return {
    metaTitle: typeof seo?.metaTitle === 'string' ? seo.metaTitle : '',
    metaDescription: typeof seo?.metaDescription === 'string' ? seo.metaDescription : '',
    ogImage: normalizeAssetPath(seo?.ogImage),
    noIndex: Boolean(seo?.noIndex),
  }
}

function normalizeAssetPath(path?: string) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('./')) return path.replace('./', '/')
  if (!path.startsWith('/')) return `/${path}`
  return path
}

function escapeHtml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function portableBlocksToHtmlBlocks(blocks: any[] | undefined) {
  if (!Array.isArray(blocks)) return []

  return blocks
    .map((block) => {
      if (typeof block === 'string') {
        return block
      }

      if (block?._type === 'block' && Array.isArray(block.children)) {
        const text = block.children.map((child: any) => child?.text || '').join('').trim()
        return text ? `<p>${escapeHtml(text)}</p>` : ''
      }

      if (block?._type === 'image' && block.imageUrl) {
        const altSource = block.alt || block.caption || 'Content image'
        const alt = escapeHtml(String(altSource))
        return `<p><img src="${block.imageUrl}" alt="${alt}" /></p>`
      }

      return ''
    })
    .filter(Boolean)
}

function portableBlocksToHtml(blocks: any[] | undefined) {
  return portableBlocksToHtmlBlocks(blocks).join('')
}

function formatPublishedDate(date?: string) {
  if (!date) return ''
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function normalizePortfolioItem(item: any, index = 0) {
  return {
    ...item,
    id: item.id || item._id || index + 1,
    slug: item.slug || String(item.id || item._id || index + 1),
    categories: Array.isArray(item.categories) ? item.categories : [],
    homeImage: normalizeAssetPath(item.homeImage),
    gallery: Array.isArray(item.gallery)
      ? item.gallery
          .map((g: any) => g?.asset?.url || g?.url || g)
          .filter(Boolean)
          .map((url: string) => normalizeAssetPath(url))
      : [],
    body: Array.isArray(item.body) ? portableBlocksToHtmlBlocks(item.body) : item.body,
    seo: normalizeSeoData(item.seo),
  }
}

function normalizeLegacyAboutData(data: any[]) {
  return data.map((section: any) => {
    if (section.id === 'team' && Array.isArray(section.team)) {
      return {
        ...section,
        team: section.team.map((member: any) => ({
          ...member,
          image: normalizeAssetPath(member.image),
        })),
      }
    }

    if (section.id === 'Brand' && Array.isArray(section.brand)) {
      return {
        ...section,
        brand: section.brand.map((brand: any) => ({
          ...brand,
          image: normalizeAssetPath(brand.image),
        })),
      }
    }

    return section
  })
}

export function useSanityData() {
  const config = useRuntimeConfig()
  const isSanityConfigured =
    !config.public.sanityForceFallback &&
    config.public.sanityProjectId !== 'your-project-id'

  const sanityClient = isSanityConfigured ? useSanity() : null

  async function fetchSanityQuery<T>(
    query: string,
    params: Record<string, unknown> = {}
  ): Promise<T | null> {
    const { data, error } = await useSanityQuery<T>(query, params)
    if (error.value) throw error.value
    return data.value || null
  }

  /**
   * Fetch portfolio items from Sanity, or fall back to local JSON
   */
  async function getPortfolioItems() {
    if (isSanityConfigured && sanityClient && canUseSanityInProcess()) {
      try {
        const query = `*[_type == "portfolioItem"] | order(order asc) {
            _id,
            title,
            "slug": slug.current,
            excerpt,
            seo {
              metaTitle,
              metaDescription,
              "ogImage": ogImage.asset->url,
              noIndex
            },
            categories,
            "homeImage": homeImage.asset->url,
            client,
            date,
            team,
            services,
            body[] {
              ...,
              "imageUrl": asset->url
            },
            gallery[] {
              "url": asset->url
            }
          }`
        const result = await fetchSanityQuery<any[]>(query)
        if (result?.length) {
          return result.map((item: any, index: number) => normalizePortfolioItem(item, index))
        }
      } catch (e) {
        handleSanityFetchError('Fetching portfolio items', e)
      }
    }

    // Fallback: map local JSON to consistent shape
    return portfolioData.map((item: any, index: number) =>
      normalizePortfolioItem(
        {
          ...item,
          homeImage: normalizeAssetPath(item.homeImage),
          slug: String(item.id),
        },
        index
      )
    )
  }

  /**
   * Fetch a single portfolio item by slug/ID
   */
  async function getPortfolioItem(slugOrId: string) {
    if (isSanityConfigured && sanityClient && canUseSanityInProcess()) {
      try {
        const query = `*[_type == "portfolioItem" && slug.current == $slug][0] {
          _id,
          title,
          "slug": slug.current,
          excerpt,
          seo {
            metaTitle,
            metaDescription,
            "ogImage": ogImage.asset->url,
            noIndex
          },
          categories,
          "homeImage": homeImage.asset->url,
            client,
            date,
            team,
            services,
            body[] {
              ...,
              "imageUrl": asset->url
            },
            gallery[] {
              "url": asset->url
            }
          }`
        const data = await fetchSanityQuery<any>(query, { slug: slugOrId })
        if (data) return normalizePortfolioItem(data)
      } catch (e) {
        handleSanityFetchError('Fetching portfolio item', e)
      }
    }
    const item = portfolioData.find((p: any) => String(p.id) === slugOrId)
    if (item) {
      return normalizePortfolioItem({
        ...item,
        homeImage: normalizeAssetPath(item.homeImage),
        slug: String(item.id),
      })
    }
    return null
  }

  /**
   * Fetch homepage data (slider, quote)
   */
  async function getHomeData() {
    if (isSanityConfigured && sanityClient && canUseSanityInProcess()) {
      try {
        const query = `*[_type == "homePage"][0] {
            slider[] {
              _key,
              title,
              subtitle,
              description,
              "image": image.asset->url,
              buttonText,
              link
            },
            quote,
            seo {
              metaTitle,
              metaDescription,
              "ogImage": ogImage.asset->url,
              noIndex
            },
            ctaTitle,
            ctaSubtitle
          }`
        const result = await fetchSanityQuery<any>(query)
        if (result && result.slider) {
          return {
            ...result,
            seo: normalizeSeoData(result.seo),
          }
        }
      } catch (e) {
        handleSanityFetchError('Fetching home page data', e)
      }
    }

    return {
      slider: (homeData[0] as any).slider.map((s: any) => ({
        title: s.title,
        subtitle: s.subTitle,
        image: normalizeAssetPath(s.backgroundImage),
        buttonText: s.buttonText,
        link: '/portfolio',
      })),
      quote: (homeData[1] as any).qute,
      seo: normalizeSeoData(),
    }
  }

  /**
   * Fetch about page data
   */
  async function getAboutData() {
    if (isSanityConfigured && sanityClient && canUseSanityInProcess()) {
      try {
        const query = `*[_type == "aboutPage"][0] {
          title,
          excerpt,
          servicesTitle,
          services,
          teamTitle,
          team[] {
            _key,
            name,
            role,
            "image": image.asset->url
          },
          testimonial {
            quote,
            author,
            role
          },
          awardsTitle,
          awards[] {
            _key,
            platform,
            title,
            year
          },
          clientsTitle,
          clientsExcerpt,
          clients[] {
            _key,
            name,
            "logo": logo.asset->url
          }
        }`
        const data = await fetchSanityQuery<any>(query)
        if (data) {
          return [
            {
              id: 'about me',
              title: data.title || 'About MelShotya',
              excerpt: data.excerpt || '',
            },
            {
              id: 'about service',
              title: data.servicesTitle || 'Our Services',
              pagelinkText: data.services || [],
            },
            {
              id: 'team',
              title: data.teamTitle || 'Meet Our Team',
              team: (data.team || []).map((member: any, index: number) => ({
                id: member._key || index + 1,
                _key: member._key,
                image: normalizeAssetPath(member.image),
                name: member.name,
                designation: member.role,
              })),
            },
            {
              id: 'blockquote',
              excerpt: data.testimonial?.quote || '',
              name: data.testimonial?.author || '',
              designation: data.testimonial?.role || '',
            },
            {
              id: 'Awards',
              title: data.awardsTitle || 'Awards Achieved',
              awardItem: (data.awards || []).map((award: any, index: number) => ({
                id: award._key || index + 1,
                _key: award._key,
                cate: award.platform,
                title: award.title,
                year: award.year,
              })),
            },
            {
              id: 'Brand',
              title: data.clientsTitle || 'Our Clients',
              excerpt: data.clientsExcerpt || '',
              brand: (data.clients || []).map((client: any, index: number) => ({
                id: client._key || index + 1,
                _key: client._key,
                image: normalizeAssetPath(client.logo),
                name: client.name,
              })),
            },
          ]
        }
      } catch (e) {
        handleSanityFetchError('Fetching about page data', e)
      }
    }
    return normalizeLegacyAboutData(aboutData as any[])
  }

  /**
   * Fetch contact info
   */
  async function getContactData() {
    const defaultResponseTemplates = {
      bookSession: {
        title: 'Session Request Received',
        message:
          'Thanks for reaching out about booking a session. We received your request and will follow up shortly.',
      },
      generalInquiry: {
        title: 'Inquiry Received',
        message:
          'Thank you for your message. We received your inquiry and will get back to you soon.',
      },
      custom: {
        title: 'Message Received',
        message:
          'Thanks for contacting us. Your message was sent successfully and we will respond as soon as possible.',
      },
    }

    const defaultContactData = {
      title: 'Contact us for any further questions, possible projects & business partnerships.',
      formTitle: 'Send a Message',
      formEndpoint: 'https://getform.io/f/a17a2715-d7ee-4ac4-8fcb-12f1eed43b2c',
      seo: normalizeSeoData(),
      responseTemplates: defaultResponseTemplates,
      contactItems: contactCardsData,
    }

    if (isSanityConfigured && sanityClient && canUseSanityInProcess()) {
      try {
        const query = `*[_type == "contactPage"][0] {
          title,
          formTitle,
          formEndpoint,
          seo {
            metaTitle,
            metaDescription,
            "ogImage": ogImage.asset->url,
            noIndex
          },
          responseTemplates {
            bookSession {
              title,
              message
            },
            generalInquiry {
              title,
              message
            },
            custom {
              title,
              message
            }
          },
          contactItems[] {
            _key,
            title,
            icon,
            content
          }
        }`
        const data = await fetchSanityQuery<any>(query)
        if (data) {
          return {
            title: data.title || defaultContactData.title,
            formTitle: data.formTitle || defaultContactData.formTitle,
            formEndpoint: data.formEndpoint || defaultContactData.formEndpoint,
            seo: normalizeSeoData(data.seo),
            responseTemplates: {
              bookSession: {
                title:
                  data.responseTemplates?.bookSession?.title ||
                  defaultResponseTemplates.bookSession.title,
                message:
                  data.responseTemplates?.bookSession?.message ||
                  defaultResponseTemplates.bookSession.message,
              },
              generalInquiry: {
                title:
                  data.responseTemplates?.generalInquiry?.title ||
                  defaultResponseTemplates.generalInquiry.title,
                message:
                  data.responseTemplates?.generalInquiry?.message ||
                  defaultResponseTemplates.generalInquiry.message,
              },
              custom: {
                title:
                  data.responseTemplates?.custom?.title ||
                  defaultResponseTemplates.custom.title,
                message:
                  data.responseTemplates?.custom?.message ||
                  defaultResponseTemplates.custom.message,
              },
            },
            contactItems: Array.isArray(data.contactItems)
              ? data.contactItems.map((item: any, index: number) => ({
                  id: item._key || index + 1,
                  _key: item._key,
                  title: item.title,
                  icon: item.icon,
                  info: portableBlocksToHtml(item.content),
                }))
              : defaultContactData.contactItems,
          }
        }
      } catch (e) {
        handleSanityFetchError('Fetching contact page data', e)
      }
    }
    return defaultContactData
  }

  /**
   * Fetch blog posts
   */
  async function getBlogPosts() {
    if (isSanityConfigured && sanityClient && canUseSanityInProcess()) {
      try {
        const query = `*[_type == "blogPost"] | order(publishedAt desc) {
          _id,
          _type,
          title,
          "slug": slug.current,
          author,
          publishedAt,
          categories,
          "thumbnail": thumbnail.asset->url,
          excerpt,
          seo {
            metaTitle,
            metaDescription,
            "ogImage": ogImage.asset->url,
            noIndex
          },
          body[] {
            ...,
            "imageUrl": asset->url
          },
          tags
        }`
        const data = await fetchSanityQuery<any[]>(query)
        if (data?.length) {
          return data.map((post: any, index: number) => ({
            ...post,
            id: post.id || post._id || index + 1,
            categories: Array.isArray(post.categories) ? post.categories : [],
            thumbnail: normalizeAssetPath(post.thumbnail),
            body: portableBlocksToHtmlBlocks(post.body),
            date: formatPublishedDate(post.publishedAt),
            seo: normalizeSeoData(post.seo),
          }))
        }
      } catch (e) {
        handleSanityFetchError('Fetching blog posts', e)
      }
    }
    return (blogData as any[]).map((post: any) => ({
      ...post,
      seo: normalizeSeoData(),
    }))
  }

  return {
    getPortfolioItems,
    getPortfolioItem,
    getHomeData,
    getAboutData,
    getContactData,
    getBlogPosts,
    isSanityConfigured,
  }
}
