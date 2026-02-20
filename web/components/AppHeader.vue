<script setup lang="ts">
const route = useRoute()
const isMenuOpen = ref(false)
const isScrolled = ref(false)

const { getNavigationByLocation } = useNavigation()

// Fetch navigation data from Sanity
const topCornerNav = await getNavigationByLocation('topCorner')
const rightSideNav = await getNavigationByLocation('rightSide')
const socialNav = await getNavigationByLocation('bottomRight')

const navItems = computed(() => topCornerNav?.items || [])
const rightSideLink = computed(() => rightSideNav?.items?.[0] || null)
const socialItems = computed(() => socialNav?.items || [])

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function onScroll() {
  isScrolled.value = window.scrollY > 60
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

watch(() => route.path, () => {
  closeMenu()
})
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-40 transition-all duration-400 ease-expo-out"
    :class="[
      isScrolled
        ? 'bg-cream-50/90 backdrop-blur-md shadow-sm py-4'
        : 'bg-transparent py-6',
    ]"
  >
    <div class="px-6 md:px-10 lg:px-16 flex items-center justify-between">
      <!-- Menu toggle -->
      <button
        class="group flex items-center gap-3"
        @click="toggleMenu"
        :aria-expanded="isMenuOpen"
        aria-label="Toggle navigation menu"
      >
        <div class="flex flex-col gap-1.5 w-6">
          <span
            class="block h-[1.5px] bg-ink-900 transition-all duration-400 ease-expo-out origin-center"
            :class="isMenuOpen ? 'rotate-45 translate-y-[4.5px]' : ''"
          />
          <span
            class="block h-[1.5px] bg-ink-900 transition-all duration-400 ease-expo-out"
            :class="isMenuOpen ? 'opacity-0 scale-x-0' : ''"
          />
          <span
            class="block h-[1.5px] bg-ink-900 transition-all duration-400 ease-expo-out origin-center"
            :class="isMenuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''"
          />
        </div>
        <span class="text-xs font-body uppercase tracking-widest-xl text-ink-600 hidden sm:inline">
          Menu
        </span>
      </button>

      <!-- Logo -->
      <NuxtLink
        to="/"
        class="absolute left-1/2 -translate-x-1/2 text-center"
      >
        <h1 class="font-display text-2xl md:text-3xl font-light tracking-wide text-ink-900">
          MelShotya
        </h1>
      </NuxtLink>

      <!-- Right side menu -->
      <div class="w-20 flex justify-end">
        <NuxtLink
          v-if="rightSideLink"
          :to="rightSideLink.url"
          :target="rightSideLink.openInNewTab ? '_blank' : undefined"
          :rel="rightSideLink.openInNewTab ? 'noopener noreferrer' : undefined"
          class="text-xs font-body uppercase tracking-widest-xl text-ink-600 hover:text-ink-900 transition-colors duration-300 hidden sm:inline"
        >
          {{ rightSideLink.label }}
        </NuxtLink>
      </div>
    </div>
  </header>

  <!-- Slide-out navigation overlay -->
  <Transition name="overlay">
    <div
      v-if="isMenuOpen"
      class="fixed inset-0 bg-ink-950/30 backdrop-blur-sm z-40"
      @click="closeMenu"
    />
  </Transition>

  <!-- Slide-out navigation panel -->
  <Transition name="slide-panel">
    <nav
      v-if="isMenuOpen"
      class="fixed top-0 left-0 bottom-0 w-full max-w-md bg-cream-50 z-50 flex flex-col"
    >
      <!-- Close button -->
      <div class="flex justify-between items-center p-6 md:p-10">
        <span class="text-2xs uppercase tracking-widest-xl text-ink-400 font-body">Navigation</span>
        <button
          @click="closeMenu"
          class="w-10 h-10 flex items-center justify-center text-ink-600 hover:text-ink-900 transition-colors"
          aria-label="Close menu"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Nav links -->
      <div class="flex-1 flex flex-col justify-center px-6 md:px-10 -mt-16">
        <ul class="space-y-1">
          <li v-for="(item, i) in navItems" :key="item.url">
            <a
              v-if="item.openInNewTab"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="block py-3 font-display text-display-sm md:text-display-md text-ink-800 hover:text-accent transition-colors duration-400"
              :style="{ animationDelay: `${(i + 1) * 80}ms` }"
            >
              {{ item.label }}
            </a>
            <NuxtLink
              v-else
              :to="item.url"
              class="block py-3 font-display text-display-sm md:text-display-md text-ink-800 hover:text-accent transition-colors duration-400"
              :class="route.path === item.url ? 'text-accent' : ''"
              :style="{ animationDelay: `${(i + 1) * 80}ms` }"
              @click="closeMenu"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Bottom info -->
      <div class="p-6 md:p-10 border-t border-ink-100">
        <div class="flex items-center justify-between text-xs text-ink-400 font-body">
          <a href="mailto:melshotya@gmail.com" class="hover:text-ink-700 transition-colors">
            melshotya@gmail.com
          </a>
          <div v-if="socialItems.length > 0" class="flex gap-4">
            <a
              v-for="social in socialItems"
              :key="social.url"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-ink-700 transition-colors"
            >
              {{ social.label }}
            </a>
          </div>
        </div>
      </div>
    </nav>
  </Transition>
</template>
