/**
 * Every internal href is built here. Paths are returned without a locale prefix
 * because the next-intl Link adds it; the locale still selects the path segments
 * so localized routes only need a new entry in SEGMENTS_BY_LOCALE.
 */

export interface RouteSegments {
  blog: string
  legal: string
  category: string
}

const DEFAULT_SEGMENTS: RouteSegments = {
  blog: 'blog',
  legal: 'legal',
  category: 'category',
}

const SEGMENTS_BY_LOCALE: Record<string, RouteSegments> = {}

export function segmentsFor(locale: string): RouteSegments {
  return SEGMENTS_BY_LOCALE[locale] ?? DEFAULT_SEGMENTS
}

function clean(slug: string): string {
  return slug.replace(/^\/+|\/+$/g, '')
}

export const ROUTES = {
  home: (locale: string): string => {
    void segmentsFor(locale)
    return '/'
  },
  page: (locale: string, slug: string): string => {
    void segmentsFor(locale)
    const value = clean(slug)
    return value === 'home' || value === '' ? '/' : `/${value}`
  },
  blog: (locale: string): string => `/${segmentsFor(locale).blog}`,
  post: (locale: string, slug: string): string => `/${segmentsFor(locale).blog}/${clean(slug)}`,
  legal: (locale: string, slug: string): string => {
    void segmentsFor(locale)
    return `/${clean(slug)}`
  },
  category: (locale: string, slug: string): string =>
    `/${segmentsFor(locale).blog}/${segmentsFor(locale).category}/${clean(slug)}`,
} as const

export interface InternalReference {
  _type?: string | null
  slug?: string | null
  language?: string | null
}

export function resolveInternalHref(
  reference: InternalReference | null | undefined,
  fallbackLocale: string,
): string | null {
  const slug = reference?.slug
  if (!slug) return null

  const locale = reference?.language ?? fallbackLocale

  switch (reference?._type) {
    case 'page':
      return ROUTES.page(locale, slug)
    case 'post':
      return ROUTES.post(locale, slug)
    case 'legalDocument':
      return ROUTES.legal(locale, slug)
    default:
      return null
  }
}
