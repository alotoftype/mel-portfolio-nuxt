<script setup lang="ts">
withDefaults(defineProps<{
  tag?: string
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'reveal'
  delay?: number
  threshold?: number
}>(), {
  tag: 'div',
  animation: 'fade-up',
  delay: 0,
  threshold: 0.1,
})

const el = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  if (!el.value) return
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )
  observer.observe(el.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <component
    :is="tag"
    ref="el"
    class="transition-all duration-800 ease-expo-out"
    :class="{
      'opacity-0 translate-y-6': animation === 'fade-up' && !isVisible,
      'opacity-100 translate-y-0': animation === 'fade-up' && isVisible,
      'opacity-0': animation === 'fade-in' && !isVisible,
      'opacity-100': animation === 'fade-in' && isVisible,
      'opacity-0 translate-x-6': animation === 'slide-left' && !isVisible,
      'opacity-100 translate-x-0': animation === 'slide-left' && isVisible,
      'opacity-0 -translate-x-6': animation === 'slide-right' && !isVisible,
    }"
    :style="{ transitionDelay: `${delay}ms` }"
  >
    <slot />
  </component>
</template>
