const isOpen = ref(false)
const currentImage = ref('')
const currentTitle = ref('')

export function useLightbox() {
  function openLightbox(image: string, title?: string) {
    currentImage.value = image
    currentTitle.value = title || ''
    isOpen.value = true
  }

  function closeLightbox() {
    isOpen.value = false
  }

  return {
    isOpen: readonly(isOpen),
    currentImage: readonly(currentImage),
    currentTitle: readonly(currentTitle),
    openLightbox,
    closeLightbox,
  }
}
