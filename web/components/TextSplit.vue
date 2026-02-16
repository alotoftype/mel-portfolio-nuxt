<script setup lang="ts">
/**
 * TextSplit — splits text into individual characters/words and reveals them
 * with staggered animation when scrolled into view.
 *
 * Usage:
 *   <TextSplit text="Hello World" tag="h1" class="font-display text-display-lg" />
 */

const props = withDefaults(defineProps<{
  text: string
  tag?: string
  splitBy?: 'word' | 'char'
  staggerMs?: number
}>(), {
  tag: 'span',
  splitBy: 'word',
  staggerMs: 40,
})

const container = ref<HTMLElement | null>(null)
const isVisible = ref(false)

const parts = computed(() => {
  if (props.splitBy === 'char') {
    return props.text.split('').map((char) => (char === ' ' ? '\u00A0' : char))
  }
  return props.text.split(' ')
})

onMounted(() => {
  if (!container.value) return
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.2 }
  )
  observer.observe(container.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <component :is="tag" ref="container" class="inline-flex flex-wrap">
    <span
      v-for="(part, i) in parts"
      :key="i"
      class="inline-block overflow-hidden"
    >
      <span
        class="inline-block transition-all duration-600 ease-expo-out"
        :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'"
        :style="{ transitionDelay: `${i * staggerMs}ms` }"
      >
        {{ part }}{{ splitBy === 'word' && i < parts.length - 1 ? '\u00A0' : '' }}
      </span>
    </span>
  </component>
</template>
