<script setup lang="ts">
interface Slide {
  _id?: string
  title: string
  subtitle?: string
  image: string
  buttonText?: string
  link?: string
}

const props = withDefaults(defineProps<{
  slides: Slide[]
}>(), {
  slides: () => [],
})

const currentSlide = ref(0)
const isTransitioning = ref(false)
let autoplayInterval: ReturnType<typeof setInterval> | null = null

const totalSlides = computed(() => props.slides.length)

function goToSlide(index: number) {
  if (isTransitioning.value || index === currentSlide.value) return
  isTransitioning.value = true
  currentSlide.value = index
  setTimeout(() => {
    isTransitioning.value = false
  }, 800)
}

function nextSlide() {
  goToSlide((currentSlide.value + 1) % totalSlides.value)
}

function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 5000)
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

onMounted(() => {
  if (totalSlides.value > 1) {
    startAutoplay()
  }
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <section
    class="relative h-screen w-full overflow-hidden grain"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <!-- Slides -->
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="absolute inset-0 transition-opacity duration-1000 ease-expo-out"
      :class="currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'"
    >
      <img
        :src="slide.image"
        :alt="slide.title"
        class="w-full h-full object-cover"
        :class="currentSlide === index ? 'scale-100' : 'scale-105'"
        style="transition: transform 6s cubic-bezier(0.16, 1, 0.3, 1);"
      />
      <!-- Dark gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/20 to-transparent" />
    </div>

    <!-- Content overlay -->
    <div class="absolute inset-0 z-20 flex items-end pb-24 md:pb-32 px-6 md:px-10 lg:px-16">
      <div class="max-w-3xl">
        <Transition name="slide-text" mode="out-in">
          <div :key="currentSlide">
            <p
              v-if="slides[currentSlide]?.subtitle"
              class="text-xs uppercase tracking-widest-xl text-cream-200/80 font-body mb-4"
            >
              {{ slides[currentSlide].subtitle }}
            </p>
            <h2 class="font-display text-display-md md:text-display-lg lg:text-display-xl text-cream-50 font-light">
              {{ slides[currentSlide]?.title }}
            </h2>
            <NuxtLink
              v-if="slides[currentSlide]?.buttonText"
              :to="slides[currentSlide]?.link || '/portfolio'"
              class="inline-block mt-8 text-xs uppercase tracking-widest-xl text-cream-100 font-body border-b border-cream-100/40 pb-1 hover:border-cream-100 transition-colors duration-400"
            >
              {{ slides[currentSlide].buttonText }}
            </NuxtLink>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Slide indicators -->
    <div v-if="totalSlides > 1" class="absolute bottom-10 right-6 md:right-10 lg:right-16 z-20 flex gap-2 items-center">
      <span class="text-2xs text-cream-200/60 font-body tabular-nums mr-2">
        {{ String(currentSlide + 1).padStart(2, '0') }} / {{ String(totalSlides).padStart(2, '0') }}
      </span>
      <button
        v-for="(_, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        class="w-8 h-[2px] transition-all duration-400"
        :class="currentSlide === index ? 'bg-cream-50' : 'bg-cream-50/30 hover:bg-cream-50/60'"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>
  </section>
</template>

