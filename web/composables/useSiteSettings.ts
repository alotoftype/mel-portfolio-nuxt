import { canUseSanityInProcess, handleSanityFetchError } from '~/composables/useSanityFallback'

export interface SiteSettings {
  siteName: string
  siteDescription: string
  defaultOgImage?: string
  twitterHandle?: string
  robotsNoIndex?: boolean
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'MelShotya Photography',
  siteDescription:
    'MelShotya Photography — Brooklyn-based photography studio specializing in portraits, events, fashion, and editorial work.',
  defaultOgImage: '',
  twitterHandle: '',
  robotsNoIndex: false,
}

export function useSiteSettings() {
  const config = useRuntimeConfig()
  const isSanityConfigured =
    !config.public.sanityForceFallback &&
    config.public.sanityProjectId !== 'your-project-id'
  const sanityClient = isSanityConfigured ? useSanity() : null

  async function getSiteSettings(): Promise<SiteSettings> {
    if (isSanityConfigured && sanityClient && canUseSanityInProcess()) {
      try {
        const query = `*[_type == "siteSettings"][0] {
          siteName,
          siteDescription,
          "defaultOgImage": defaultOgImage.asset->url,
          twitterHandle,
          robotsNoIndex
        }`
        const { data, error } = await useSanityQuery<Partial<SiteSettings> | null>(query)
        if (error.value) throw error.value
        if (data.value) {
          return {
            siteName: data.value.siteName || DEFAULT_SITE_SETTINGS.siteName,
            siteDescription: data.value.siteDescription || DEFAULT_SITE_SETTINGS.siteDescription,
            defaultOgImage: data.value.defaultOgImage || DEFAULT_SITE_SETTINGS.defaultOgImage,
            twitterHandle: data.value.twitterHandle || DEFAULT_SITE_SETTINGS.twitterHandle,
            robotsNoIndex: Boolean(data.value.robotsNoIndex),
          }
        }
      } catch (e) {
        handleSanityFetchError('Fetching site settings', e)
      }
    }

    return DEFAULT_SITE_SETTINGS
  }

  return {
    getSiteSettings,
  }
}
