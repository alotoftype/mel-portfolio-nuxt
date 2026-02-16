// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },

  modules: ["@nuxt/image", "@nuxtjs/tailwindcss"],

  image: {
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
    sanityToken: process.env.SANITY_API_TOKEN || "",
    public: {
      sanityProjectId: process.env.SANITY_PROJECT_ID || "your-project-id",
      sanityDataset: process.env.SANITY_DATASET || "production",
    },
  },

  routeRules: {
    "/": { prerender: true },
    "/about": { prerender: true },
    "/portfolio": { prerender: true },
    "/contact": { prerender: true },
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
    resolve: {
      alias: {
        // Prevent React from being loaded in Nuxt
        'react': 'vue',
        'react-dom': 'vue',
        'react-compiler-runtime': false,
      },
    },
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
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
    storage: {
      cache: {
        driver: "memory",
      },
    },
  },
});
