<script setup lang="ts">
interface PortfolioItem {
  _id?: string
  id: number
  title: string
  excerpt?: string
  categories: string[]
  homeImage: string
  slug?: string
}

const props = withDefaults(defineProps<{
  items: PortfolioItem[]
  showFilter?: boolean
  limit?: number
}>(), {
  showFilter: true,
  limit: 0,
})

const { openLightbox } = useLightbox()

const activeFilter = ref('all')

const allCategories = computed(() => {
  const cats = new Set<string>()
  props.items.forEach((item) => {
    item.categories.forEach((cat) => cats.add(cat.toLowerCase()))
  })
  return Array.from(cats).sort()
})

const filteredItems = computed(() => {
  let items = props.items
  if (activeFilter.value !== 'all') {
    items = items.filter((item) =>
      item.categories.some((cat) => cat.toLowerCase() === activeFilter.value)
    )
  }
  if (props.limit > 0) {
    items = items.slice(0, props.limit)
  }
  return items
})

function setFilter(filter: string) {
  activeFilter.value = filter
}
</script>

<template>
  <section class="px-6 md:px-10 lg:px-16 py-20 md:py-28">
    <!-- Filter bar -->
    <div v-if="showFilter" class="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 md:mb-16">
      <button
        @click="setFilter('all')"
        class="px-4 py-2 text-xs uppercase tracking-widest-xl font-body transition-all duration-300"
        :class="
          activeFilter === 'all'
            ? 'text-ink-900 border-b-2 border-ink-900'
            : 'text-ink-400 hover:text-ink-700 border-b-2 border-transparent'
        "
      >
        All Work
      </button>
      <button
        v-for="cat in allCategories"
        :key="cat"
        @click="setFilter(cat)"
        class="px-4 py-2 text-xs uppercase tracking-widest-xl font-body transition-all duration-300"
        :class="
          activeFilter === cat
            ? 'text-ink-900 border-b-2 border-ink-900'
            : 'text-ink-400 hover:text-ink-700 border-b-2 border-transparent'
        "
      >
        {{ cat }}
      </button>
    </div>

    <!-- Grid -->
    <TransitionGroup
      name="portfolio-grid"
      tag="div"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
    >
      <div
        v-for="(item, index) in filteredItems"
        :key="item.id"
        class="portfolio-card group relative cursor-pointer overflow-hidden aspect-[3/4]"
        :style="{ animationDelay: `${index * 60}ms` }"
        @click="openLightbox(item.homeImage, item.title)"
      >
        <NuxtImg
          :src="item.homeImage"
          :alt="item.title"
          class="w-full h-full object-cover transition-transform duration-800 ease-expo-out group-hover:scale-105"
          width="600"
          height="800"
          format="webp"
          quality="80"
          loading="lazy"
          sizes="xs:100vw sm:50vw md:33vw lg:25vw"
          densities="x1 x2"
        />
        <div class="portfolio-overlay" />
        <div class="portfolio-info absolute bottom-0 left-0 right-0 p-5 z-10">
          <NuxtLink
            :to="`/portfolio/${item.slug || item.id}`"
            class="relative z-10"
            @click.stop
          >
            <h3 class="font-display text-xl md:text-2xl text-cream-50 font-light">
              {{ item.title }}
            </h3>
          </NuxtLink>
          <p v-if="item.excerpt" class="text-xs text-cream-200/70 font-body mt-1">
            {{ item.excerpt }}
          </p>
          <div class="flex gap-2 mt-3">
            <span
              v-for="cat in item.categories"
              :key="cat"
              class="text-2xs uppercase tracking-widest-xl text-cream-200/50 font-body"
            >
              {{ cat }}
            </span>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <!-- View all -->
    <div v-if="limit > 0 && items.length > limit" class="text-center mt-14">
      <NuxtLink
        to="/portfolio"
        class="inline-block text-xs uppercase tracking-widest-xl text-ink-600 font-body border-b border-ink-300 pb-1 hover:text-ink-900 hover:border-ink-900 transition-colors duration-300"
      >
        View All Work
      </NuxtLink>
    </div>
  </section>
</template>

