import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation'
import { defaultLanguage } from '../../env'

function localized(path: string, language?: string): string {
  return `/${language || defaultLanguage}${path}`
}

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    page: defineLocations({
      select: { title: 'title', slug: 'slug.current', language: 'language' },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: localized(doc?.slug === 'home' ? '' : `/${doc?.slug}`, doc?.language),
          },
        ],
      }),
    }),
    post: defineLocations({
      select: { title: 'title', slug: 'slug.current', language: 'language' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Untitled', href: localized(`/blog/${doc?.slug}`, doc?.language) },
          { title: 'Blog index', href: localized('/blog', doc?.language) },
        ],
      }),
    }),
    legalDocument: defineLocations({
      select: { title: 'title', slug: 'slug.current', language: 'language' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Untitled', href: localized(`/${doc?.slug}`, doc?.language) },
        ],
      }),
    }),
    siteSettings: defineLocations({
      select: { title: 'title' },
      resolve: () => ({
        locations: [{ title: 'Home', href: localized('') }],
      }),
    }),
    navigation: defineLocations({
      select: { title: 'footerNote' },
      resolve: () => ({
        locations: [{ title: 'Home', href: localized('') }],
      }),
    }),
  },
}
