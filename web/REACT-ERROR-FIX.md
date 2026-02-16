# React Compiler Runtime Error - Fix Documentation

## Problem

Error encountered:
```
The requested module '/_nuxt/node_modules/react-compiler-runtime/dist/index.js?v=b99f41fa'
does not provide an export named 'c'
```

## Root Cause

The `@nuxtjs/sanity` module (v1.12.2+) includes visual editing features that depend on React. These React dependencies conflict with Nuxt's Vue-based architecture, causing module resolution errors.

## Solution

We implemented a custom Sanity client plugin instead of using the full `@nuxtjs/sanity` module.

### Changes Made

1. **Removed `@nuxtjs/sanity` module** from `nuxt.config.ts`
   - Removed from modules array
   - Removed sanity configuration block
   - Kept `@nuxt/image` sanity configuration for image optimization

2. **Created custom Sanity client plugin** at `plugins/sanity.client.ts`
   ```typescript
   import { createClient } from '@sanity/client'

   export default defineNuxtPlugin(() => {
     const config = useRuntimeConfig()

     const client = createClient({
       projectId: config.public.sanityProjectId,
       dataset: config.public.sanityDataset,
       apiVersion: '2024-01-01',
       useCdn: true,
     })

     return {
       provide: {
         sanityClient: client,
       },
     }
   })
   ```

3. **Updated `useSanityData.ts` composable**
   - Changed from `useSanity()` to `useNuxtApp().$sanityClient`
   - All Sanity queries now use the custom client instead

4. **Updated Vite config**
   - Excluded React-related packages from optimization
   - Kept the same file descriptor limits and watch settings

## Benefits

✅ **No React dependencies** - Pure Vue/Nuxt stack
✅ **Faster builds** - Fewer dependencies to process
✅ **Same functionality** - All Sanity queries work identically
✅ **Better performance** - Lighter bundle size
✅ **No visual editing** - We don't need it for this project

## What Still Works

- ✅ Fetching data from Sanity
- ✅ Portfolio items with images
- ✅ Blog posts
- ✅ All page content
- ✅ Image optimization via `@nuxt/image`
- ✅ Sanity CDN for images

## What Doesn't Work (By Design)

- ❌ Visual editing in Sanity Studio (we don't need this)
- ❌ Live preview mode (we don't need this)
- ❌ React-based Sanity components (we're using Vue)

## Testing

After implementing these changes:

1. Clear caches:
   ```bash
   rm -rf .nuxt node_modules/.cache
   ```

2. Kill ports and restart:
   ```bash
   ./kill-ports.sh
   ./dev-web.sh
   ```

3. Verify the app loads without errors
4. Check that portfolio items display with images from Sanity

## Future Considerations

If you ever need visual editing or live preview:
1. Consider using Sanity's Content Lake API directly
2. Use Sanity's Presentation tool (separate from Nuxt)
3. Or upgrade to a compatible version of `@nuxtjs/sanity` when available

## Dependencies

Still required:
- `@sanity/client` - Core Sanity client (lightweight, no React)
- `@sanity/image-url` - Image URL builder
- `@nuxt/image` - Nuxt image optimization (has Sanity provider built-in)

No longer needed (but kept in package.json for image optimization):
- `@nuxtjs/sanity` - Removed from modules, but package stays for types

## Related Files

- `nuxt.config.ts` - Removed sanity module and config
- `plugins/sanity.client.ts` - New custom client plugin
- `composables/useSanityData.ts` - Updated to use $sanityClient
- `.env` - Still uses same Sanity credentials
