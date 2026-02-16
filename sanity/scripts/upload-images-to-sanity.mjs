#!/usr/bin/env node

/**
 * Automated Image Upload Script for Sanity
 *
 * This script uploads all images from web/public/img to Sanity and links them
 * to the appropriate documents (portfolio items, blog posts, pages).
 *
 * Prerequisites:
 *   1. Images must be in web/public/img/ matching the paths in JSON data
 *   2. SANITY_API_TOKEN must be set in .env with write permissions
 *
 * Usage: node scripts/upload-images-to-sanity.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync, statSync } from 'fs'
import { resolve, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = resolve(__dirname, '../../web/data')
const publicDir = resolve(__dirname, '../../public')

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

function normalizeImagePath(path) {
  // Remove leading './' and ensure path starts from public root
  return path.replace(/^\.?\/?/, '')
}

async function uploadImage(imagePath) {
  const fullPath = resolve(publicDir, imagePath)

  if (!existsSync(fullPath)) {
    console.warn(`   ⚠️  Image not found: ${imagePath}`)
    return null
  }

  try {
    const imageBuffer = readFileSync(fullPath)
    const filename = basename(fullPath)

    console.log(`   📤 Uploading: ${filename}`)

    const asset = await client.assets.upload('image', imageBuffer, {
      filename: filename,
    })

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error(`   ❌ Failed to upload ${imagePath}:`, error.message)
    return null
  }
}

// ── Upload Functions ───────────────────────────────────────────

async function uploadPortfolioImages() {
  console.log('\n🖼️  Uploading Portfolio Images...')
  const portfolioData = loadJson('portfolio.json')

  for (const item of portfolioData) {
    const docId = `portfolio-${item.id}`
    console.log(`\n  Processing: ${item.title}`)

    const updates = {}

    // Upload home image
    if (item.homeImage) {
      const imagePath = normalizeImagePath(item.homeImage)
      const imageRef = await uploadImage(imagePath)
      if (imageRef) {
        updates.homeImage = imageRef
      }
    }

    // Upload gallery images
    if (item.gallery) {
      const galleryRefs = []

      for (const [key, path] of Object.entries(item.gallery)) {
        if (path) {
          const imagePath = normalizeImagePath(path)
          const imageRef = await uploadImage(imagePath)
          if (imageRef) {
            galleryRefs.push(imageRef)
          }
        }
      }

      if (galleryRefs.length > 0) {
        updates.gallery = galleryRefs
      }
    }

    // Update document if we have images
    if (Object.keys(updates).length > 0) {
      await client.patch(docId).set(updates).commit()
      console.log(`  ✅ Updated ${item.title}`)
    }
  }
}

async function uploadBlogImages() {
  console.log('\n📝 Uploading Blog Post Images...')
  const blogData = loadJson('blog.json')

  for (const post of blogData) {
    if (!post.thumbnail) continue

    const docId = `blog-${post.id}`
    console.log(`\n  Processing: ${post.title}`)

    const imagePath = normalizeImagePath(post.thumbnail)
    const imageRef = await uploadImage(imagePath)

    if (imageRef) {
      await client.patch(docId).set({ thumbnail: imageRef }).commit()
      console.log(`  ✅ Updated ${post.title}`)
    }
  }
}

async function uploadHomeSliderImages() {
  console.log('\n🏠 Uploading Home Page Slider Images...')
  const homeData = loadJson('home.json')
  const sliderData = homeData[0]?.slider || []

  const updatedSlider = []

  for (let i = 0; i < sliderData.length; i++) {
    const slide = sliderData[i]
    console.log(`\n  Processing: ${slide.title}`)

    let imageRef = null

    if (slide.backgroundImage) {
      const imagePath = normalizeImagePath(slide.backgroundImage)
      imageRef = await uploadImage(imagePath)
    }

    updatedSlider.push({
      _key: `slide-${i}`,
      title: slide.title,
      subtitle: slide.subTitle || '',
      description: slide.desc || '',
      image: imageRef,
      buttonText: slide.buttonText || '',
      link: '/portfolio',
    })
  }

  await client.patch('homePage').set({ slider: updatedSlider }).commit()
  console.log('  ✅ Updated Home Page slider')
}

async function uploadAboutPageImages() {
  console.log('\n👥 Uploading About Page Images...')
  const aboutData = loadJson('about.json')

  const teamSection = aboutData.find((d) => d.id === 'team')
  const brands = aboutData.find((d) => d.id === 'Brand')

  const updates = {}

  // Upload team photos
  if (teamSection?.team) {
    const teamMembers = []

    for (const member of teamSection.team) {
      if (member.classOption?.includes('become-member')) continue

      let imageRef = null
      if (member.image) {
        console.log(`\n  Processing: ${member.name}`)
        const imagePath = normalizeImagePath(member.image)
        imageRef = await uploadImage(imagePath)
      }

      teamMembers.push({
        _key: `member-${teamMembers.length}`,
        name: member.name.replace(/<[^>]*>/g, ''),
        role: member.designation || '',
        image: imageRef,
      })
    }

    if (teamMembers.length > 0) {
      updates.team = teamMembers
    }
  }

  // Upload client logos
  if (brands?.brand) {
    const clients = []

    for (const brand of brands.brand) {
      let imageRef = null
      if (brand.image) {
        console.log(`\n  Processing client logo: ${brand.image}`)
        const imagePath = normalizeImagePath(brand.image)
        imageRef = await uploadImage(imagePath)
      }

      clients.push({
        _key: `client-${clients.length}`,
        name: `Client ${brand.id}`,
        logo: imageRef,
      })
    }

    if (clients.length > 0) {
      updates.clients = clients
    }
  }

  // Update about page
  if (Object.keys(updates).length > 0) {
    await client.patch('aboutPage').set(updates).commit()
    console.log('  ✅ Updated About Page')
  }
}

// ── Main ───────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Sanity Image Upload Script')
  console.log(`   Project: ${process.env.SANITY_STUDIO_PROJECT_ID}`)
  console.log(`   Dataset: ${process.env.SANITY_STUDIO_DATASET || 'production'}`)
  console.log('─'.repeat(70))

  // Check if images directory exists
  const imgDir = resolve(publicDir, 'img')
  if (!existsSync(imgDir)) {
    console.error('\n❌ Image directory not found: web/public/img/')
    console.error('   Please create it and add your images first.')
    console.error('\n   Run: node scripts/list-required-images.mjs')
    console.error('   to see which images are needed.\n')
    process.exit(1)
  }

  try {
    await uploadPortfolioImages()
    await uploadBlogImages()
    await uploadHomeSliderImages()
    await uploadAboutPageImages()

    console.log('\n' + '─'.repeat(70))
    console.log('✅ Image upload complete!')
    console.log('\nNext steps:')
    console.log('  1. Open Sanity Studio: npm run dev')
    console.log('  2. Verify images are linked correctly')
    console.log('  3. Restart Nuxt dev server to see images')
  } catch (err) {
    console.error('\n❌ Upload failed:', err.message)
    console.error(err)
    process.exit(1)
  }
}

main()
