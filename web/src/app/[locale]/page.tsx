import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { PageBuilder } from '@/components/page-builder'
import type { Locale } from '@/i18n/routing'
import { siteUrl } from '@/lib/env'
import { buildMetadata } from '@/lib/seo'
import { sanityFetch } from '@/sanity/lib/live'
import { HOME_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries'

interface Props {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({ query: HOME_PAGE_QUERY, params: { locale }, stega: false }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, stega: false }),
  ])

  return buildMetadata({
    seo: page?.seo,
    path: '',
    locale,
    siteUrl,
    siteName: settings?.title,
    defaultOgImage: settings?.defaultOgImage,
  })
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const { data: page } = await sanityFetch({ query: HOME_PAGE_QUERY, params: { locale } })

  if (!page) notFound()

  return <PageBuilder blocks={page.pageBuilder} locale={locale} documentId={page._id} />
}
