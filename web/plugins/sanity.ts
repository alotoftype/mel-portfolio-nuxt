import { createClient } from '@sanity/client'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const client = createClient({
    projectId: config.public.sanityProjectId as string,
    dataset: config.public.sanityDataset as string,
    apiVersion: '2024-01-01',
    useCdn: true,
  })

  return {
    provide: {
      sanityClient: client,
    },
  }
})
