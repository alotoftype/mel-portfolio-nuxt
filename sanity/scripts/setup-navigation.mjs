#!/usr/bin/env node

/**
 * Navigation Setup Script
 * Creates default navigation items for all 4 areas
 */

import { createClient } from '@sanity/client'
import 'dotenv/config'

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

const navigationAreas = [
  {
    _id: 'nav-top-corner',
    _type: 'navigation',
    title: 'Main Menu (Slide-out)',
    location: 'topCorner',
    enabled: true,
    items: [
      { label: 'Home', url: '/', openInNewTab: false },
      { label: 'Portfolio', url: '/portfolio', openInNewTab: false },
      { label: 'About', url: '/about', openInNewTab: false },
      { label: 'Blog', url: '/blog', openInNewTab: false },
      { label: 'Contact', url: '/contact', openInNewTab: false },
    ],
  },
  {
    _id: 'nav-right-side',
    _type: 'navigation',
    title: 'Right Side Menu',
    location: 'rightSide',
    enabled: true,
    items: [
      { label: 'Book a Session', url: '/contact', openInNewTab: false },
    ],
  },
  {
    _id: 'nav-bottom-left',
    _type: 'navigation',
    title: 'Footer Menu',
    location: 'bottomLeft',
    enabled: true,
    items: [
      { label: 'Home', url: '/', openInNewTab: false },
      { label: 'Portfolio', url: '/portfolio', openInNewTab: false },
      { label: 'About', url: '/about', openInNewTab: false },
      { label: 'Contact', url: '/contact', openInNewTab: false },
    ],
  },
  {
    _id: 'nav-bottom-right',
    _type: 'navigation',
    title: 'Social Links',
    location: 'bottomRight',
    enabled: true,
    showFullSocialNames: false, // Show icons only by default
    items: [
      {
        label: 'Instagram',
        url: 'https://www.instagram.com/melshotya',
        icon: 'instagram',
        openInNewTab: true,
      },
      {
        label: 'Facebook',
        url: 'https://www.facebook.com/melshotya',
        icon: 'facebook',
        openInNewTab: true,
      },
      {
        label: 'Twitter',
        url: 'https://twitter.com/melshotya',
        icon: 'twitter',
        openInNewTab: true,
      },
    ],
  },
]

async function setupNavigation() {
  console.log('🚀 Navigation Setup')
  console.log(`   Project: ${process.env.SANITY_STUDIO_PROJECT_ID}`)
  console.log(`   Dataset: ${process.env.SANITY_STUDIO_DATASET || 'production'}`)
  console.log('─'.repeat(70))

  try {
    for (const nav of navigationAreas) {
      console.log(`\n📍 Setting up: ${nav.title}`)
      await client.createOrReplace(nav)
      console.log(`   ✅ ${nav.items.length} items`)
    }

    console.log('\n' + '─'.repeat(70))
    console.log('✅ Navigation setup complete!')
    console.log('\nNavigation areas created:')
    console.log('  • Top Corner (Slide-out Menu) - 5 links')
    console.log('  • Right Side (Single CTA) - 1 link')
    console.log('  • Bottom Left (Footer Menu) - 4 links')
    console.log('  • Bottom Right (Social) - 3 links')
    console.log('\nNext steps:')
    console.log('  1. Open Sanity Studio: npm run dev')
    console.log('  2. Go to Navigation section')
    console.log('  3. Customize links and labels')
    console.log('  4. Toggle social icon/text display')
  } catch (err) {
    console.error('\n❌ Setup failed:', err.message)
    process.exit(1)
  }
}

setupNavigation()
