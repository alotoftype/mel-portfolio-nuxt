#!/usr/bin/env node

/**
 * Lists all images referenced in your portfolio and blog data
 * Use this to know which images you need to prepare for upload
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = resolve(__dirname, '../../web/data')

function loadJson(filename) {
  const raw = readFileSync(resolve(dataDir, filename), 'utf-8')
  return JSON.parse(raw)
}

console.log('📋 Required Images for Sanity Upload\n')
console.log('=' .repeat(70))

// Portfolio Images
console.log('\n🖼️  PORTFOLIO IMAGES:\n')
const portfolioData = loadJson('portfolio.json')

portfolioData.forEach((item, index) => {
  console.log(`\n${index + 1}. ${item.title}`)
  console.log(`   Home Image: ${item.homeImage}`)

  if (item.gallery) {
    console.log(`   Gallery Images:`)
    Object.entries(item.gallery).forEach(([key, path]) => {
      if (path) console.log(`     - ${path}`)
    })
  }
})

// Blog Images
console.log('\n\n📝 BLOG POST IMAGES:\n')
const blogData = loadJson('blog.json')

blogData.forEach((post, index) => {
  if (post.thumbnail) {
    console.log(`${index + 1}. ${post.title}`)
    console.log(`   Thumbnail: ${post.thumbnail}`)
  }
})

// Home Page Slider
console.log('\n\n🏠 HOME PAGE SLIDER IMAGES:\n')
const homeData = loadJson('home.json')
const sliderData = homeData[0]?.slider || []

sliderData.forEach((slide, index) => {
  console.log(`${index + 1}. ${slide.title}`)
  console.log(`   Background: ${slide.backgroundImage}`)
})

// About Page
console.log('\n\n👥 ABOUT PAGE IMAGES:\n')
const aboutData = loadJson('about.json')

const teamSection = aboutData.find((d) => d.id === 'team')
if (teamSection?.team) {
  teamSection.team
    .filter((m) => !m.classOption?.includes('become-member'))
    .forEach((member, index) => {
      if (member.image) {
        console.log(`${index + 1}. ${member.name}`)
        console.log(`   Photo: ${member.image}`)
      }
    })
}

const brands = aboutData.find((d) => d.id === 'Brand')
if (brands?.brand) {
  console.log('\nClient Logos:')
  brands.brand.forEach((brand, index) => {
    if (brand.image) {
      console.log(`${index + 1}. ${brand.image}`)
    }
  })
}

console.log('\n' + '='.repeat(70))
console.log('\n💡 Next Steps:')
console.log('   1. Prepare all images listed above')
console.log('   2. Place them in web/public/img/ (matching the paths above)')
console.log('   3. Run: node scripts/upload-images-to-sanity.mjs')
console.log('')
