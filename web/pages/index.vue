<script setup lang="ts">
const { getHomeData, getPortfolioItems, isSanityConfigured } = useSanityData()

const fallbackHomeData = await getHomeData()
const portfolioItems = await getPortfolioItems()
const homeQuery = `*[_type == "homePage"][0] {
  _id,
  _type,
  slider[] {
    _key,
    title,
    subtitle,
    description,
    "image": image.asset->url,
    buttonText,
    link
  },
  seo {
    metaTitle,
    metaDescription,
    "ogImage": ogImage.asset->url,
    noIndex
  },
  quote,
  ctaTitle,
  ctaSubtitle
}`
const homeQueryResult = isSanityConfigured
  ? await (useSanityQuery<any>(homeQuery) as any)
  : null

const homeData = computed(() => {
  const sanityHomeData = homeQueryResult?.data?.value
  if (sanityHomeData?.slider?.length) {
    return sanityHomeData
  }
  return fallbackHomeData
})

const homeSeo = computed(() => homeData.value?.seo || {})
const homeSeoTitle = computed(() => homeSeo.value.metaTitle || 'MelShotya Photography — Brooklyn, NY')
const homeSeoDescription = computed(() =>
  homeSeo.value.metaDescription ||
  'Brooklyn photography portfolio featuring portraits, engagements, fashion editorials, and event storytelling by MelShotya.'
)
const homeSeoImage = computed(() => homeSeo.value.ogImage || homeData.value?.slider?.[0]?.image || undefined)
const homeSeoRobots = computed(() => (homeSeo.value.noIndex ? 'noindex, nofollow' : undefined))

function homeDataAttr(path: string) {
  const encodeDataAttribute = homeQueryResult?.encodeDataAttribute?.value
  if (!encodeDataAttribute) return undefined
  return encodeDataAttribute(path)
}

useHead(() => ({
  title: homeSeoTitle.value,
}))

useSeoMeta(() => ({
  description: homeSeoDescription.value,
  ogTitle: homeSeoTitle.value,
  ogDescription: homeSeoDescription.value,
  ogImage: homeSeoImage.value,
  twitterImage: homeSeoImage.value,
  robots: homeSeoRobots.value,
}))
</script>

<template>
  <div>
    <!-- Hero Slider -->
    <HeroSlider :slides="homeData.slider" array-path="slider" :data-attribute="homeDataAttr" />

    <!-- Quote Section -->
    <section class="py-24 md:py-36 px-6 md:px-10 lg:px-16">
      <div class="max-w-4xl mx-auto text-center">
        <SectionReveal animation="fade-in" :delay="0">
          <div class="w-12 h-px bg-accent mx-auto mb-10" />
        </SectionReveal>
        <SectionReveal animation="fade-up" :delay="150">
          <blockquote
            class="font-display text-xl md:text-2xl lg:text-3xl text-ink-700 font-light leading-relaxed italic"
            :data-sanity="homeDataAttr('quote')"
          >
            {{ homeData.quote }}
          </blockquote>
        </SectionReveal>
        <SectionReveal animation="fade-in" :delay="400">
          <div class="w-12 h-px bg-accent mx-auto mt-10" />
        </SectionReveal>
      </div>
    </section>

    <!-- Portfolio Preview -->
    <section>
      <div class="text-center mb-4">
        <SectionReveal animation="fade-up" :delay="0">
          <p class="text-xs uppercase tracking-widest-xl text-ink-400 font-body mb-3">Selected Work</p>
        </SectionReveal>
        <SectionReveal animation="fade-up" :delay="100">
          <TextSplit
            text="Portfolio"
            tag="h2"
            class="font-display text-display-sm md:text-display-md text-ink-900 font-light justify-center"
            split-by="char"
            :stagger-ms="30"
          />
        </SectionReveal>
      </div>
      <PortfolioGrid :items="portfolioItems" :show-filter="true" />
    </section>

    <!-- Stats bar -->
    <section class="py-16 border-y border-ink-100">
      <div class="px-6 md:px-10 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 max-w-5xl mx-auto text-center">
        <SectionReveal
          v-for="(stat, i) in [
            { value: 500, suffix: '+', label: 'Sessions Shot' },
            { value: 12, suffix: '', label: 'Years Experience' },
            { value: 98, suffix: '%', label: 'Client Satisfaction' },
            { value: 50, suffix: '+', label: 'Awards Won' },
          ]"
          :key="stat.label"
          :delay="i * 100"
        >
          <div>
            <p class="font-display text-display-sm text-ink-800 font-light">
              <CountUp :to="stat.value" :suffix="stat.suffix" :duration="2000" />
            </p>
            <p class="text-2xs uppercase tracking-widest-xl text-ink-400 font-body mt-2">{{ stat.label }}</p>
          </div>
        </SectionReveal>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 md:py-32 px-6 md:px-10 lg:px-16 bg-ink-950 text-cream-50 relative grain">
      <div class="max-w-3xl mx-auto text-center">
        <SectionReveal animation="fade-up" :delay="0">
          <p class="text-xs uppercase tracking-widest-xl text-cream-300/50 font-body mb-5" :data-sanity="homeDataAttr('ctaSubtitle')">
            {{ homeData.ctaSubtitle || "Let's create something beautiful" }}
          </p>
        </SectionReveal>
        <SectionReveal animation="fade-up" :delay="150">
          <h2 class="font-display text-display-sm md:text-display-md font-light mb-8" :data-sanity="homeDataAttr('ctaTitle')">
            {{ homeData.ctaTitle || 'Ready to capture your story?' }}
          </h2>
        </SectionReveal>
        <SectionReveal animation="fade-up" :delay="300">
          <NuxtLink
            to="/contact"
            class="magnetic-btn inline-block text-xs uppercase tracking-widest-xl font-body border border-cream-100/30 px-8 py-4 transition-all duration-400"
          >
            <span>Get in Touch</span>
          </NuxtLink>
        </SectionReveal>
      </div>
    </section>
  </div>
</template>
