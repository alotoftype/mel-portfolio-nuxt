import homePage from './homePage'
import aboutPage from './aboutPage'
import contactPage from './contactPage'
import portfolioItem from './portfolioItem'
import blogPost from './blogPost'
import siteSettings from './siteSettings'
import navigation from './navigation'

export const schemaTypes = [
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
