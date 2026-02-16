<script setup lang="ts">
/**
 * CountUp — animates a number from 0 to target when scrolled into view.
 * Used for stats sections, counters, etc.
 */

const props = withDefaults(defineProps<{
  to: number
  duration?: number
  suffix?: string
  prefix?: string
}>(), {
  duration: 2000,
  suffix: '',
  prefix: '',
})

const el = ref<HTMLElement | null>(null)
const currentValue = ref(0)
const isVisible = ref(false)

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function animateCount() {
  const start = performance.now()

  function tick(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / props.duration, 1)
    currentValue.value = Math.round(easeOutExpo(progress) * props.to)

    if (progress < 1) {
      requestAnimationFrame(tick)
    }
  }

  requestAnimationFrame(tick)
}

onMounted(() => {
  if (!el.value) return
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVisible.value) {
          isVisible.value = true
          animateCount()
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.3 }
  )
  observer.observe(el.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <span ref="el" class="tabular-nums">
    {{ prefix }}{{ currentValue }}{{ suffix }}
  </span>
</template>
