/**
 * Composable for fetching navigation data from Sanity
 */
import { canUseSanityInProcess, handleSanityFetchError } from '~/composables/useSanityFallback'
import { isExternalUrl, normalizeNavigationUrl } from '~/utils/links'

export interface NavigationItem {
  label: string
  url: string
  icon?: string
  openInNewTab?: boolean
}

export interface Navigation {
  _id: string
  title: string
  location: 'topCorner' | 'rightSide' | 'bottomLeft' | 'bottomRight'
  items: NavigationItem[]
  showFullSocialNames?: boolean
  enabled: boolean
}

export function useNavigation() {
  const config = useRuntimeConfig()
  const isSanityConfigured =
    !config.public.sanityForceFallback &&
    config.public.sanityProjectId !== 'your-project-id'
  const sanityClient = isSanityConfigured ? useSanity() : null

  async function fetchSanityQuery<T>(
    query: string,
    params: Record<string, unknown> = {}
  ): Promise<T | null> {
    const { data, error } = await useSanityQuery<T>(query, params)
    if (error.value) throw error.value
    return data.value || null
  }

  function normalizeNavigationEntry(navigation: Navigation): Navigation {
    return {
      ...navigation,
      items: (navigation.items || [])
        .map((item) => {
          const url = normalizeNavigationUrl(item?.url)
          return {
            ...item,
            label: (item?.label || '').trim(),
            url,
            openInNewTab: Boolean(item?.openInNewTab || isExternalUrl(url)),
          }
        })
        .filter((item) => Boolean(item.label) && Boolean(item.url)),
    }
  }

  /**
   * Fetch all navigation areas
   */
  async function getAllNavigation(): Promise<Navigation[]> {
    if (isSanityConfigured && sanityClient && canUseSanityInProcess()) {
      try {
        const query = `*[_type == "navigation" && enabled == true] {
          _id,
          title,
          location,
          items[] {
            label,
            url,
            icon,
            openInNewTab
          },
          showFullSocialNames,
          enabled
        }`
        const data = await fetchSanityQuery<Navigation[]>(query)
        if (data?.length) return data.map((entry) => normalizeNavigationEntry(entry))
      } catch (e) {
        handleSanityFetchError('Fetching all navigation', e)
      }
    }

    // Fallback to default navigation
    return getDefaultNavigation().map((entry) => normalizeNavigationEntry(entry))
  }

  /**
   * Fetch navigation by location
   */
  async function getNavigationByLocation(
    location: Navigation['location']
  ): Promise<Navigation | null> {
    if (isSanityConfigured && sanityClient && canUseSanityInProcess()) {
      try {
        const query = `*[_type == "navigation" && location == $location && enabled == true][0] {
          _id,
          title,
          location,
          items[] {
            label,
            url,
            icon,
            openInNewTab
          },
          showFullSocialNames,
          enabled
        }`
        const data = await fetchSanityQuery<Navigation | null>(query, { location })
        if (data) return normalizeNavigationEntry(data)
      } catch (e) {
        handleSanityFetchError(`Fetching navigation for ${location}`, e)
      }
    }

    // Fallback
    const defaultNav = getDefaultNavigation()
    const nav = defaultNav.find((entry) => entry.location === location) || null
    return nav ? normalizeNavigationEntry(nav) : null
  }

  /**
   * Default navigation (fallback)
   */
  function getDefaultNavigation(): Navigation[] {
    return [
      {
        _id: 'default-top-corner',
        title: 'Main Menu',
        location: 'topCorner',
        enabled: true,
        items: [
          { label: 'Home', url: '/', openInNewTab: false },
          { label: 'Portfolio', url: '/portfolio', openInNewTab: false },
          { label: 'About', url: '/about', openInNewTab: false },
          { label: 'Blog', url: '/blog', openInNewTab: false },
          { label: 'Contact', url: '/contact', openInNewTab: false },
        ],
      },
      {
        _id: 'default-right-side',
        title: 'Right Side Menu',
        location: 'rightSide',
        enabled: true,
        items: [{ label: 'Book a Session', url: '/contact', openInNewTab: false }],
      },
      {
        _id: 'default-bottom-left',
        title: 'Footer Menu',
        location: 'bottomLeft',
        enabled: true,
        items: [
          { label: 'Home', url: '/', openInNewTab: false },
          { label: 'Portfolio', url: '/portfolio', openInNewTab: false },
          { label: 'About', url: '/about', openInNewTab: false },
          { label: 'Contact', url: '/contact', openInNewTab: false },
        ],
      },
      {
        _id: 'default-bottom-right',
        title: 'Social Links',
        location: 'bottomRight',
        enabled: true,
        showFullSocialNames: false,
        items: [
          {
            label: 'Instagram',
            url: 'https://www.instagram.com',
            icon: 'instagram',
            openInNewTab: true,
          },
          {
            label: 'Facebook',
            url: 'https://www.facebook.com',
            icon: 'facebook',
            openInNewTab: true,
          },
        ],
      },
    ]
  }

  return {
    getAllNavigation,
    getNavigationByLocation,
  }
}
