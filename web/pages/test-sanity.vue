<script setup lang="ts">
const { getPortfolioItems } = useSanityData()

const items = await getPortfolioItems()

console.log('Portfolio items:', items?.length || 0)
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Sanity Connection Test</h1>
    <div v-if="items && items.length > 0">
      <p class="text-green-600">✅ Connected! Found {{ items.length }} portfolio items</p>
      <ul class="mt-4 space-y-2">
        <li v-for="item in items" :key="item._id" class="p-2 bg-gray-100 rounded">
          {{ item.title }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p class="text-yellow-600">⚠️ Using fallback data</p>
    </div>
  </div>
</template>
