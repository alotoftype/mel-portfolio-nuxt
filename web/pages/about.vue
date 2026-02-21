<script setup lang="ts">
const { getAboutData, isSanityConfigured } = useSanityData()
useScrollAnimation()

const aboutData = await getAboutData()
const aboutQuery = `*[_type == "aboutPage"][0] {
  title,
  excerpt,
  servicesTitle,
  services,
  teamTitle,
  team[] {
    _key,
    name,
    role,
    image
  },
  testimonial {
    quote,
    author,
    role
  },
  awardsTitle,
  awards[] {
    _key,
    platform,
    title,
    year
  },
  clientsTitle,
  clientsExcerpt,
  clients[] {
    _key,
    name,
    logo
  }
}`
const aboutQueryResult = isSanityConfigured
  ? await (useSanityQuery<any>(aboutQuery) as any)
  : null

// Extract sections from the array-based local data
const aboutMe = Array.isArray(aboutData)
  ? aboutData.find((d: any) => d.id === 'about me')
  : aboutData
const aboutService = Array.isArray(aboutData)
  ? aboutData.find((d: any) => d.id === 'about service')
  : null
const teamData = Array.isArray(aboutData)
  ? aboutData.find((d: any) => d.id === 'team')
  : null
const blockquote = Array.isArray(aboutData)
  ? aboutData.find((d: any) => d.id === 'blockquote')
  : null
const awards = Array.isArray(aboutData)
  ? aboutData.find((d: any) => d.id === 'Awards')
  : null
const brands = Array.isArray(aboutData)
  ? aboutData.find((d: any) => d.id === 'Brand')
  : null

function cleanHtml(text: string) {
  if (!text) return ''
  return text.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]*>/g, '')
}

function aboutDataAttr(path?: string) {
  if (!path) return undefined
  const encodeDataAttribute = aboutQueryResult?.encodeDataAttribute?.value
  if (!encodeDataAttribute) return undefined
  return encodeDataAttribute(path)
}

function scopedArrayPath(arrayPath: string, item: any, index: number, field?: string) {
  const key = typeof item?._key === 'string' ? item._key : ''
  const basePath = key ? `${arrayPath}[_key=="${key}"]` : `${arrayPath}[${index}]`
  return field ? `${basePath}.${field}` : basePath
}

