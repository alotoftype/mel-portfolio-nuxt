#!/usr/bin/env node

/**
 * Migration Script: JSON Data → Sanity CMS
 *
 * Migrates all existing JSON data from the original React project
 * into Sanity documents. Run with: npm run migrate
 *
 * Prerequisites:
 *   1. Set SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET, SANITY_API_TOKEN in .env
 *   2. npm install
 *
 * What it does:
 *   - Creates the Home Page singleton document
 *   - Creates all Portfolio Items
 *   - Creates all Blog Posts
 *   - Creates the About Page singleton document
 *   - Creates the Contact Page singleton document
 *   - Creates the Site Settings singleton document
 *
 * NOTE: This script does NOT upload images. Images stay in /public/img for now.
 * To use Sanity's image CDN, upload images via the Studio UI or extend this script
 * to use the Sanity asset API.
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = resolve(__dirname, '../../web/data')

// ── Sanity Client ──────────────────────────────────────────────
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

if (!process.env.SANITY_STUDIO_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
  console.error('❌ Missing SANITY_STUDIO_PROJECT_ID or SANITY_API_TOKEN in .env')
  process.exit(1)
}

// ── Helpers ────────────────────────────────────────────────────
function loadJson(filename) {
  const raw = readFileSync(resolve(dataDir, filename), 'utf-8')
  return JSON.parse(raw)
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]*>/g, '').trim()
}

/**
 * Convert HTML body blocks (from the old JSON) into Sanity portable text blocks.
 * This is a simplified converter — it handles paragraphs and plain text.
 * For richer content, you'd want a proper HTML-to-portable-text parser.
 */
function htmlToPortableText(htmlBlocks) {
  if (!htmlBlocks || !Array.isArray(htmlBlocks)) return []

  return htmlBlocks
    .filter((block) => block && block.trim())
    .map((block, i) => {
      const text = stripHtml(block)
      if (!text) return null
      return {
        _type: 'block',
        _key: `block-${i}`,
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: `span-${i}`,
            text,
            marks: [],
          },
        ],
      }
    })
    .filter(Boolean)
}

// ── Migration Functions ────────────────────────────────────────

async function migrateHomePage() {
  console.log('\n📄 Migrating Home Page...')
  const homeData = loadJson('home.json')
  const sliderData = homeData[0]?.slider || []
  const quoteData = homeData[1]?.qute || ''

  const doc = {
    _id: 'homePage',
    _type: 'homePage',
    slider: sliderData.map((slide, i) => ({
      _key: `slide-${i}`,
      title: slide.title,
      subtitle: slide.subTitle || '',
      description: slide.desc || '',
      // Note: image not uploaded, reference kept as metadata
      buttonText: slide.buttonText || '',
      link: '/portfolio',
    })),
    quote: quoteData,
    ctaTitle: 'Ready to capture your story?',
    ctaSubtitle: "Let's create something beautiful",
  }

  await client.createOrReplace(doc)
  console.log(`  ✅ Home Page created (${sliderData.length} slides)`)
}

async function migratePortfolio() {
  console.log('\n🖼️  Migrating Portfolio Items...')
  const portfolioData = loadJson('portfolio.json')

  const transaction = client.transaction()

  for (const item of portfolioData) {
    const slug = slugify(item.title)
    const doc = {
      _id: `portfolio-${item.id}`,
      _type: 'portfolioItem',
      title: item.title,
      slug: { _type: 'slug', current: slug },
      excerpt: item.excerpt || '',
      categories: item.categories || [],
      client: stripHtml(item.client || ''),
      date: stripHtml(item.date || ''),
      team: stripHtml(item.team || ''),
      services: stripHtml(item.services || ''),
      body: htmlToPortableText(item.body),
      videoUrl: item.videoUrl || undefined,
      externalUrl: item.pageUrl?.link !== '/' ? item.pageUrl?.text : undefined,
      order: item.id,
    }

    transaction.createOrReplace(doc)
  }

  await transaction.commit()
  console.log(`  ✅ ${portfolioData.length} portfolio items created`)
}

async function migrateBlogPosts() {
  console.log('\n📝 Migrating Blog Posts...')
  const blogData = loadJson('blog.json')

  const transaction = client.transaction()

  for (const post of blogData) {
    const slug = slugify(post.title)
    const doc = {
      _id: `blog-${post.id}`,
      _type: 'blogPost',
      title: post.title,
      slug: { _type: 'slug', current: slug },
      author: post.author || '',
      publishedAt: parseDate(post.date),
      categories: post.categories || [],
      tags: post.tags || [],
      body: htmlToPortableText(post.body),
    }

    transaction.createOrReplace(doc)
  }

  await transaction.commit()
  console.log(`  ✅ ${blogData.length} blog posts created`)
}

