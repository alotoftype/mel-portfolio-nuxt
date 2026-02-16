<script setup lang="ts">
const year = new Date().getFullYear()

const { getNavigationByLocation } = useNavigation()

// Fetch navigation data from Sanity
const bottomLeftNav = await getNavigationByLocation('bottomLeft')
const bottomRightNav = await getNavigationByLocation('bottomRight')

const footerLinks = computed(() => bottomLeftNav?.items || [])
const socialLinks = computed(() => bottomRightNav?.items || [])
const showFullSocialNames = computed(() => bottomRightNav?.showFullSocialNames ?? true)
</script>

<template>
  <footer class="border-t border-ink-100">
    <div class="px-6 md:px-10 lg:px-16 py-12 md:py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-start">
        <!-- Left: Links -->
        <nav v-if="footerLinks.length > 0" class="flex gap-6 text-xs font-body uppercase tracking-widest-xl text-ink-400">
          <template v-for="link in footerLinks" :key="link.url">
            <a
              v-if="link.openInNewTab"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-ink-700 transition-colors duration-300"
            >
              {{ link.label }}
            </a>
            <NuxtLink
              v-else
              :to="link.url"
              class="hover:text-ink-700 transition-colors duration-300"
            >
              {{ link.label }}
            </NuxtLink>
          </template>
        </nav>

        <!-- Center: Copyright -->
        <div class="text-center">
          <p class="text-xs text-ink-400 font-body">
            &copy; {{ year }} <span class="font-display text-sm text-ink-600">MelShotya</span>
          </p>
          <p class="text-2xs text-ink-300 mt-1">Brooklyn, NY</p>
        </div>

        <!-- Right: Social -->
        <div v-if="socialLinks.length > 0" class="flex gap-5 md:justify-end">
          <a
            v-for="social in socialLinks"
            :key="social.url"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-body uppercase tracking-widest-xl text-ink-400 hover:text-ink-700 transition-colors duration-300"
            :title="social.label"
          >
            <template v-if="showFullSocialNames">
              {{ social.label }}
            </template>
            <template v-else>
              <span v-if="social.icon" class="inline-block" v-html="social.icon"></span>
              <span v-else>{{ social.label }}</span>
            </template>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
