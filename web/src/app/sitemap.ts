import type { MetadataRoute } from 'next'
import { safeFetch } from '@/sanity/lib/safe-fetch'
import { SITEMAP_QUERY } from '@/sanity/queries'
import { locales, type Locale } from '@/i18n/routing'
import { siteUrl } from '@/lib/env'

export const revalidate = 3600

interface Entry {
  slug: string | null
  language?: string | null
  _updatedAt: string
}

function alternates(path: string) {
  return {
    languages: Object.fromEntries(
      locales.map((code) => [code, `${siteUrl}/${code}${path}`]),
    ) as Record<Locale, string>,
  }
}

function entry(path: string, locale: string, lastModified: string): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}/${locale}${path}`,
    lastModified,
    alternates: alternates(path),
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await safeFetch('sitemap', (client) => client.fetch(SITEMAP_QUERY), {
    pages: [],
    posts: [],
    legal: [],
    categories: [],
  })

  const now = new Date().toISOString()

  const staticEntries = locales.flatMap((locale) => [
    entry('', locale, now),
    entry('/blog', locale, now),
  ])

  const fromDocuments = (rows: Entry[], toPath: (slug: string) => string) =>
    rows
      .filter((row): row is Entry & { slug: string; language: string } =>
        Boolean(row.slug && row.language),
      )
      // The home page is already covered by the static entries above.
      .filter((row) => row.slug !== 'home')
      .map((row) => entry(toPath(row.slug), row.language, row._updatedAt))

  return [
    ...staticEntries,
    ...fromDocuments(data.pages as Entry[], (slug) => `/${slug}`),
    ...fromDocuments(data.posts as Entry[], (slug) => `/blog/${slug}`),
    ...fromDocuments(data.legal as Entry[], (slug) => `/${slug}`),
  ]
}
