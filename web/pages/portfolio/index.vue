<script setup lang="ts">
const { getPortfolioItems } = useSanityData()
useScrollAnimation()

const portfolioItems = await getPortfolioItems()

useHead({
  title: 'Portfolio — MelShotya Photography',
})

useSeoMeta({
  description:
    'Browse the MelShotya portfolio featuring engagement shoots, portraits, fashion editorials, and event photography.',
  ogTitle: 'Portfolio — MelShotya Photography',
  ogDescription:
    'Browse the MelShotya portfolio featuring engagement shoots, portraits, fashion editorials, and event photography.',
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="pt-32 pb-16 md:pt-40 md:pb-20 px-6 md:px-10 lg:px-16 text-center">
      <p class="text-xs uppercase tracking-widest-xl text-ink-400 font-body mb-4 animate-on-scroll">
        Our Work
      </p>
      <h1 class="font-display text-display-md md:text-display-lg text-ink-900 font-light animate-on-scroll">
        Portfolio
      </h1>
      <p class="max-w-xl mx-auto mt-6 text-ink-500 font-body text-sm leading-relaxed animate-on-scroll">
        A curated collection of moments captured across engagements, portraits,
        fashion editorials, events, and marketing campaigns.
      </p>
    </section>

    <div class="divider mx-6 md:mx-10 lg:mx-16" />

    <!-- Portfolio Grid with filter -->
    <PortfolioGrid :items="portfolioItems" :show-filter="true" />
  </div>
</template>
