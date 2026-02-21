<script setup lang="ts">
import { safeAlt } from "~/utils/accessibility"

const { getBlogPosts, isSanityConfigured } = useSanityData()
useScrollAnimation()

const fallbackPosts = await getBlogPosts()
const blogIndexQuery = `{
  "posts": *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    author,
    publishedAt,
    categories,
    tags,
    excerpt,
    "thumbnail": thumbnail.asset->url
  }
}`
const blogIndexQueryResult = isSanityConfigured
  ? await (useSanityQuery<any>(blogIndexQuery) as any)
  : null

function formatPublishedDate(date?: string) {
  if (!date) return ''
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const posts = computed(() => {
  const sanityPosts = blogIndexQueryResult?.data?.value?.posts
  if (Array.isArray(sanityPosts) && sanityPosts.length) {
    return sanityPosts.map((post: any, index: number) => ({
      ...post,
      id: post._id || index + 1,
      categories: Array.isArray(post.categories) ? post.categories : [],
      date: formatPublishedDate(post.publishedAt),
    }))
  }
  return fallbackPosts
})

function blogDataAttr(path?: string) {
  if (!path) return undefined
  const encodeDataAttribute = blogIndexQueryResult?.encodeDataAttribute?.value
  if (!encodeDataAttribute) return undefined
  return encodeDataAttribute(path)
}

function blogPostPath(index: number, field?: string) {
  const basePath = `posts[${index}]`
  return field ? `${basePath}.${field}` : basePath
}

useHead({
  title: 'Blog — MelShotya Photography',
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="pt-32 pb-16 md:pt-40 md:pb-20 px-6 md:px-10 lg:px-16 text-center">
      <p class="text-xs uppercase tracking-widest-xl text-ink-400 font-body mb-4 animate-on-scroll">
        Stories & Insights
      </p>
      <h1 class="font-display text-display-md md:text-display-lg text-ink-900 font-light animate-on-scroll">
        Blog
      </h1>
    </section>

    <div class="divider mx-6 md:mx-10 lg:mx-16" />

    <!-- Blog Grid -->
    <section class="px-6 md:px-10 lg:px-16 py-16 md:py-24">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        <article
          v-for="(post, i) in posts"
          :key="post.id || post._id"
          class="group animate-on-scroll"
          :style="{ animationDelay: `${i * 100}ms` }"
          :data-sanity="blogDataAttr(blogPostPath(i))"
        >
          <!-- Thumbnail -->
          <NuxtLink :to="`/blog/${post.slug || post.id}`" class="block overflow-hidden aspect-[4/3] mb-5" :data-sanity="blogDataAttr(blogPostPath(i, 'thumbnail'))">
            <NuxtImg
              :src="post.thumbnail || post.media?.images || post.sliderThumb?.[0]?.image || '/img/blog/01.jpg'"
              :alt="safeAlt(post.title, 'Blog post image')"
              class="w-full h-full object-cover transition-transform duration-800 ease-expo-out group-hover:scale-105"
              width="800"
              height="600"
              format="webp"
              quality="80"
              loading="lazy"
              sizes="xs:100vw sm:50vw md:33vw"
              densities="x1"
            />
          </NuxtLink>

          <!-- Meta -->
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xs uppercase tracking-widest-xl text-ink-400 font-body">
              {{ post.date || post.publishedAt }}
            </span>
            <span class="w-1 h-1 rounded-full bg-ink-300" />
            <span class="text-2xs uppercase tracking-widest-xl text-ink-400 font-body">
              {{ post.author }}
            </span>
          </div>

          <!-- Title -->
          <NuxtLink :to="`/blog/${post.slug || post.id}`">
            <h2
              class="font-display text-xl md:text-2xl text-ink-800 font-light group-hover:text-accent transition-colors duration-300"
              :data-sanity="blogDataAttr(blogPostPath(i, 'title'))"
            >
              {{ post.title }}
            </h2>
          </NuxtLink>

          <!-- Categories -->
          <div class="flex gap-2 mt-3">
            <span
              v-for="cat in post.categories"
              :key="cat"
              class="text-2xs uppercase tracking-widest-xl text-accent font-body"
              :data-sanity="blogDataAttr(blogPostPath(i, 'categories'))"
            >
              {{ cat }}
            </span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
