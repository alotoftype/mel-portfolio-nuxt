import homePage from './homePage'
import aboutPage from './aboutPage'
import contactPage from './contactPage'
import portfolioItem from './portfolioItem'
import blogPost from './blogPost'
import siteSettings from './siteSettings'
import navigation from './navigation'
import seo from './seo'

export const schemaTypes = [
  seo,

  // Singletons (pages)
  homePage,
  aboutPage,
  contactPage,
  siteSettings,

  // Collections
  portfolioItem,
  blogPost,
  navigation,
]