useHead({
  title: 'About — MelShotya Photography',
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="pt-32 pb-16 md:pt-40 md:pb-20 px-6 md:px-10 lg:px-16 text-center">
      <p class="text-xs uppercase tracking-widest-xl text-ink-400 font-body mb-4 animate-on-scroll">
        Who We Are
      </p>
      <h1 class="font-display text-display-md md:text-display-lg text-ink-900 font-light animate-on-scroll">
        <span :data-sanity="aboutDataAttr('title')">
        {{ aboutMe?.title || 'About MelShotya' }}
        </span>
      </h1>
    </section>

    <!-- About intro -->
    <section class="px-6 md:px-10 lg:px-16 pb-20 md:pb-28">
      <div class="max-w-3xl mx-auto text-center animate-on-scroll">
        <p
          class="text-ink-600 font-body leading-relaxed text-base md:text-lg"
          :data-sanity="aboutDataAttr('excerpt')"
          v-html="aboutMe?.excerpt"
        />
      </div>
    </section>

    <!-- Services -->
    <section v-if="aboutService" class="px-6 md:px-10 lg:px-16 pb-20 md:pb-28" :data-sanity="aboutDataAttr('services')">
      <div class="max-w-4xl mx-auto">
        <div class="divider mb-16" />
        <h2
          class="font-display text-2xl md:text-3xl text-ink-800 font-light mb-10 text-center animate-on-scroll"
          :data-sanity="aboutDataAttr('servicesTitle')"
        >
          {{ aboutService.title }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div
            v-for="(service, i) in aboutService.pagelinkText"
            :key="i"
            class="text-center py-8 border border-ink-100 animate-on-scroll"
            :style="{ animationDelay: `${i * 100}ms` }"
            :data-sanity="aboutDataAttr(scopedArrayPath('services', service, i))"
          >
            <p class="font-body text-sm text-ink-700">{{ service }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial -->
    <section v-if="blockquote" class="py-20 md:py-28 bg-ink-950 text-cream-50 relative grain">
      <div class="max-w-3xl mx-auto text-center px-6 md:px-10">
        <svg class="w-8 h-8 mx-auto mb-8 text-accent opacity-50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
        <blockquote
          class="font-display text-xl md:text-2xl lg:text-3xl font-light leading-relaxed italic text-cream-100"
          :data-sanity="aboutDataAttr('testimonial.quote')"
          v-html="blockquote.excerpt"
        />
        <div class="mt-8">
          <p class="text-sm font-body text-cream-300" :data-sanity="aboutDataAttr('testimonial.author')">{{ blockquote.name }}</p>
          <p class="text-xs font-body text-cream-400/60 mt-1" :data-sanity="aboutDataAttr('testimonial.role')">{{ blockquote.designation }}</p>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section v-if="teamData?.team" class="py-20 md:py-28 px-6 md:px-10 lg:px-16">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-14">
          <p class="text-xs uppercase tracking-widest-xl text-ink-400 font-body mb-3 animate-on-scroll">The People</p>
          <h2
            class="font-display text-2xl md:text-3xl text-ink-800 font-light animate-on-scroll"
            :data-sanity="aboutDataAttr('teamTitle')"
          >
            {{ teamData.title }}
          </h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          <div
            v-for="(member, i) in teamData.team"
            :key="member.id"
            class="text-center animate-on-scroll"
            :style="{ animationDelay: `${i * 80}ms` }"
            :data-sanity="aboutDataAttr(scopedArrayPath('team', member, i))"
          >
            <div class="aspect-square overflow-hidden mb-4">
              <NuxtImg
                :src="member.image"
                :alt="cleanHtml(member.name)"
                class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-600"
                width="400"
                height="400"
                format="webp"
                quality="85"
                loading="lazy"
                sizes="xs:100vw sm:50vw md:33vw lg:25vw"
                densities="x1"
              />
            </div>
            <h3 class="font-display text-lg text-ink-800" :data-sanity="aboutDataAttr(scopedArrayPath('team', member, i, 'name'))" v-html="member.name" />
            <p v-if="member.designation" class="text-xs text-ink-400 font-body mt-1">
              <span :data-sanity="aboutDataAttr(scopedArrayPath('team', member, i, 'role'))">
              {{ member.designation }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Awards -->
    <section v-if="awards" class="py-20 md:py-28 px-6 md:px-10 lg:px-16 bg-cream-100">
      <div class="max-w-4xl mx-auto">
        <h2
          class="font-display text-2xl md:text-3xl text-ink-800 font-light mb-12 text-center animate-on-scroll"
          :data-sanity="aboutDataAttr('awardsTitle')"
        >
          {{ awards.title }}
        </h2>
        <div class="divide-y divide-ink-200">
          <div
            v-for="(award, i) in awards.awardItem"
            :key="award.id"
            class="flex items-center justify-between py-5 animate-on-scroll"
            :data-sanity="aboutDataAttr(scopedArrayPath('awards', award, i))"
          >
            <div>
              <h3 class="font-body text-sm text-ink-700" :data-sanity="aboutDataAttr(scopedArrayPath('awards', award, i, 'title'))" v-html="award.title" />
            </div>
            <span class="text-xs uppercase tracking-widest-xl text-ink-400 font-body shrink-0 ml-4">
              <span :data-sanity="aboutDataAttr(scopedArrayPath('awards', award, i, 'platform'))">
              {{ award.cate }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Clients -->
    <section v-if="brands" class="py-20 md:py-28 px-6 md:px-10 lg:px-16">
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-xs uppercase tracking-widest-xl text-ink-400 font-body mb-3 animate-on-scroll">Trusted By</p>
        <h2
          class="font-display text-2xl md:text-3xl text-ink-800 font-light mb-4 animate-on-scroll"
          :data-sanity="aboutDataAttr('clientsTitle')"
        >
          {{ brands.title }}
        </h2>
        <p class="text-sm text-ink-500 font-body mb-12 animate-on-scroll" :data-sanity="aboutDataAttr('clientsExcerpt')">{{ brands.excerpt }}</p>
        <div class="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          <div
            v-for="(brand, i) in brands.brand"
            :key="brand.id"
            class="opacity-40 hover:opacity-80 transition-opacity duration-400 animate-on-scroll"
            :data-sanity="aboutDataAttr(scopedArrayPath('clients', brand, i))"
          >
            <NuxtImg
              :src="brand.image"
              alt="Client logo"
              class="h-10 md:h-12 object-contain"
              width="200"
              height="48"
              format="webp"
              quality="90"
              loading="lazy"
              fit="contain"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
