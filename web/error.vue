<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(() => props.error?.statusCode === 404)

useHead({
  title: is404.value ? 'Page Not Found — MelShotya' : 'Error — MelShotya',
})

function handleClear() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen bg-cream-50 flex flex-col">
    <!-- Minimal header -->
    <header class="py-6 px-6 md:px-10 lg:px-16">
      <NuxtLink to="/" class="font-display text-2xl font-light text-ink-900 tracking-wide">
        MelShotya
      </NuxtLink>
    </header>

    <!-- Error content -->
    <main class="flex-1 flex items-center justify-center px-6">
      <div class="text-center max-w-lg -mt-20">
        <!-- Big number -->
        <p class="font-display text-[10rem] md:text-[14rem] leading-none text-ink-100 font-light select-none">
          {{ error?.statusCode || '???' }}
        </p>

        <!-- Message -->
        <h1 class="font-display text-display-sm md:text-display-md text-ink-800 font-light -mt-8 relative z-10">
          {{ is404 ? 'Page not found' : 'Something went wrong' }}
        </h1>

        <p class="text-sm text-ink-500 font-body mt-4 leading-relaxed">
          <template v-if="is404">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </template>
          <template v-else>
            {{ error?.message || 'An unexpected error occurred.' }}
          </template>
        </p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button
            @click="handleClear"
            class="inline-block text-xs uppercase tracking-widest-xl font-body border border-ink-900 text-ink-900 px-8 py-4 hover:bg-ink-900 hover:text-cream-50 transition-all duration-400"
          >
            Go Home
          </button>
          <NuxtLink
            to="/portfolio"
            class="inline-block text-xs uppercase tracking-widest-xl font-body border border-ink-200 text-ink-600 px-8 py-4 hover:border-ink-400 hover:text-ink-900 transition-all duration-400"
            @click="clearError"
          >
            View Portfolio
          </NuxtLink>
        </div>

        <!-- Decorative line -->
        <div class="w-16 h-px bg-accent mx-auto mt-14" />
      </div>
    </main>
  </div>
</template>
