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
import contactData from '~/data/contact.json'
import blogData from '~/data/blog.json'

export function useSanityData() {
  const nuxtApp = useNuxtApp()
  const config = useRuntimeConfig()
  const isSanityConfigured = config.public.sanityProjectId !== 'your-project-id'

  // Get sanity client from the plugin
  const sanityClient = nuxtApp.$sanityClient

  /**
   * Fetch portfolio items from Sanity, or fall back to local JSON
   */
  async function getPortfolioItems() {
    // Use Nuxt's built-in caching
    const { data } = await useAsyncData('portfolio-items', async () => {
      if (isSanityConfigured && sanityClient) {
        try {
          const query = `*[_type == "portfolioItem"] | order(order asc) {
            _id,
            title,
            "slug": slug.current,
            excerpt,
            categories,
            "homeImage": homeImage.asset->url,
            client,
            date,
            team,
            services,
            body,
            gallery[] { asset->{ url } }
          }`
          const result = await sanityClient.fetch(query)
          if (result?.length) {
            return result
          }
        } catch (e) {
          console.warn('Sanity fetch failed, using local data:', e)
        }
      }
      // Fallback: map local JSON to consistent shape
      return portfolioData.map((item: any) => ({
        ...item,
        homeImage: `/${item.homeImage}`,
        slug: String(item.id),
      }))
    }, {
      // Cache for 5 minutes
      getCachedData: (key) => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    })

    return data.value || []
  }

  /**
   * Fetch a single portfolio item by slug/ID
   */
  async function getPortfolioItem(slugOrId: string) {
    if (isSanityConfigured && sanityClient) {
      try {
        const query = `*[_type == "portfolioItem" && slug.current == $slug][0] {
          _id,
          title,
          "slug": slug.current,
          excerpt,
          categories,
          "homeImage": homeImage.asset->url,
          client,
          date,
          team,
          services,
          body,
          gallery[] { asset->{ url } }
        }`
        const data = await sanity.fetch(query, { slug: slugOrId })
        if (data) return data
      } catch (e) {
        console.warn('Sanity fetch failed, using local data:', e)
      }
    }
    const item = portfolioData.find((p: any) => String(p.id) === slugOrId)
    if (item) {
      return {
        ...item,
        homeImage: `/${item.homeImage}`,
        slug: String(item.id),
      }
    }
    return null
  }

  /**
   * Fetch homepage data (slider, quote)
   */
  async function getHomeData() {
    const { data } = await useAsyncData('home-data', async () => {
      if (isSanityConfigured && sanityClient) {
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
            ctaTitle,
            ctaSubtitle
          }`
          const result = await sanityClient.fetch(query)
          if (result && result.slider) {
            return result
          }
        } catch (e) {
          console.warn('Sanity fetch failed, using local data:', e)
        }
      }
      return {
        slider: (homeData[0] as any).slider.map((s: any) => ({
        title: s.title,
        subtitle: s.subTitle,
        image: s.backgroundImage,
        buttonText: s.buttonText,
        link: '/portfolio',
      })),
      quote: (homeData[1] as any).qute,
    }
    }, {
      getCachedData: (key) => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    })

    return data.value || { slider: [], quote: '' }
  }

  /**
   * Fetch about page data
   */
  async function getAboutData() {
    if (isSanityConfigured && sanityClient) {
      try {
        const query = `*[_type == "aboutPage"][0] {
          title,
          excerpt,
          services,
          team[] {
            name,
            role,
            "image": image.asset->url
          },
          testimonial {
            quote,
            author,
            role
          },
          awards[] {
            platform,
            title,
            year
          },
          clients[] {
            name,
            "logo": logo.asset->url
          }
        }`
        const data = await sanityClient.fetch(query)
        if (data) return data
      } catch (e) {
        console.warn('Sanity fetch failed, using local data:', e)
      }
    }
    return aboutData
  }

  /**
   * Fetch contact info
   */
  async function getContactData() {
    if (isSanityConfigured && sanityClient) {
      try {
        const query = `*[_type == "contactPage"][0] {
          title,
          contactItems[] { title, icon, info }
        }`
        const data = await sanityClient.fetch(query)
        if (data) return data
      } catch (e) {
        console.warn('Sanity fetch failed, using local data:', e)
      }
    }
    return contactData
  }

  /**
   * Fetch blog posts
   */
  async function getBlogPosts() {
    if (isSanityConfigured && sanityClient) {
      try {
        const query = `*[_type == "blogPost"] | order(publishedAt desc) {
          _id,
          title,
          "slug": slug.current,
          author,
          publishedAt,
          categories,
          "thumbnail": thumbnail.asset->url,
          excerpt,
          body
        }`
        const data = await sanityClient.fetch(query)
        if (data?.length) return data
      } catch (e) {
        console.warn('Sanity fetch failed, using local data:', e)
      }
    }
    return blogData
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
