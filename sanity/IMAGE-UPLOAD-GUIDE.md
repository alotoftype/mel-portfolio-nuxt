# Image Upload Guide for Sanity CMS

## Overview

Your Nuxt app is now successfully connected to Sanity and fetching data! However, the images still need to be uploaded to Sanity's CDN. This guide shows you how to do it automatically.

## Current Status

✅ **Sanity Connection:** Working
✅ **Data Migration:** Complete (9 portfolio items, 10 blog posts, all pages)
⚠️ **Images:** Need to be uploaded

## Required Images

Run this command to see all images you need:

```bash
npm run list-images
```

This will show you exactly which image files are referenced in your data.

## Image Upload Process

### Option 1: Automated Upload (Recommended)

**Step 1:** Prepare your images
- Create the directory structure:
  ```bash
  cd ../web
  mkdir -p public/img/portfolio/engagement
  mkdir -p public/img/portfolio/marketing
  mkdir -p public/img/portfolio/portraits
  mkdir -p public/img/portfolio/events
  mkdir -p public/img/portfolio/celebrity
  mkdir -p public/img/portfolio/fashion
  mkdir -p public/img/hero-slider
  mkdir -p public/img/team
  mkdir -p public/img/brand-logo
  ```

**Step 2:** Add your images to the directories
- Place all your portfolio, hero slider, team, and logo images in their respective folders
- Make sure filenames match those listed by `npm run list-images`

**Step 3:** Run the automated upload script
```bash
cd ../sanity
npm run upload-images
```

This will:
- Upload all images to Sanity's CDN
- Link images to the correct portfolio items, blog posts, and pages
- Show progress for each upload

### Option 2: Manual Upload via Sanity Studio

**Step 1:** Start Sanity Studio
```bash
npm run dev
```

**Step 2:** Open http://localhost:3333

**Step 3:** Upload images manually
- Go to "Portfolio" in the sidebar
- Click on each portfolio item
- Upload images to the `homeImage` and `gallery` fields
- Repeat for all items

## Verify Images in Nuxt App

After uploading images, restart your Nuxt dev server:

```bash
cd ../web
npm run dev
```

Visit http://localhost:3000 and check:
- ✅ Hero slider images appear
- ✅ Portfolio grid shows thumbnail images
- ✅ Portfolio detail pages show gallery images
- ✅ About page shows team photos and client logos

## Troubleshooting

### Images not showing in Nuxt app?

1. **Clear the Nuxt cache:**
   ```bash
   cd web
   rm -rf .nuxt node_modules/.cache
   npm run dev
   ```

2. **Check Sanity Studio:**
   - Open http://localhost:3333
   - Verify images are attached to documents

3. **Check image URLs in Sanity:**
   ```bash
   cd sanity
   node -e "import('@sanity/client').then(({createClient})=>createClient({projectId:'2806by2t',dataset:'production',apiVersion:'2024-01-01'}).fetch('*[_type==\"portfolioItem\"][0]{homeImage}').then(console.log))"
   ```

### Upload script fails?

- Ensure your `.env` has a valid `SANITY_API_TOKEN` with **write** permissions
- Check that image files exist at the paths shown by `npm run list-images`
- Verify image formats are supported (JPG, PNG, WebP)

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run list-images` | List all required images and their paths |
| `npm run upload-images` | Upload all images from web/public/img to Sanity |
| `npm run migrate` | Re-run data migration (if needed) |
| `npm run dev` | Start Sanity Studio at localhost:3333 |

## Next Steps After Images

Once images are uploaded, you can:

1. **Customize content** in Sanity Studio
2. **Add new portfolio items** via the Studio UI
3. **Deploy Sanity Studio** to production:
   ```bash
   npm run deploy
   ```
4. **Deploy Nuxt app** to Netlify, Vercel, etc.

## Need Help?

- Check Sanity Studio: http://localhost:3333
- Check Nuxt app: http://localhost:3000
- View Sanity project dashboard: https://www.sanity.io/manage/personal/project/2806by2t
