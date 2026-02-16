<script setup lang="ts">
const { getAllNavigation } = useNavigation()

const navData = ref<any>(null)
const error = ref<string | null>(null)

try {
  navData.value = await getAllNavigation()
} catch (e: any) {
  error.value = e.message
}
</script>

<template>
  <div class="min-h-screen bg-cream-50 p-10">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-display mb-6">Navigation Test</h1>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Error:</strong> {{ error }}
      </div>

      <div v-else-if="navData" class="space-y-6">
        <div v-for="nav in navData" :key="nav._id" class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-display mb-2">{{ nav.title }}</h2>
          <p class="text-sm text-ink-400 mb-2">Location: {{ nav.location }}</p>
          <p class="text-sm text-ink-400 mb-2">Enabled: {{ nav.enabled }}</p>
          <p v-if="nav.showFullSocialNames !== undefined" class="text-sm text-ink-400 mb-2">
            Show Full Names: {{ nav.showFullSocialNames }}
          </p>

          <div class="mt-4">
            <h3 class="text-sm font-semibold mb-2">Items ({{ nav.items.length }}):</h3>
            <ul class="space-y-2">
              <li v-for="item in nav.items" :key="item.url" class="text-sm border-l-2 border-ink-200 pl-3">
                <div><strong>{{ item.label }}</strong></div>
                <div class="text-ink-500">{{ item.url }}</div>
                <div v-if="item.icon" class="text-ink-400">Icon: {{ item.icon }}</div>
                <div v-if="item.openInNewTab" class="text-ink-400">Opens in new tab</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-ink-400 py-10">
        Loading navigation...
      </div>

      <div class="mt-8">
        <NuxtLink to="/" class="text-accent hover:underline">← Back to Home</NuxtLink>
      </div>
    </div>
  </div>
</template>
