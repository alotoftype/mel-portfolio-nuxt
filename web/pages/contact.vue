<script setup lang="ts">
const { getContactData, isSanityConfigured } = useSanityData()
useScrollAnimation()

const contactData = await getContactData()
const contactQuery = `*[_type == "contactPage"][0] {
  title,
  formTitle,
  contactItems[] {
    _key,
    title,
    icon,
    content
  }
}`
const contactQueryResult = isSanityConfigured
  ? await (useSanityQuery<any>(contactQuery) as any)
  : null
const formState = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})
const isSubmitting = ref(false)
const submitStatus = ref<'idle' | 'success' | 'error'>('idle')

function contactDataAttr(path?: string) {
  if (!path) return undefined
  const encodeDataAttribute = contactQueryResult?.encodeDataAttribute?.value
  if (!encodeDataAttribute) return undefined
  return encodeDataAttribute(path)
}

function contactItemPath(item: any, index: number, field?: string) {
  const key = typeof item?._key === 'string' ? item._key : ''
  const basePath = key ? `contactItems[_key=="${key}"]` : `contactItems[${index}]`
  return field ? `${basePath}.${field}` : basePath
}

async function handleSubmit() {
  isSubmitting.value = true
  submitStatus.value = 'idle'

  try {
    // POST to getform.io (same endpoint as original project)
    const response = await fetch(
      contactData.formEndpoint,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      }
    )
    if (response.ok) {
      submitStatus.value = 'success'
      formState.name = ''
      formState.email = ''
      formState.subject = ''
      formState.message = ''
    } else {
      submitStatus.value = 'error'
    }
  } catch {
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Contact — MelShotya Photography',
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="pt-32 pb-16 md:pt-40 md:pb-20 px-6 md:px-10 lg:px-16 text-center">
      <p class="text-xs uppercase tracking-widest-xl text-ink-400 font-body mb-4 animate-on-scroll">
        Get In Touch
      </p>
      <h1 class="font-display text-display-md md:text-display-lg text-ink-900 font-light animate-on-scroll">
        Contact
      </h1>
      <p class="max-w-xl mx-auto mt-6 text-ink-500 font-body text-sm leading-relaxed animate-on-scroll" :data-sanity="contactDataAttr('title')">
        {{ contactData.title }}
      </p>
    </section>

    <!-- Contact Info Cards -->
    <section class="px-6 md:px-10 lg:px-16 pb-16 md:pb-20" :data-sanity="contactDataAttr('contactItems')">
      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div
          v-for="(item, i) in contactData.contactItems"
          :key="item.id"
          class="text-center py-10 px-6 border border-ink-100 animate-on-scroll"
          :style="{ animationDelay: `${i * 150}ms` }"
          :data-sanity="contactDataAttr(contactItemPath(item, i))"
        >
          <h3 class="text-xs uppercase tracking-widest-xl text-ink-400 font-body mb-4" :data-sanity="contactDataAttr(contactItemPath(item, i, 'title'))">
            {{ item.title }}
          </h3>
          <div class="text-sm text-ink-700 font-body" v-html="item.info" />
        </div>
      </div>
    </section>

    <div class="divider mx-6 md:mx-10 lg:mx-16" />

    <!-- Contact Form -->
    <section class="py-16 md:py-24 px-6 md:px-10 lg:px-16">
      <div class="max-w-3xl mx-auto">
        <h2 class="font-display text-2xl md:text-3xl text-ink-800 font-light mb-10 text-center animate-on-scroll">
          <span :data-sanity="contactDataAttr('formTitle')">
          {{ contactData.formTitle }}
          </span>
        </h2>

        <!-- Success message -->
        <div v-if="submitStatus === 'success'" class="text-center py-12">
          <div class="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="font-display text-xl text-ink-800 mb-2">Message Sent</h3>
          <p class="text-sm text-ink-500 font-body">Thank you! We'll get back to you soon.</p>
          <button
            @click="submitStatus = 'idle'"
            class="mt-6 text-xs uppercase tracking-widest-xl text-ink-500 font-body hover:text-ink-900 transition-colors"
          >
            Send Another
          </button>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="animate-on-scroll">
              <label for="name" class="block text-2xs uppercase tracking-widest-xl text-ink-400 font-body mb-2">
                Your Name
              </label>
              <input
                id="name"
                v-model="formState.name"
                type="text"
                required
                class="w-full bg-transparent border-b border-ink-200 py-3 text-sm font-body text-ink-800 placeholder:text-ink-300 focus:border-ink-900 focus:outline-none transition-colors"
                placeholder="Full name"
              />
            </div>
            <div class="animate-on-scroll">
              <label for="email" class="block text-2xs uppercase tracking-widest-xl text-ink-400 font-body mb-2">
                Email Address
              </label>
              <input
                id="email"
                v-model="formState.email"
                type="email"
                required
                class="w-full bg-transparent border-b border-ink-200 py-3 text-sm font-body text-ink-800 placeholder:text-ink-300 focus:border-ink-900 focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div class="animate-on-scroll">
            <label for="subject" class="block text-2xs uppercase tracking-widest-xl text-ink-400 font-body mb-2">
              Subject
            </label>
            <input
              id="subject"
              v-model="formState.subject"
              type="text"
              required
              class="w-full bg-transparent border-b border-ink-200 py-3 text-sm font-body text-ink-800 placeholder:text-ink-300 focus:border-ink-900 focus:outline-none transition-colors"
              placeholder="What is this about?"
            />
          </div>

          <div class="animate-on-scroll">
            <label for="message" class="block text-2xs uppercase tracking-widest-xl text-ink-400 font-body mb-2">
              Message
            </label>
            <textarea
              id="message"
              v-model="formState.message"
              rows="5"
              required
              class="w-full bg-transparent border-b border-ink-200 py-3 text-sm font-body text-ink-800 placeholder:text-ink-300 focus:border-ink-900 focus:outline-none transition-colors resize-none"
              placeholder="Tell us about your project..."
            />
          </div>

          <!-- Error -->
          <p v-if="submitStatus === 'error'" class="text-sm text-red-600 font-body text-center">
            Something went wrong. Please try again or email us directly.
          </p>

          <div class="text-center pt-4 animate-on-scroll">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-block text-xs uppercase tracking-widest-xl font-body border border-ink-900 text-ink-900 px-10 py-4 hover:bg-ink-900 hover:text-cream-50 transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Sending...' : 'Submit Message' }}
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>
