import type { Metadata } from 'next'
import { urlFor, type ProjectedImage } from '@/sanity/lib/image'
import { locales, OG_LOCALES, type Locale } from '@/i18n/routing'

export interface SeoInput {
  title?: string | null
  description?: string | null
  keywords?: string[] | null
  image?: ProjectedImage | null
  canonicalUrl?: string | null
  noIndex?: boolean | null
}

export interface BuildMetadataOptions {
  seo: SeoInput | null | undefined
  /** Path without the locale prefix, starting with a slash. Use '' for the home page. */
  path: string
  locale: Locale
  siteUrl: string
  siteName?: string | null
  defaultOgImage?: ProjectedImage | null
}

function absolute(siteUrl: string, path: string): string {
  return `${siteUrl.replace(/\/$/, '')}${path}`
}

function ogImageUrl(image: ProjectedImage | null | undefined): string | null {
  if (!image?.asset) return null
  return urlFor(image).width(1200).height(630).fit('crop').url()
}

/**
 * The root layout deliberately sets no default alternates.languages. A default
 * there makes every page advertise the homepage as its own translation.
 */
export function buildMetadata({
  seo,
  path,
  locale,
  siteUrl,
  siteName,
  defaultOgImage,
}: BuildMetadataOptions): Metadata {
  const canonicalPath = `/${locale}${path}`
  const canonical = seo?.canonicalUrl || absolute(siteUrl, canonicalPath)

  const languages = Object.fromEntries(
    locales.map((code) => [code, absolute(siteUrl, `/${code}${path}`)]),
  )

  const image = ogImageUrl(seo?.image) ?? ogImageUrl(defaultOgImage)

  const metadata: Metadata = {
    title: seo?.title || undefined,
    description: seo?.description || undefined,
    keywords: seo?.keywords?.length ? seo.keywords : undefined,
    alternates: {
      canonical,
      languages: { ...languages, 'x-default': absolute(siteUrl, `/${locales[0]}${path}`) },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title: seo?.title || undefined,
      description: seo?.description || undefined,
      siteName: siteName || undefined,
      locale: OG_LOCALES[locale],
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: seo?.title || undefined,
      description: seo?.description || undefined,
      images: image ? [image] : undefined,
    },
  }

  if (seo?.noIndex) {
    metadata.robots = { index: false, follow: false }
  }

  return metadata
}

/** Rough reading time from plain text. Hebrew and English both land close enough. */
export function readingMinutes(text: string | null | undefined): number {
  if (!text) return 1
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
