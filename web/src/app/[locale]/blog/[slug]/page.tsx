import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server'
import type { Article, WithContext } from 'schema-dts'

import { JsonLd } from '@/components/json-ld'
import { PortableTextRenderer } from '@/components/portable-text'
import { Prose } from '@/components/primitives/prose'
import { Section } from '@/components/primitives/section'
import { SanityImage } from '@/components/sanity-image'
import { ROUTES } from '@/config/urls'
import type { Locale } from '@/i18n/routing'
import { siteUrl } from '@/lib/env'
import { buildMetadata, readingMinutes } from '@/lib/seo'
import { safeFetch } from '@/sanity/lib/safe-fetch'
import { urlFor } from '@/sanity/lib/image'
import { sanityFetch } from '@/sanity/lib/live'
import { POST_BY_SLUG_QUERY, POST_SLUGS_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries'

interface Props {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateStaticParams() {
  const posts = await safeFetch('post slugs', (client) => client.fetch(POST_SLUGS_QUERY), [])
  return posts
    .filter((post) => post.slug && post.language)
    .map((post) => ({ locale: post.language as string, slug: post.slug as string }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const [{ data: post }, { data: settings }] = await Promise.all([
    sanityFetch({ query: POST_BY_SLUG_QUERY, params: { slug, locale }, stega: false }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, stega: false }),
  ])

  if (!post) return {}

  return buildMetadata({
    seo: { ...post.seo, image: post.seo?.image ?? post.coverImage },
    path: ROUTES.post(locale, slug),
    locale,
    siteUrl,
    siteName: settings?.title,
    defaultOgImage: settings?.defaultOgImage,
  })
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const { data: post } = await sanityFetch({ query: POST_BY_SLUG_QUERY, params: { slug, locale } })

  if (!post) notFound()

  const t = await getTranslations('blog')
  const format = await getFormatter()
  const published = post.publishedAt ? new Date(post.publishedAt) : null

  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title ?? '',
    description: post.excerpt ?? undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.publishedAt ?? undefined,
    image: post.coverImage?.asset ? urlFor(post.coverImage).width(1200).url() : undefined,
    author: post.author?.name ? { '@type': 'Person', name: post.author.name } : undefined,
    mainEntityOfPage: `${siteUrl}/${locale}${ROUTES.post(locale, slug)}`,
  }

  return (
    <Section container="narrow">
      <JsonLd data={jsonLd} />
      <article>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="text-muted-foreground mt-3 text-sm">
          {published ? t('publishedOn', { date: format.dateTime(published, 'long') }) : null}
          {published ? ' · ' : null}
          {t('readingTime', { minutes: readingMinutes(post.plainBody) })}
        </p>
        {post.coverImage ? (
          <SanityImage
            image={post.coverImage}
            width={1200}
            height={675}
            priority
            sizes="(min-width: 768px) 48rem, 100vw"
            className="mt-8 w-full rounded-xl object-cover"
          />
        ) : null}
        <Prose className="mt-10">
          <PortableTextRenderer value={post.body} locale={locale} />
        </Prose>
      </article>
    </Section>
  )
}
