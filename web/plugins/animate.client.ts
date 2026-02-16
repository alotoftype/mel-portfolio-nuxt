/**
 * v-animate directive
 *
 * Usage:
 *   <div v-animate>                    — default fade-up
 *   <div v-animate="'fade-in'">       — fade in only
 *   <div v-animate="'slide-left'">    — slide in from left
 *   <div v-animate.delay-200>         — with 200ms delay
 *   <div v-animate.delay-400>         — with 400ms delay
 *   <div v-animate.once>              — only animate once (default)
 */

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('animate', {
    mounted(el, binding) {
      const animation = binding.value || 'fade-up'
      const modifiers = binding.modifiers || {}

      // Extract delay from modifiers like delay-200, delay-400
      let delay = 0
      for (const mod of Object.keys(modifiers)) {
        if (mod.startsWith('delay-')) {
          delay = parseInt(mod.replace('delay-', ''), 10)
        }
      }

      // Set initial state
      el.style.opacity = '0'
      el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`
      el.style.transitionDelay = `${delay}ms`

      switch (animation) {
        case 'fade-up':
          el.style.transform = 'translateY(24px)'
          break
        case 'fade-in':
          break
        case 'slide-left':
          el.style.transform = 'translateX(24px)'
          break
        case 'slide-right':
          el.style.transform = 'translateX(-24px)'
          break
        case 'scale':
          el.style.transform = 'scale(0.95)'
          break
        case 'reveal':
          el.style.clipPath = 'inset(100% 0 0 0)'
          el.style.transition = `clip-path 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease`
          el.style.transitionDelay = `${delay}ms`
          break
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.style.opacity = '1'
              el.style.transform = 'translateY(0) translateX(0) scale(1)'
              if (animation === 'reveal') {
                el.style.clipPath = 'inset(0 0 0 0)'
              }
              observer.unobserve(el)
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -40px 0px',
        }
      )

      observer.observe(el)

      // Store observer for cleanup
      ;(el as any).__animateObserver = observer
    },

    unmounted(el) {
      const observer = (el as any).__animateObserver
      if (observer) {
        observer.disconnect()
      }
    },
  })
})
