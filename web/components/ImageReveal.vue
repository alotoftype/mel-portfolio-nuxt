<script setup lang="ts">
import { safeAlt } from "~/utils/accessibility"

/**
 * ImageReveal — a wrapper that reveals images with a curtain/clip animation
 * when they scroll into view. Great for portfolio grids and hero sections.
 */

withDefaults(defineProps<{
  src: string
  alt?: string
  aspect?: string
  delay?: number
  grayscale?: boolean
}>(), {
  alt: '',
  aspect: 'aspect-[3/4]',
  delay: 0,
  grayscale: false,
})

const container = ref<HTMLElement | null>(null)
const isRevealed = ref(false)
const imageLoaded = ref(false)

function onLoad() {
  imageLoaded.value = true
}

onMounted(() => {
  if (!container.value) return
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isRevealed.value = true
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
  )
  observer.observe(container.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div
    ref="container"
    class="overflow-hidden"
    :class="aspect"
  >
    <div
      class="w-full h-full transition-all ease-expo-out"
      :class="[
        isRevealed && imageLoaded
          ? 'duration-[1.2s] [clip-path:inset(0_0_0_0)] scale-100'
          : 'duration-0 [clip-path:inset(100%_0_0_0)] scale-105',
      ]"
      :style="{ transitionDelay: `${delay}ms` }"
    >
      <img
        :src="src"
        :alt="safeAlt(alt, 'Image reveal')"
        class="w-full h-full object-cover transition-all duration-800 ease-expo-out"
        :class="[
          grayscale ? 'grayscale hover:grayscale-0' : '',
          'group-hover:scale-105',
        ]"
        loading="lazy"
        @load="onLoad"
      />
    </div>
  </div>
</template>
