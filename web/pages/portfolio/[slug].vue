<script setup lang="ts">
const route = useRoute()
const { getPortfolioItem } = useSanityData()
useScrollAnimation()

const slug = route.params.slug as string
const item = await getPortfolioItem(slug)

if (!item) {
  throw createError({ statusCode: 404, message: 'Portfolio item not found' })
}

useHead({
  title: `${item.title} — MelShotya Photography`,
})

// Build gallery array from old data format
const galleryImages = computed(() => {
  if (Array.isArray(item.gallery)) {
    return item.gallery.map((g: any) => g.asset?.url || g.url || g)
  }
  if (item.gallery && typeof item.gallery === 'object') {
    return Object.values(item.gallery).filter(Boolean).map((img: any) =>
      typeof img === 'string' ? (img.startsWith('.') ? img.replace('.', '') : img) : img
    )
  }
  return []
})

// Parse HTML-style line breaks from old data
function cleanHtml(text: string) {
  if (!text) return ''
  return text.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]*>/g, '')
}
</script>

<template>
  <div v-if="item">
    <!-- Hero image -->
    <section class="relative h-[60vh] md:h-[75vh] overflow-hidden">
      <img
        :src="item.homeImage"
        :alt="item.title"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
      <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-16">
        <div class="max-w-4xl">
          <div class="flex gap-3 mb-4">
            <span
              v-for="cat in item.categories"
              :key="cat"
              class="text-2xs uppercase tracking-widest-xl text-cream-200/60 font-body"
            >
              {{ cat }}
            </span>
          </div>
          <h1 class="font-display text-display-md md:text-display-lg text-cream-50 font-light">
            {{ item.title }}
          </h1>
        </div>
      </div>
    </section>

    <!-- Project details -->
    <section class="py-16 md:py-24 px-6 md:px-10 lg:px-16">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <!-- Meta info -->
          <div class="space-y-8 animate-on-scroll">
            <div v-if="item.client">
              <p class="text-2xs uppercase tracking-widest-xl text-ink-400 font-body mb-2">Client</p>
              <p class="text-sm text-ink-700 font-body whitespace-pre-line">{{ cleanHtml(item.client) }}</p>
            </div>
            <div v-if="item.date">
              <p class="text-2xs uppercase tracking-widest-xl text-ink-400 font-body mb-2">Date</p>
              <p class="text-sm text-ink-700 font-body whitespace-pre-line">{{ cleanHtml(item.date) }}</p>
            </div>
            <div v-if="item.services">
              <p class="text-2xs uppercase tracking-widest-xl text-ink-400 font-body mb-2">Services</p>
              <p class="text-sm text-ink-700 font-body whitespace-pre-line">{{ cleanHtml(item.services) }}</p>
            </div>
            <div v-if="item.team">
              <p class="text-2xs uppercase tracking-widest-xl text-ink-400 font-body mb-2">Team</p>
              <p class="text-sm text-ink-700 font-body whitespace-pre-line">{{ cleanHtml(item.team) }}</p>
            </div>
          </div>

          <!-- Body content -->
          <div class="md:col-span-2 animate-on-scroll">
            <div v-if="item.body" class="prose prose-stone max-w-none font-body">
              <div v-for="(block, i) in item.body" :key="i" v-html="block" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section v-if="galleryImages.length" class="pb-20 md:pb-28 px-6 md:px-10 lg:px-16">
      <div class="max-w-7xl mx-auto">
        <h2 class="font-display text-2xl md:text-3xl text-ink-800 font-light mb-10 animate-on-scroll">
          Gallery
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <div
            v-for="(img, i) in galleryImages"
            :key="i"
            class="overflow-hidden cursor-pointer group animate-on-scroll"
            :class="i === 0 ? 'md:col-span-2 aspect-video' : 'aspect-[4/3]'"
            @click="useLightbox().openLightbox(img, `${item.title} — ${i + 1}`)"
          >
            <img
              :src="img"
              :alt="`${item.title} gallery image ${i + 1}`"
              class="w-full h-full object-cover transition-transform duration-800 ease-expo-out group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Back link -->
    <div class="px-6 md:px-10 lg:px-16 pb-16">
      <NuxtLink
        to="/portfolio"
        class="inline-flex items-center gap-2 text-xs uppercase tracking-widest-xl text-ink-500 font-body hover:text-ink-900 transition-colors duration-300"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 12H5m0 0l7 7m-7-7l7-7" />
        </svg>
        Back to Portfolio
      </NuxtLink>
    </div>
  </div>
</template>
