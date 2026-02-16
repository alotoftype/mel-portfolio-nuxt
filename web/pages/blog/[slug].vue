<script setup lang="ts">
const route = useRoute()
const { getBlogPosts } = useSanityData()
useScrollAnimation()

const allPosts = await getBlogPosts()
const slugOrId = route.params.slug as string

// Find post by slug or ID
const post = allPosts.find(
  (p: any) => String(p.slug || p.id) === slugOrId
)

if (!post) {
  throw createError({ statusCode: 404, message: 'Blog post not found' })
}

// Get related posts (same category, exclude current)
const relatedPosts = computed(() => {
  if (!post.categories?.length) return []
  return allPosts
    .filter(
      (p: any) =>
        p.id !== post.id &&
        p.categories?.some((c: string) => post.categories.includes(c))
    )
    .slice(0, 3)
})

// Get thumbnail image
const thumbnailImage = computed(() => {
  if (post.thumbnail) return post.thumbnail
  if (post.media?.images) return post.media.images
  if (post.sliderThumb?.[0]?.image) return post.sliderThumb[0].image
  return '/img/blog/01.jpg'
})

// Get slider images if format is slider
const sliderImages = computed(() => {
  if (post.format === 'slider' && post.sliderThumb) {
    return post.sliderThumb.map((s: any) => s.image)
  }
  return []
})

useHead({
  title: `${post.title} — MelShotya Blog`,
})
</script>

<template>
  <div v-if="post">
    <!-- Hero -->
    <section class="relative h-[50vh] md:h-[65vh] overflow-hidden">
      <img
        :src="thumbnailImage"
        :alt="post.title"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/30 to-transparent" />
      <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-16">
        <div class="max-w-3xl">
          <div class="flex items-center gap-3 mb-4">
            <span
              v-for="cat in post.categories"
              :key="cat"
              class="text-2xs uppercase tracking-widest-xl text-accent-light font-body"
            >
              {{ cat }}
            </span>
          </div>
          <h1 class="font-display text-display-sm md:text-display-md text-cream-50 font-light">
            {{ post.title }}
          </h1>
          <div class="flex items-center gap-4 mt-5">
            <span class="text-xs text-cream-300/70 font-body">
              By {{ post.author }}
            </span>
            <span class="w-1 h-1 rounded-full bg-cream-300/40" />
            <span class="text-xs text-cream-300/70 font-body">
              {{ post.date || post.publishedAt }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Slider gallery (if format is slider) -->
    <section v-if="sliderImages.length > 1" class="py-8 px-6 md:px-10 lg:px-16">
      <div class="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
        <div
          v-for="(img, i) in sliderImages"
          :key="i"
          class="shrink-0 w-[80vw] md:w-[45vw] lg:w-[30vw] snap-center cursor-pointer"
          @click="useLightbox().openLightbox(img, `${post.title} — ${i + 1}`)"
        >
          <img
            :src="img"
            :alt="`${post.title} image ${i + 1}`"
            class="w-full aspect-[3/2] object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <!-- Body content -->
    <article class="py-12 md:py-20 px-6 md:px-10 lg:px-16">
      <div class="max-w-2xl mx-auto">
        <!-- Portable text from Sanity -->
        <div v-if="Array.isArray(post.body)" class="prose prose-stone prose-lg max-w-none font-body">
          <template v-for="(block, i) in post.body" :key="i">
            <div v-html="block" />
          </template>
        </div>

        <!-- Tags -->
        <div v-if="post.tags?.length" class="mt-12 pt-8 border-t border-ink-100">
          <p class="text-2xs uppercase tracking-widest-xl text-ink-400 font-body mb-4">Tags</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="px-3 py-1.5 text-xs font-body text-ink-600 border border-ink-200 hover:border-ink-400 transition-colors cursor-default"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </article>

    <!-- Share + Author bar -->
    <section class="px-6 md:px-10 lg:px-16 pb-12">
      <div class="max-w-2xl mx-auto flex items-center justify-between py-6 border-t border-b border-ink-100">
        <div>
          <p class="text-2xs uppercase tracking-widest-xl text-ink-400 font-body mb-1">Written by</p>
          <p class="text-sm font-body text-ink-700">{{ post.author }}</p>
        </div>
        <div class="flex gap-3">
          <a
            :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent($route.fullPath)}`"
            target="_blank"
            rel="noopener"
            class="w-9 h-9 rounded-full border border-ink-200 flex items-center justify-center text-ink-400 hover:text-ink-700 hover:border-ink-400 transition-colors"
            aria-label="Share on Twitter"
          >
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent($route.fullPath)}`"
            target="_blank"
            rel="noopener"
            class="w-9 h-9 rounded-full border border-ink-200 flex items-center justify-center text-ink-400 hover:text-ink-700 hover:border-ink-400 transition-colors"
            aria-label="Share on Facebook"
          >
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.07 1.373.14V7.96c-.149-.016-.408-.024-.707-.024-1.004 0-1.39.38-1.39 1.369v1.667h2.83l-.554 3.667h-2.276v8.06C19.395 22.148 23 18.513 23 14c0-4.97-4.03-9-9-9s-9 4.03-9 9c0 4.085 2.72 7.531 6.44 8.625l.661.066z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Related Posts -->
    <section v-if="relatedPosts.length" class="px-6 md:px-10 lg:px-16 pb-20 md:pb-28">
      <div class="max-w-6xl mx-auto">
        <h2 class="font-display text-2xl text-ink-800 font-light mb-10 text-center animate-on-scroll">
          Related Posts
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article
            v-for="(related, i) in relatedPosts"
            :key="related.id || related._id"
            class="group animate-on-scroll"
            :style="{ animationDelay: `${i * 100}ms` }"
          >
            <NuxtLink
              :to="`/blog/${related.slug || related.id}`"
              class="block overflow-hidden aspect-[4/3] mb-4"
            >
              <img
                :src="related.thumbnail || related.media?.images || related.sliderThumb?.[0]?.image || '/img/blog/01.jpg'"
                :alt="related.title"
                class="w-full h-full object-cover transition-transform duration-600 ease-expo-out group-hover:scale-105"
                loading="lazy"
              />
            </NuxtLink>
            <NuxtLink :to="`/blog/${related.slug || related.id}`">
              <h3 class="font-display text-lg text-ink-800 font-light group-hover:text-accent transition-colors">
                {{ related.title }}
              </h3>
            </NuxtLink>
            <p class="text-xs text-ink-400 font-body mt-2">{{ related.date }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Back link -->
    <div class="px-6 md:px-10 lg:px-16 pb-16">
      <NuxtLink
        to="/blog"
        class="inline-flex items-center gap-2 text-xs uppercase tracking-widest-xl text-ink-500 font-body hover:text-ink-900 transition-colors duration-300"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 12H5m0 0l7 7m-7-7l7-7" />
        </svg>
        Back to Blog
      </NuxtLink>
    </div>
  </div>
</template>
