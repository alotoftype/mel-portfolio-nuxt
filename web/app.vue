<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const { getSiteSettings } = useSiteSettings()

const siteSettings = await getSiteSettings()

const baseSiteUrl = computed(() =>
  String(runtimeConfig.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '')
)
const canonicalUrl = computed(() => `${baseSiteUrl.value}${route.path}`)
const twitterHandle = computed(() => {
  const handle = (siteSettings.twitterHandle || '').trim()
  if (!handle) return ''
  return handle.startsWith('@') ? handle : `@${handle}`
})
const robots = computed(() => (siteSettings.robotsNoIndex ? 'noindex, nofollow' : 'index, follow'))

useHead(() => ({
  title: siteSettings.siteName,
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
}))

useSeoMeta(() => ({
  description: siteSettings.siteDescription,
  ogSiteName: siteSettings.siteName,
  ogTitle: siteSettings.siteName,
  ogDescription: siteSettings.siteDescription,
  ogImage: siteSettings.defaultOgImage || undefined,
  twitterCard: siteSettings.defaultOgImage ? 'summary_large_image' : 'summary',
  twitterSite: twitterHandle.value || undefined,
  twitterDescription: siteSettings.siteDescription,
  twitterImage: siteSettings.defaultOgImage || undefined,
  robots: robots.value,
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
