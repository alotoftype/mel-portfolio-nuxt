# MelShotya Portfolio - Development Guide

## Quick Start

### Start Everything
```bash
./dev.sh
```
This will:
1. Kill any processes on ports 3000 and 3333
2. Start both Nuxt (port 3000) and Sanity Studio (port 3333)

### Start Individual Services

**Nuxt App Only:**
```bash
./dev-web.sh
```
Opens at http://localhost:3000

**Sanity Studio Only:**
```bash
./dev-sanity.sh
```
Opens at http://localhost:3333

## Port Management

### Kill Ports Before Starting
All dev scripts automatically kill processes on their ports before starting. You can also manually kill ports:

```bash
# Kill default ports (3000, 3333, 24678)
./kill-ports.sh

# Kill specific ports
./kill-ports.sh 3000
./kill-ports.sh 3000 3333
./kill-ports.sh 8080 8081 8082
```

### Check What's Running on a Port
```bash
lsof -i:3000    # Check port 3000
lsof -i:3333    # Check port 3333
```

### Manually Kill a Process
```bash
# Find the process
lsof -ti:3000

# Kill it
kill -9 $(lsof -ti:3000)
```

## Project Structure

```
mel-portfolio-nuxt/
├── web/                  # Nuxt 3 application
│   ├── pages/           # Vue pages
│   ├── components/      # Vue components
│   ├── composables/     # Vue composables (including Sanity integration)
│   ├── data/           # JSON data (used for migration)
│   └── .env            # Nuxt environment variables
├── sanity/              # Sanity Studio
│   ├── schemas/        # Sanity content schemas
│   ├── scripts/        # Migration and upload scripts
│   └── .env            # Sanity environment variables
├── public/              # Shared public assets (images)
└── *.sh                # Development scripts
```

## Environment Variables

### Web (.env)
```env
SANITY_PROJECT_ID=2806by2t
SANITY_DATASET=production
SANITY_API_TOKEN=your-token-here
```

### Sanity (.env)
```env
SANITY_STUDIO_PROJECT_ID=2806by2t
SANITY_STUDIO_DATASET=production
SANITY_API_TOKEN=your-token-here
```

## Sanity Scripts

From the `sanity/` directory:

```bash
# Migrate JSON data to Sanity
npm run migrate

# List all required images
npm run list-images

# Upload images to Sanity
npm run upload-images

# Start Sanity Studio
npm run dev

# Deploy Sanity Studio to production
npm run deploy
```

## Common Issues & Solutions

### Port Already in Use
**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
./kill-ports.sh 3000
```
Or restart the dev script - it now auto-kills ports.

### Images Not Showing
**Problem:** Portfolio shows placeholders instead of images

**Solution 1:** Check if images are uploaded to Sanity
```bash
cd sanity && npm run dev
# Open http://localhost:3333 and verify images exist
```

**Solution 2:** Clear Nuxt cache and restart
```bash
cd web
rm -rf .nuxt node_modules/.cache
npm run dev
```

### Sanity Connection Error
**Problem:** `Error: Invalid projectId`

**Solution:** Verify environment variables
```bash
# Check web/.env has correct SANITY_PROJECT_ID
cat web/.env | grep SANITY_PROJECT_ID

# Check sanity/.env has correct SANITY_STUDIO_PROJECT_ID
cat sanity/.env | grep SANITY_STUDIO_PROJECT_ID
```

### File Descriptor Limit
**Problem:** `EMFILE: too many open files`

**Solution:** The dev scripts already handle this with `ulimit -n 10240`

If you need to increase it manually:
```bash
ulimit -n 10240
```

## Development Workflow

### Adding New Portfolio Items

1. **Via Sanity Studio (Recommended):**
   ```bash
   cd sanity && npm run dev
   ```
   - Open http://localhost:3333
   - Go to "Portfolio"
   - Click "Create" and add your item
   - Upload images directly

2. **Via JSON Migration:**
   - Add item to `web/data/portfolio.json`
   - Add images to `public/img/portfolio/`
   - Run migration:
     ```bash
     cd sanity
     npm run migrate
     npm run upload-images
     ```

### Making Schema Changes

1. Edit schemas in `sanity/schemas/`
2. Restart Sanity Studio
3. Changes are reflected immediately

### Deploying

**Deploy Sanity Studio:**
```bash
cd sanity
npm run deploy
```

**Deploy Nuxt App:**
```bash
cd web
npm run build
npm run preview  # Test production build locally
```

Then deploy to Netlify, Vercel, etc.

## Ports Reference

| Service | Port | URL |
|---------|------|-----|
| Nuxt Dev Server | 3000 | http://localhost:3000 |
| Sanity Studio | 3333 | http://localhost:3333 |
| Vite HMR (Sanity) | 24678 | Internal |

## Useful Commands

### Check All Ports
```bash
lsof -i:3000 -i:3333 -i:24678
```

### Kill All Dev Processes
```bash
./kill-ports.sh
# or
pkill -f "nuxt dev"
pkill -f "sanity dev"
```

### View Logs
```bash
# Nuxt logs
cd web && npm run dev

# Sanity logs
cd sanity && npm run dev
```

### Clean Everything
```bash
# Clean Nuxt
cd web
rm -rf .nuxt node_modules/.cache dist

# Clean Sanity
cd sanity
rm -rf node_modules/.sanity

# Reinstall
cd .. && npm run install:all
```

## Tips

- **Always use the dev scripts** (`./dev.sh`, `./dev-web.sh`, `./dev-sanity.sh`) - they handle port cleanup automatically
- **Check Sanity Studio** first if data isn't showing - content might not be published
- **Use Sanity Studio** for content editing - it's much easier than JSON
- **Image CDN** is automatic - Sanity handles optimization and delivery
- **Hot reload** works for both Nuxt and Sanity Studio

## Getting Help

- Sanity Docs: https://www.sanity.io/docs
- Nuxt Docs: https://nuxt.com/docs
- Project Issues: Check the console for errors
- Sanity Dashboard: https://www.sanity.io/manage/personal/project/2806by2t
