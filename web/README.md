# MelShotya Photography — Portfolio

A modern photography portfolio built with **Nuxt 3**, **Tailwind CSS**, and **Sanity CMS**.

Migrated from a legacy Create React App project to a performant, editorial-quality stack.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 3 (Vue 3 + Nitro) |
| Styling | Tailwind CSS 3 + custom design tokens |
| CMS | Sanity.io (headless, with full Studio) |
| Images | @nuxt/image (auto WebP/AVIF) |
| Animations | Custom IntersectionObserver + CSS |
| Deployment | SSG via `nuxt generate` or SSR |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (works immediately with local JSON data)
npm run dev
# → http://localhost:3000

# 3. Build for production
npm run build
```

## Sanity CMS Setup

The site works out of the box with local JSON fallback data. To connect Sanity:

```bash
# 1. Create a Sanity project
cd sanity-studio
npx sanity@latest init --env

# 2. Install studio dependencies
npm install

# 3. Run the migration script to import existing JSON data
cp .env.example .env
# Edit .env with your project ID and write token
npm run migrate

# 4. Start the Studio
npm run dev
# → http://localhost:3333

# 5. Set the same project ID in the Nuxt app
cd ..
cp .env.example .env
# Edit .env with your Sanity project ID
```

### Sanity Schemas

| Schema | Type | Description |
|--------|------|-------------|
| `homePage` | Singleton | Hero slider, quote, CTA content |
| `aboutPage` | Singleton | Bio, services, team, testimonials, awards |
| `contactPage` | Singleton | Contact info cards, form settings |
| `siteSettings` | Singleton | Site name, SEO, social links, footer |
| `portfolioItem` | Collection | Portfolio projects with galleries |
| `blogPost` | Collection | Blog articles with rich text |

## Project Structure

```
├── app.vue                       # Root component
├── error.vue                     # Custom 404/error page
├── nuxt.config.ts                # Nuxt configuration
├── tailwind.config.ts            # Design tokens & theme
│
├── assets/css/main.css           # Global styles, animations, grain textures
│
├── components/
│   ├── AppHeader.vue             # Sticky header + animated slide-out nav
│   ├── AppFooter.vue             # Site footer
│   ├── HeroSlider.vue            # Full-screen hero carousel
│   ├── PortfolioGrid.vue         # Filterable portfolio grid + TransitionGroup
│   ├── LightboxOverlay.vue       # Keyboard-accessible image lightbox
│   ├── ScrollToTop.vue           # Auto-hide scroll-to-top button
│   ├── SectionReveal.vue         # IntersectionObserver scroll-triggered reveal
│   ├── ImageReveal.vue           # Curtain clip-path image reveal animation
│   ├── TextSplit.vue             # Character/word staggered text animation
│   └── CountUp.vue               # Animated number counter
│
├── composables/
│   ├── useSanityData.ts          # Sanity CMS fetching + JSON fallback
│   ├── useLightbox.ts            # Lightbox state management
│   └── useScrollAnimation.ts    # IntersectionObserver utilities
│
├── plugins/
│   └── animate.client.ts         # v-animate directive for scroll animations
│
├── data/                         # Local JSON fallback data
│   ├── home.json
│   ├── portfolio.json
│   ├── about.json
│   ├── contact.json
│   └── blog.json
│
├── layouts/
│   └── default.vue               # Header + main + footer + lightbox
│
├── pages/
│   ├── index.vue                 # Homepage (hero, quote, portfolio, stats, CTA)
│   ├── about.vue                 # About (bio, services, team, testimonials, awards)
│   ├── contact.vue               # Contact form + info cards
│   ├── video-gallery.vue         # Video gallery with modal player
│   ├── blog/
│   │   ├── index.vue             # Blog listing grid
│   │   └── [slug].vue            # Blog post detail + related posts
│   └── portfolio/
│       ├── index.vue             # Full portfolio with category filter
│       └── [slug].vue            # Portfolio detail + gallery
│
├── public/img/                   # Static images (from original project)
│
└── sanity-studio/                # Complete Sanity Studio project
    ├── sanity.config.ts          # Studio config with custom desk structure
    ├── schemas/
    │   ├── index.ts
    │   ├── homePage.ts
    │   ├── aboutPage.ts
    │   ├── contactPage.ts
    │   ├── siteSettings.ts
    │   ├── portfolioItem.ts
    │   └── blogPost.ts
    └── scripts/
        └── migrate-json-to-sanity.mjs  # One-click data migration
```

## Animation System

The project includes a layered animation system:

| Component | Use Case |
|-----------|----------|
| `<SectionReveal>` | Wrap any element for scroll-triggered fade-up/fade-in |
| `<TextSplit>` | Staggered character/word reveal for headings |
| `<ImageReveal>` | Clip-path curtain reveal for images |
| `<CountUp>` | Animated number counter with easing |
| `v-animate` directive | Quick inline scroll animation on any element |
| CSS `.magnetic-btn` | Fill-from-bottom hover effect on CTAs |
| CSS `.grain` | Subtle film grain texture overlay |

All animations use `IntersectionObserver` (no external libraries), CSS `cubic-bezier` easing, and fire-once semantics.

## Design

Editorial photography aesthetic:

- **Typography**: Cormorant Garamond (display) + Outfit (body)
- **Colors**: Warm cream (`#fdfcfa`) backgrounds, ink tones, gold accent (`#a68b6b`)
- **Motion**: Expo easing (`cubic-bezier(0.16, 1, 0.3, 1)`), staggered reveals, page transitions
- **Layout**: Full-bleed imagery, generous whitespace, magazine grid

## Deployment

Any Nuxt-compatible host works:

- **Vercel**: `npx vercel` (auto-detected)
- **Netlify**: Build cmd `npm run generate`, publish `dist`
- **Cloudflare Pages**: Framework preset → Nuxt

## License

Private project for MelShotya Photography.
