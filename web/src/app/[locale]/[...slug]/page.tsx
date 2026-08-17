import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { PageBuilder } from '@/components/page-builder'
import { PortableTextRenderer } from '@/components/portable-text'
import { Prose } from '@/components/primitives/prose'
import { Section } from '@/components/primitives/section'
import type { Locale } from '@/i18n/routing'
import { siteUrl } from '@/lib/env'
import { buildMetadata } from '@/lib/seo'
import { safeFetch } from '@/sanity/lib/safe-fetch'
import { sanityFetch } from '@/sanity/lib/live'
import {
  LEGAL_DOCUMENT_QUERY,
  PAGE_BY_SLUG_QUERY,
  PAGE_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/queries'

interface Props {
  params: Promise<{ locale: Locale; slug: string[] }>
}

/**
 * A page and a legal document share the /{slug} namespace, so both are tried here
 * rather than splitting them across two route segments that could ever collide.
 */
async function load(slug: string, locale: Locale, stega: boolean) {
  const { data: page } = await sanityFetch({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug, locale },
    stega,
  })
  if (page) return { kind: 'page' as const, page }

  const { data: legal } = await sanityFetch({
    query: LEGAL_DOCUMENT_QUERY,
    params: { slug, locale },
    stega,
  })
  if (legal) return { kind: 'legal' as const, legal }

  return null
}

export async function generateStaticParams() {
  const pages = await safeFetch('page slugs', (client) => client.fetch(PAGE_SLUGS_QUERY), [])
  return pages
    .filter((page) => page.slug && page.language)
    .map((page) => ({ locale: page.language as string, slug: [page.slug as string] }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const path = `/${slug.join('/')}`

  const [result, { data: settings }] = await Promise.all([
    load(slug.join('/'), locale, false),
    sanityFetch({ query: SITE_SETTINGS_QUERY, stega: false }),
  ])

  if (!result) return {}

  const seo = result.kind === 'page' ? result.page.seo : result.legal.seo

  return buildMetadata({
    seo,
    path,
    locale,
    siteUrl,
    siteName: settings?.title,
    defaultOgImage: settings?.defaultOgImage,
  })
}

export default async function CatchAllPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const result = await load(slug.join('/'), locale, true)

  if (!result) notFound()

  if (result.kind === 'legal') {
    return (
      <Section container="narrow">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{result.legal.title}</h1>
        <Prose className="mt-8">
          <PortableTextRenderer value={result.legal.body} locale={locale} />
        </Prose>
      </Section>
    )
  }

  return (
    <PageBuilder blocks={result.page.pageBuilder} locale={locale} documentId={result.page._id} />
  )
}
