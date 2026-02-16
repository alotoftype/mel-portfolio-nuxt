<script setup lang="ts">
const { getPortfolioItems } = useSanityData()
useScrollAnimation()

const allItems = await getPortfolioItems()

// Filter items that have video URLs
const videoItems = computed(() =>
  allItems.filter((item: any) => item.videoUrl)
)

// Also show all items as a fallback visual gallery
const galleryItems = computed(() =>
  videoItems.value.length ? videoItems.value : allItems
)

const isVideoOpen = ref(false)
const currentVideoUrl = ref('')

function openVideo(url: string) {
  // Convert watch URL to embed URL if needed
  let embedUrl = url
  if (url.includes('youtube.com/watch')) {
    const id = new URL(url).searchParams.get('v')
    embedUrl = `https://www.youtube.com/embed/${id}`
  }
  currentVideoUrl.value = embedUrl
  isVideoOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeVideo() {
  isVideoOpen.value = false
  currentVideoUrl.value = ''
  document.body.style.overflow = ''
}

useHead({
  title: 'Video Gallery — MelShotya Photography',
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="pt-32 pb-16 md:pt-40 md:pb-20 px-6 md:px-10 lg:px-16 text-center">
      <p class="text-xs uppercase tracking-widest-xl text-ink-400 font-body mb-4 animate-on-scroll">
        Motion & Film
      </p>
      <h1 class="font-display text-display-md md:text-display-lg text-ink-900 font-light animate-on-scroll">
        Video Gallery
      </h1>
      <p class="max-w-xl mx-auto mt-6 text-ink-500 font-body text-sm leading-relaxed animate-on-scroll">
        Behind the scenes, highlight reels, and cinematic moments from our shoots.
      </p>
    </section>

    <div class="divider mx-6 md:mx-10 lg:mx-16" />

    <!-- Video Grid -->
    <section class="px-6 md:px-10 lg:px-16 py-16 md:py-24">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        <div
          v-for="(item, i) in galleryItems"
          :key="item.id"
          class="group relative cursor-pointer overflow-hidden aspect-video animate-on-scroll"
          :style="{ animationDelay: `${i * 80}ms` }"
          @click="item.videoUrl ? openVideo(item.videoUrl) : useLightbox().openLightbox(item.homeImage, item.title)"
        >
          <img
            :src="item.homeImage"
            :alt="item.title"
            class="w-full h-full object-cover transition-transform duration-800 ease-expo-out group-hover:scale-105"
            loading="lazy"
          />

          <!-- Overlay -->
          <div class="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/40 transition-all duration-600" />

          <!-- Play button (if video) -->
          <div
            v-if="item.videoUrl"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-cream-50/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-cream-50/40 group-hover:scale-110 transition-all duration-400">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-cream-50 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>

          <!-- Info -->
          <div class="absolute bottom-0 left-0 right-0 p-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <h3 class="font-display text-lg text-cream-50 font-light">{{ item.title }}</h3>
            <p v-if="item.excerpt" class="text-xs text-cream-200/60 font-body mt-1">{{ item.excerpt }}</p>
          </div>
        </div>
      </div>

      <div v-if="!galleryItems.length" class="text-center py-20">
        <p class="text-ink-400 font-body">No videos available yet. Check back soon.</p>
      </div>
    </section>

    <!-- Video Modal -->
    <Teleport to="body">
      <Transition name="video-modal">
        <div
          v-if="isVideoOpen"
          class="fixed inset-0 z-50 bg-ink-950/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          @click.self="closeVideo"
        >
          <button
            @click="closeVideo"
            class="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-cream-200 hover:text-cream-50 transition-colors z-10"
            aria-label="Close video"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="w-full max-w-5xl aspect-video animate-scale-in">
            <iframe
              :src="currentVideoUrl + '?autoplay=1'"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.video-modal-enter-active { transition: opacity 0.3s ease; }
.video-modal-leave-active { transition: opacity 0.25s ease; }
.video-modal-enter-from,
.video-modal-leave-to { opacity: 0; }
</style>
