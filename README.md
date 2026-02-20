# MelShotya Photography Portfolio

A monorepo containing the Nuxt 3 frontend and Sanity Studio CMS for MelShotya Photography.

## Project Structure

```
mel-portfolio-nuxt/
├── web/          # Nuxt 3 frontend application
└── sanity/       # Sanity Studio CMS
```

## Getting Started

### Prerequisites

- Node.js `>= 22.9.0` (or Node `24.x`)
- npm `>= 10`

### Install Dependencies

```bash
# Install root dependencies and all workspace dependencies
npm run install:all
```

### Run Development Servers

**✨ Recommended: Start Everything**
```bash
./dev.sh
```
This automatically:
- Kills any processes on ports 3000 & 3333
- Starts both Nuxt and Sanity Studio
- Opens at http://localhost:3000 (Nuxt) and http://localhost:3333 (Sanity)

**Individual Services:**
```bash
# Nuxt frontend only
./dev-web.sh        # http://localhost:3000

# Sanity Studio only
./dev-sanity.sh     # http://localhost:3333

# Or using npm
npm run dev         # Both servers
npm run dev:web     # Nuxt only
npm run dev:sanity  # Sanity only
```

### Port Management

All dev scripts automatically kill processes on their ports before starting. You can also manually kill ports:

```bash
./kill-ports.sh              # Kill default ports (3000, 3333)
./kill-ports.sh 3000 8080   # Kill specific ports
```

## Development

Both applications can run simultaneously. The Nuxt frontend connects to the Sanity project via the `@nuxtjs/sanity` module.

### Environment Variables

Each project has its own `.env` file:
- `web/.env` - Nuxt configuration
- `sanity/.env` - Sanity configuration

See `.env.example` files in each directory for required variables.

If you want the frontend to run fully offline (without reaching Sanity), set:

```bash
# web/.env
SANITY_FORCE_FALLBACK=true
```

For faster local interaction, you can also set:

```bash
# web/.env
SANITY_FETCH_TIMEOUT_MS=1200
NUXT_IMAGE_PROVIDER=none
CHOKIDAR_USEPOLLING=false
```

### Documentation

- 📘 [**Complete Development Guide**](./docs/DEVELOPMENT-GUIDE.md) - Comprehensive documentation
- 🖼️ [**Image Upload Guide**](./sanity/IMAGE-UPLOAD-GUIDE.md) - Managing images in Sanity

### Sanity Management Scripts

From the `sanity/` directory:

```bash
npm run migrate         # Migrate JSON data to Sanity
npm run list-images     # List required images
npm run upload-images   # Upload images to Sanity CDN
npm run dev            # Start Sanity Studio
npm run deploy         # Deploy Studio to production
```

## Deployment

- **Frontend**: Deployed to Netlify
- **Sanity Studio**: Deployed to Sanity's hosting

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, Tailwind CSS, TypeScript
- **CMS**: Sanity Studio
- **Hosting**: Netlify (frontend), Sanity (studio)
