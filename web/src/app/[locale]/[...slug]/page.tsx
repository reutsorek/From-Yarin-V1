import type { Metadata } from 'next'
import { stegaClean } from 'next-sanity'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import type { Person, WithContext } from 'schema-dts'

import { JsonLd } from '@/components/json-ld'
import { PageBuilder } from '@/components/page-builder'
import { PortableTextRenderer } from '@/components/portable-text'
import { Prose } from '@/components/primitives/prose'
import { Section } from '@/components/primitives/section'
import type { Locale } from '@/i18n/routing'
import { siteUrl } from '@/lib/env'
import { buildMetadata } from '@/lib/seo'
import { safeFetch } from '@/sanity/lib/safe-fetch'
import { urlFor } from '@/sanity/lib/image'
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

  const founderBlock = result.page.pageBuilder?.find(
    (block): block is Extract<typeof block, { _type: 'founderIntroBlock' }> =>
      block._type === 'founderIntroBlock',
  )
  const founder = founderBlock?.founder

  const personJsonLd: WithContext<Person> | null = founder?.name
    ? {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: stegaClean(founder.name),
        jobTitle: stegaClean(founder.role) || undefined,
        description: stegaClean(founder.shortBio) || undefined,
        image: founder.portrait?.asset ? urlFor(founder.portrait).width(800).url() : undefined,
        url: `${siteUrl}/${locale}/${slug.join('/')}`,
        knowsAbout: founder.specialties?.length
          ? founder.specialties.map((item) => stegaClean(item))
          : undefined,
        hasCredential: founder.credentials?.length
          ? founder.credentials.map((item) => ({
              '@type': 'EducationalOccupationalCredential',
              name: stegaClean(item),
            }))
          : undefined,
        affiliation: founder.affiliations?.length
          ? founder.affiliations.map((item) => ({
              '@type': 'Organization',
              name: stegaClean(item),
            }))
          : undefined,
      }
    : null

  const settings = personJsonLd
    ? (await sanityFetch({ query: SITE_SETTINGS_QUERY, stega: false })).data
    : null

  if (personJsonLd && settings) {
    personJsonLd.sameAs = settings.socials
      ?.map((social) => social.url)
      .filter((url): url is string => Boolean(url))
    personJsonLd.worksFor = settings.title
      ? { '@type': 'Organization', name: settings.title, url: siteUrl }
      : undefined
  }

  return (
    <>
      {personJsonLd ? <JsonLd data={personJsonLd} /> : null}
      <PageBuilder blocks={result.page.pageBuilder} locale={locale} documentId={result.page._id} />
    </>
  )
}
