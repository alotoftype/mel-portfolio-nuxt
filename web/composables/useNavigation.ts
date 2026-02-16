/**
 * Composable for fetching navigation data from Sanity
 */

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
  const nuxtApp = useNuxtApp()
  const config = useRuntimeConfig()
  const isSanityConfigured = config.public.sanityProjectId !== 'your-project-id'
  const sanityClient = nuxtApp.$sanityClient

  /**
   * Fetch all navigation areas
   */
  async function getAllNavigation(): Promise<Navigation[]> {
    if (isSanityConfigured && sanityClient) {
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
        const data = await sanityClient.fetch(query)
        if (data?.length) return data
      } catch (e) {
        console.warn('Navigation fetch failed:', e)
      }
    }

    // Fallback to default navigation
    return getDefaultNavigation()
  }

  /**
   * Fetch navigation by location
   */
  async function getNavigationByLocation(
    location: Navigation['location']
  ): Promise<Navigation | null> {
    if (isSanityConfigured && sanityClient) {
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
        const data = await sanityClient.fetch(query, { location })
        if (data) return data
      } catch (e) {
        console.warn(`Navigation fetch failed for ${location}:`, e)
      }
    }

    // Fallback
    const defaultNav = getDefaultNavigation()
    return defaultNav.find((nav) => nav.location === location) || null
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
