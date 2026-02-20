# Image Path Fix

## Problem

Vue Router warning:
```
[Vue Router warn]: No match found for location with path "/img/hero-slider/hero1.png"
```

## Root Cause

Images were in the root `public/img/` directory, but Nuxt serves static files from `web/public/`.

Nuxt was trying to route image paths as pages instead of serving them as static assets.

## Solution

Created a symbolic link from `web/public/img` to the root `public/img` directory:

```bash
cd web/public
ln -s ../../public/img img
```

This allows:
- Images to stay in one location (root `public/img/`)
- Nuxt to serve them correctly from `web/public/img`
- Sanity upload script to reference the same location

## What Was Changed

1. **Created symlink:** `web/public/img -> ../../public/img`
2. **Copied favicon:** `web/public/favicon.png`

## Verification

Images are now accessible at:
- http://localhost:3000/img/hero-slider/hero1.png
- http://localhost:3000/img/portfolio/engagement/engagement01.png
- http://localhost:3000/img/favicon.png

## Structure

```
mel-portfolio-nuxt/
├── public/
│   └── img/                    # Actual images (193 files)
│       ├── hero-slider/
│       ├── portfolio/
│       ├── team/
│       ├── brand-logo/
│       └── favicon.png
├── web/
│   └── public/
│       ├── img -> ../../public/img    # Symlink
│       └── favicon.png                # Copy
└── sanity/
    └── scripts/
        └── upload-images-to-sanity.mjs  # Uses root public/img
```

## Benefits

✅ Single source of truth for images (root `public/img/`)
✅ Nuxt serves images correctly
✅ No need to duplicate images
✅ Upload script still works
✅ No router warnings

## Alternative Approaches (Not Used)

1. **Move images to `web/public/img`**
   - ❌ Would need to update upload script
   - ❌ Less portable structure

2. **Configure Nuxt to serve from root**
   - ❌ More complex configuration
   - ❌ Goes against Nuxt conventions

3. **Use Nuxt `public` alias**
   - ❌ Doesn't work for static assets
   - ❌ Only for imports

## Testing

After this fix, run:

```bash
./kill-ports.sh
rm -rf web/.nuxt web/node_modules/.cache
./dev.sh
```

Check:
- ✅ No Vue Router warnings in console
- ✅ Hero slider images load
- ✅ Portfolio images load
- ✅ Favicon displays

## Note

The symlink is platform-specific (works on macOS/Linux). For Windows, you would need to:
- Use `mklink /D` instead of `ln -s`, or
- Actually move/copy the images to `web/public/img`
