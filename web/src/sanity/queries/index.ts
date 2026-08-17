import { defineQuery } from 'next-sanity'
import {
  IMAGE_FRAGMENT,
  LINK_FRAGMENT,
  PAGE_BUILDER_FRAGMENT,
  PORTABLE_TEXT_FRAGMENT,
  SEO_FRAGMENT,
} from '../fragments'

/**
 * Query variable names are global to typegen. A duplicate name silently overwrites
 * the other query's generated type, so keep every name here unique and descriptive.
 */

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    title,
    description,
    contactEmail,
    logo { ${IMAGE_FRAGMENT} },
    defaultOgImage { ${IMAGE_FRAGMENT} },
    socials[] { _key, platform, url },
    analytics { gaMeasurementId, posthogKey }
  }
`)

export const NAVIGATION_QUERY = defineQuery(`
  *[_type == "navigation"][0]{
    headerLinks[] { _key, ${LINK_FRAGMENT} },
    footerGroups[] { _key, title, links[] { _key, ${LINK_FRAGMENT} } },
    footerNote
  }
`)

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == "home" && language == $locale][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    language,
    ${PAGE_BUILDER_FRAGMENT},
    "seo": { ${SEO_FRAGMENT} }
  }
`)

export const PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug && language == $locale][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    language,
    ${PAGE_BUILDER_FRAGMENT},
    "seo": { ${SEO_FRAGMENT} }
  }
`)

export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current) && slug.current != "home"]{
    "slug": slug.current,
    language
  }
`)

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && language == $locale && defined(slug.current)]
    | order(publishedAt desc)[$start...$end]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      coverImage { ${IMAGE_FRAGMENT} },
      author->{ name, "slug": slug.current },
      categories[]->{ _id, title, "slug": slug.current }
    }
`)

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug && language == $locale][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    language,
    excerpt,
    publishedAt,
    coverImage { ${IMAGE_FRAGMENT} },
    author->{ name, "slug": slug.current, photo { ${IMAGE_FRAGMENT} } },
    categories[]->{ _id, title, "slug": slug.current },
    body[] { ${PORTABLE_TEXT_FRAGMENT} },
    "plainBody": pt::text(body),
    "seo": { ${SEO_FRAGMENT} }
  }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{
    "slug": slug.current,
    language
  }
`)

export const LEGAL_DOCUMENT_QUERY = defineQuery(`
  *[_type == "legalDocument" && slug.current == $slug && language == $locale][0]{
    _id,
    title,
    "slug": slug.current,
    documentType,
    version,
    effectiveDate,
    body[] { ${PORTABLE_TEXT_FRAGMENT} },
    "seo": { ${SEO_FRAGMENT} }
  }
`)

export const TRANSLATIONS_QUERY = defineQuery(`
  *[_type == "translation.metadata" && references($documentId)][0]{
    translations[] {
      _key,
      "value": value->{ _type, "slug": slug.current, language }
    }
  }
`)

export const REDIRECTS_QUERY = defineQuery(`
  *[_type == "redirect" && isEnabled == true]{
    source,
    destination,
    permanent
  }
`)

/**
 * Sitemap hygiene lives in the query, not the caller: noIndex documents are never
 * emitted, and a category is only listed when it actually has indexable posts.
 */
export const SITEMAP_QUERY = defineQuery(`
  {
    "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true]{
      "slug": slug.current,
      language,
      _updatedAt
    },
    "posts": *[_type == "post" && defined(slug.current) && seo.noIndex != true]{
      "slug": slug.current,
      language,
      _updatedAt
    },
    "legal": *[_type == "legalDocument" && defined(slug.current) && seo.noIndex != true]{
      "slug": slug.current,
      language,
      _updatedAt
    },
    "categories": *[
      _type == "category" &&
      defined(slug.current) &&
      count(*[_type == "post" && references(^._id) && seo.noIndex != true]) > 0
    ]{
      "slug": slug.current,
      _updatedAt
    }
  }
`)

export const HERO_PRESENTATION_QUERY = defineQuery(`
  *[_id == $documentId][0]{
    _id,
    "block": pageBuilder[_key == $blockKey && _type == "heroBlock"][0]{
      eyebrow, heading, subheading, layout
    }
  }
`)
