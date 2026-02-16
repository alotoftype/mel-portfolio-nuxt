<script setup lang="ts">
const { isOpen, currentImage, currentTitle, closeLightbox } = useLightbox()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
}

watch(isOpen, (val) => {
  if (val) {
    document.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Transition name="lightbox">
    <div
      v-if="isOpen"
      class="lightbox-overlay flex items-center justify-center p-4 md:p-10"
      @click.self="closeLightbox"
    >
      <!-- Close button -->
      <button
        @click="closeLightbox"
        class="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-cream-200 hover:text-cream-50 transition-colors z-10"
        aria-label="Close lightbox"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Image -->
      <div class="relative max-w-6xl max-h-[85vh] animate-scale-in">
        <img
          :src="currentImage"
          :alt="currentTitle"
          class="max-w-full max-h-[85vh] object-contain"
        />
        <p v-if="currentTitle" class="absolute -bottom-10 left-0 text-sm text-cream-300/60 font-body">
          {{ currentTitle }}
        </p>
      </div>
    </div>
  </Transition>
</template>

