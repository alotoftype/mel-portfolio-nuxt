# Quick Reference Card

## Start Development

```bash
./dev.sh              # Start everything (auto-kills ports)
./dev-web.sh          # Nuxt only (port 3000)
./dev-sanity.sh       # Sanity Studio only (port 3333)
```

## Port Management

```bash
./kill-ports.sh                 # Kill default ports (3000, 3333, 24678)
./kill-ports.sh 3000           # Kill specific port
./kill-ports.sh 3000 8080      # Kill multiple ports
lsof -i:3000                   # Check what's on port 3000
```

## Sanity Scripts (from sanity/ directory)

```bash
npm run migrate         # Migrate JSON → Sanity
npm run list-images     # Show required images
npm run upload-images   # Upload images to Sanity
npm run dev            # Start Studio (port 3333)
npm run deploy         # Deploy Studio to production
```

## URLs

| Service | URL |
|---------|-----|
| Website | http://localhost:3000 |
| CMS | http://localhost:3333 |
| Sanity Dashboard | https://www.sanity.io/manage/personal/project/2806by2t |

## Common Tasks

### Add Portfolio Item
1. Open Sanity Studio: `./dev-sanity.sh`
2. Go to http://localhost:3333
3. Click "Portfolio" → "Create"
4. Add images and content
5. Publish

### Fix Port Already in Use
```bash
./kill-ports.sh
./dev.sh
```

### Clear Cache & Restart
```bash
cd web
rm -rf .nuxt node_modules/.cache
npm run dev
```

### Check if Images Uploaded
1. Open http://localhost:3333
2. Go to Portfolio items
3. Verify images are attached

## Project IDs

- **Sanity Project:** 2806by2t
- **Dataset:** production

## File Locations

- **Schemas:** `sanity/schemas/`
- **Components:** `web/components/`
- **Pages:** `web/pages/`
- **Images:** `public/img/`
- **Data:** `web/data/`

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | `./kill-ports.sh` |
| Images not showing | Check Sanity Studio, clear cache |
| Connection error | Check `.env` files |
| Too many files open | Already handled by dev scripts |

## Full Documentation

- 📘 [Development Guide](./DEVELOPMENT-GUIDE.md)
- 🖼️ [Image Upload Guide](./sanity/IMAGE-UPLOAD-GUIDE.md)