function parseDate(dateStr) {
  if (!dateStr) return new Date().toISOString()
  // Handle formats like "Aug, 24th, 2021"
  const cleaned = dateStr
    .replace(/(\d+)(st|nd|rd|th)/g, '$1')
    .replace(/,/g, '')
    .trim()
  const parsed = new Date(cleaned)
  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString()
}

async function migrateAboutPage() {
  console.log('\n👥 Migrating About Page...')
  const aboutData = loadJson('about.json')

  const aboutMe = aboutData.find((d) => d.id === 'about me')
  const aboutService = aboutData.find((d) => d.id === 'about service')
  const teamSection = aboutData.find((d) => d.id === 'team')
  const blockquote = aboutData.find((d) => d.id === 'blockquote')
  const awards = aboutData.find((d) => d.id === 'Awards')
  const brands = aboutData.find((d) => d.id === 'Brand')

  const doc = {
    _id: 'aboutPage',
    _type: 'aboutPage',
    title: aboutMe?.title || 'About MelShotya',
    excerpt: stripHtml(aboutMe?.excerpt || ''),

    servicesTitle: aboutService?.title || 'Our Services',
    services: aboutService?.pagelinkText || [],

    teamTitle: teamSection?.title || 'Meet Our Team',
    team: (teamSection?.team || [])
      .filter((m) => !m.classOption?.includes('become-member'))
      .map((member, i) => ({
        _key: `member-${i}`,
        name: stripHtml(member.name),
        role: member.designation || '',
      })),

    testimonial: blockquote
      ? {
          quote: stripHtml(blockquote.excerpt || ''),
          author: blockquote.name || '',
          role: blockquote.designation || '',
        }
      : undefined,

    awardsTitle: awards?.title || 'Awards Achieved',
    awards: (awards?.awardItem || []).map((award, i) => ({
      _key: `award-${i}`,
      title: stripHtml(award.title),
      platform: award.cate || '',
    })),

    clientsTitle: brands?.title || 'Our Clients',
    clientsExcerpt: brands?.excerpt || '',
    clients: (brands?.brand || []).map((brand, i) => ({
      _key: `client-${i}`,
      name: `Client ${brand.id}`,
    })),
  }

  await client.createOrReplace(doc)
  console.log('  ✅ About Page created')
}

async function migrateContactPage() {
  console.log('\n✉️  Migrating Contact Page...')
  const contactData = loadJson('contact.json')

  const doc = {
    _id: 'contactPage',
    _type: 'contactPage',
    title: 'Contact us for any further questions, possible projects & business partnerships',
    formTitle: 'Get In Touch',
    formEndpoint: 'https://getform.io/f/a17a2715-d7ee-4ac4-8fcb-12f1eed43b2c',
    contactItems: contactData.map((item, i) => ({
      _key: `contact-${i}`,
      title: item.title,
      icon: item.icon?.includes('mail')
        ? 'mail'
        : item.icon?.includes('pin')
        ? 'pin'
        : 'briefcase',
      content: [
        {
          _type: 'block',
          _key: `block-${i}`,
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: `span-${i}`,
              text: stripHtml(item.info),
              marks: [],
            },
          ],
        },
      ],
    })),
  }

  await client.createOrReplace(doc)
  console.log('  ✅ Contact Page created')
}

async function migrateSiteSettings() {
  console.log('\n⚙️  Creating Site Settings...')

  const doc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'MelShotya Photography',
    siteDescription:
      'MelShotya Photography — Brooklyn-based photography studio specializing in portraits, events, fashion, and editorial work.',
    email: 'melshotya@gmail.com',
    phone: '3472657024',
    address: '155 Maiden Lane, New York, United States',
    socialLinks: {
      instagram: 'https://www.instagram.com/',
      facebook: 'https://www.facebook.com/',
      twitter: 'https://twitter.com/',
    },
  }

  await client.createOrReplace(doc)
  console.log('  ✅ Site Settings created')
}

// ── Run All ────────────────────────────────────────────────────

async function main() {
  console.log('🚀 MelShotya — JSON → Sanity Migration')
  console.log(`   Project: ${process.env.SANITY_STUDIO_PROJECT_ID}`)
  console.log(`   Dataset: ${process.env.SANITY_STUDIO_DATASET || 'production'}`)
  console.log('─'.repeat(50))

  try {
    await migrateHomePage()
    await migratePortfolio()
    await migrateBlogPosts()
    await migrateAboutPage()
    await migrateContactPage()
    await migrateSiteSettings()

    console.log('\n─'.repeat(50))
    console.log('✅ Migration complete!')
    console.log('\nNext steps:')
    console.log('  1. Open Sanity Studio: npm run dev')
    console.log('  2. Upload images via the Studio UI')
    console.log('  3. Review and edit migrated content')
    console.log('  4. Update the Nuxt .env with your project ID')
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message)
    process.exit(1)
  }
}

main()
