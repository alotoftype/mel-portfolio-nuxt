/**
 * Composable for triggering animations when elements scroll into view.
 * Replaces the old AOS library with a lightweight IntersectionObserver approach.
 */
export function useScrollAnimation() {
  onMounted(() => {
    const elements = document.querySelectorAll('.animate-on-scroll')
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    )

    elements.forEach((el) => observer.observe(el))

    onUnmounted(() => observer.disconnect())
  })
}
