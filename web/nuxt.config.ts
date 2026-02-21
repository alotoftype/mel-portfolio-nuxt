// https://nuxt.com/docs/api/configuration/nuxt-config
const isDev = process.env.NODE_ENV !== "production";
const usePolling = process.env.CHOKIDAR_USEPOLLING === "true";
const isrSeconds = Number(process.env.NUXT_ISR_SECONDS || 60);
const sanityProjectId = process.env.SANITY_PROJECT_ID || "your-project-id";
const sanityDataset = process.env.SANITY_DATASET || "production";
const sanityStudioUrl =
  process.env.SANITY_STUDIO_URL ||
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  "http://localhost:3333";
const visualEditingEnabled = Boolean(process.env.SANITY_API_TOKEN && sanityStudioUrl);

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  dir: {
    public: "../public",
  },

  modules: ["@nuxt/image", "@nuxtjs/tailwindcss", "@nuxt/eslint", "@nuxtjs/sanity"],

  sanity: {
    projectId: sanityProjectId === "your-project-id" ? "" : sanityProjectId,
    dataset: sanityDataset,
    apiVersion: "2024-01-01",
    useCdn: true,
    visualEditing: visualEditingEnabled
      ? {
          token: process.env.SANITY_API_TOKEN,
          studioUrl: sanityStudioUrl,
          mode: "live-visual-editing",
          previewMode: true,
          stega: true,
        }
      : undefined,
  },

  image: {
    // `none` in dev makes local interaction faster by skipping on-the-fly IPX transforms.
    // Override with `NUXT_IMAGE_PROVIDER=ipx` when you need to test transformed images locally.
    provider: process.env.NUXT_IMAGE_PROVIDER || (isDev ? "none" : "ipx"),
    quality: 80,
    formats: ["webp"],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    domains: ['cdn.sanity.io'],
  },

  app: {
    head: {
      title: "MelShotya Photography",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "MelShotya Photography — Brooklyn-based photography studio specializing in portraits, events, fashion, and editorial work.",
        },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/img/favicon.png" },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Outfit:wght@300;400;500;600;700&display=swap",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },

  runtimeConfig: {
    public: {
      sanityProjectId,
      sanityDataset,
      sanityForceFallback: process.env.SANITY_FORCE_FALLBACK === "true",
      sanityFetchTimeoutMs: Number(process.env.SANITY_FETCH_TIMEOUT_MS || 1200),
      sanityStudioUrl,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
  },

  routeRules: {
    "/": { isr: isrSeconds },
    "/about": { isr: isrSeconds },
    "/contact": { isr: isrSeconds },
    "/portfolio": { isr: isrSeconds },
    "/portfolio/**": { isr: isrSeconds },
    "/blog": { isr: isrSeconds },
    "/blog/**": { isr: isrSeconds },
    "/video-gallery": { isr: isrSeconds },
  },

  vite: {
    optimizeDeps: {
      exclude: [
        "@sanity/ui",
        "react",
        "react-dom",
        "react-compiler-runtime",
        "styled-components",
      ],
    },
    server: {
      watch: {
        usePolling,
        interval: usePolling ? 1000 : undefined,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/sanity-studio/**",
          "**/.nuxt/**",
          "**/dist/**",
        ],
      },
      fs: {
        strict: false,
      },
    },
  },

  nitro: {
    preset: process.env.NITRO_PRESET || (process.env.NETLIFY ? "netlify" : undefined),
    storage: {
      cache: {
        driver: "memory",
      },
    },
  },
});
