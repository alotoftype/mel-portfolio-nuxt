<script setup lang="ts">
import { safeAlt } from "~/utils/accessibility"
import { isExternalUrl, normalizeOptionalUrl } from '~/utils/links'

interface Slide {
  _id?: string
  _key?: string
  title: string
  subtitle?: string
  image: string
  buttonText?: string
  link?: string
}

const props = withDefaults(defineProps<{
  slides: Slide[]
  arrayPath?: string
  dataAttribute?: ((path: string) => string | undefined) | null
}>(), {
  slides: () => [],
  arrayPath: 'slider',
  dataAttribute: null,
})

const currentSlide = ref(0)
const isTransitioning = ref(false)
let autoplayInterval: ReturnType<typeof setInterval> | null = null

const totalSlides = computed(() => props.slides.length)
const currentSlidePath = computed(() => buildSlidePath(props.slides[currentSlide.value], currentSlide.value))
const currentCtaLink = computed(() => normalizeOptionalUrl(props.slides[currentSlide.value]?.link) || '/portfolio')
const currentCtaIsExternal = computed(() => isExternalUrl(currentCtaLink.value))

function buildSlidePath(slide?: Slide, index = 0) {
  if (!slide) return ''
  return slide._key
    ? `${props.arrayPath}[_key=="${slide._key}"]`
    : `${props.arrayPath}[${index}]`
}

function encodeDataAttribute(path?: string) {
  if (!path || !props.dataAttribute) return undefined
  return props.dataAttribute(path)
}

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
    :data-sanity="encodeDataAttribute(arrayPath)"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <!-- Slides -->
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="absolute inset-0 transition-opacity duration-1000 ease-expo-out"
      :class="currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      :data-sanity="encodeDataAttribute(buildSlidePath(slide, index))"
    >
      <NuxtImg
        :src="slide.image"
        :alt="safeAlt(slide.title, 'Hero image')"
        class="w-full h-full object-cover"
        :class="currentSlide === index ? 'scale-100' : 'scale-105'"
        style="transition: transform 6s cubic-bezier(0.16, 1, 0.3, 1);"
        width="1920"
        height="1080"
        format="webp"
        quality="85"
        :loading="index === 0 ? 'eager' : 'lazy'"
        :preload="index === 0"
        densities="x1"
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
              :data-sanity="encodeDataAttribute(currentSlidePath ? `${currentSlidePath}.subtitle` : undefined)"
            >
              {{ slides[currentSlide].subtitle }}
            </p>
            <h2
              class="font-display text-display-md md:text-display-lg lg:text-display-xl text-cream-50 font-light"
              :data-sanity="encodeDataAttribute(currentSlidePath ? `${currentSlidePath}.title` : undefined)"
            >
              {{ slides[currentSlide]?.title }}
            </h2>
            <a
              v-if="slides[currentSlide]?.buttonText && currentCtaIsExternal"
              :href="currentCtaLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block mt-8 text-xs uppercase tracking-widest-xl text-cream-100 font-body border-b border-cream-100/40 pb-1 hover:border-cream-100 transition-colors duration-400"
              :data-sanity="encodeDataAttribute(currentSlidePath ? `${currentSlidePath}.buttonText` : undefined)"
            >
              {{ slides[currentSlide].buttonText }}
            </a>
            <NuxtLink
              v-else-if="slides[currentSlide]?.buttonText"
              :to="currentCtaLink"
              class="inline-block mt-8 text-xs uppercase tracking-widest-xl text-cream-100 font-body border-b border-cream-100/40 pb-1 hover:border-cream-100 transition-colors duration-400"
              :data-sanity="encodeDataAttribute(currentSlidePath ? `${currentSlidePath}.buttonText` : undefined)"
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
