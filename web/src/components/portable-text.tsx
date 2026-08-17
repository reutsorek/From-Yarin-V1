import * as React from 'react'
import {
  PortableText,
  toPlainText,
  type PortableTextBlock,
  type PortableTextComponents,
} from 'next-sanity'
import { Info, Lightbulb, AlertTriangle, Flag } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'
import { resolveInternalHref, type InternalReference } from '@/config/urls'
import { SanityImage } from './sanity-image'
import type { ProjectedImage } from '@/sanity/lib/image'

/** Hebrew and other non-latin headings must still produce usable anchors, hence the Unicode classes. */
export function slugifyHeading(input: string): string {
  return input
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/gu, '-')
}

export function toEmbedUrl(url: string): string | null {
  if (!url) return null

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }

  const host = parsed.hostname.replace(/^www\./, '')

  if (host === 'youtu.be') {
    const id = parsed.pathname.slice(1)
    return id ? `https://www.youtube.com/embed/${id}` : null
  }

  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    if (parsed.pathname.startsWith('/embed/')) return `https://www.youtube.com${parsed.pathname}`
    if (parsed.pathname.startsWith('/shorts/')) {
      const id = parsed.pathname.split('/')[2]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
    const id = parsed.searchParams.get('v')
    return id ? `https://www.youtube.com/embed/${id}` : null
  }

  if (host === 'loom.com') {
    const match = parsed.pathname.match(/^\/(?:share|embed|v)\/([\w-]+)/)
    return match ? `https://www.loom.com/embed/${match[1]}` : null
  }

  return null
}

type CalloutTone = 'tip' | 'info' | 'warning' | 'important'

const calloutTones: Record<
  CalloutTone,
  { icon: React.ComponentType<{ className?: string }>; className: string; iconClassName: string }
> = {
  tip: {
    icon: Lightbulb,
    className: 'border-s-primary bg-primary/5',
    iconClassName: 'text-primary',
  },
  info: {
    icon: Info,
    className: 'border-s-border bg-muted',
    iconClassName: 'text-muted-foreground',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-s-destructive bg-destructive/5',
    iconClassName: 'text-destructive',
  },
  important: {
    icon: Flag,
    className: 'border-s-accent-foreground bg-accent',
    iconClassName: 'text-accent-foreground',
  },
}

interface CalloutValue {
  tone?: CalloutTone | string | null
  title?: string | null
  body?: readonly { _type: string; _key: string }[] | null
  text?: string | null
}

interface VideoEmbedValue {
  url?: string | null
  title?: string | null
}

interface ExternalLinkMark {
  href?: string | null
}

interface InternalLinkMark {
  reference?: InternalReference | null
}

function headingId(value: PortableTextBlock): string | undefined {
  const text = toPlainText(value)
  const slug = slugifyHeading(text)
  return slug || undefined
}

export function buildPortableTextComponents(locale: string): PortableTextComponents {
  return {
    types: {
      imageWithAlt: ({ value }: { value: ProjectedImage }) => {
        if (!value?.asset) return null
        return (
          <figure className="my-8">
            <SanityImage
              image={value}
              width={1200}
              sizes="(max-width: 768px) 100vw, 768px"
              className="h-auto w-full rounded-lg"
            />
            {value.caption ? (
              <figcaption className="text-muted-foreground mt-3 text-center text-sm">
                {value.caption}
              </figcaption>
            ) : null}
          </figure>
        )
      },
      callout: ({ value }: { value: CalloutValue }) => {
        const tone = (value?.tone ?? 'info') as CalloutTone
        const config = calloutTones[tone] ?? calloutTones.info
        const Icon = config.icon

        return (
          <div
            className={cn('my-8 flex gap-3 rounded-lg border-s-4 p-5 text-start', config.className)}
          >
            <Icon className={cn('mt-0.5 size-5 shrink-0', config.iconClassName)} />
            <div className="text-foreground min-w-0 flex-1 text-sm leading-relaxed">
              {value.title ? <p className="mb-1 font-semibold">{value.title}</p> : null}
              {Array.isArray(value.body) && value.body.length > 0 ? (
                <PortableTextRenderer value={value.body} locale={locale} />
              ) : value.text ? (
                <p>{value.text}</p>
              ) : null}
            </div>
          </div>
        )
      },
      videoEmbed: ({ value }: { value: VideoEmbedValue }) => {
        const embedUrl = value?.url ? toEmbedUrl(value.url) : null
        if (!embedUrl) return null

        return (
          <figure className="my-8">
            <div className="bg-muted aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                src={embedUrl}
                title={value.title ?? 'Embedded video'}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="size-full border-0"
              />
            </div>
          </figure>
        )
      },
    },

    marks: {
      externalLink: ({ value, children }) => {
        const href = (value as ExternalLinkMark | undefined)?.href
        if (!href) return <>{children}</>
        const isInternal = href.startsWith('/')

        return (
          <a
            href={href}
            className="text-primary font-medium underline underline-offset-4"
            {...(isInternal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
          >
            {children}
          </a>
        )
      },
      internalLink: ({ value, children }) => {
        const href = resolveInternalHref((value as InternalLinkMark | undefined)?.reference, locale)
        if (!href) return <>{children}</>

        return (
          <Link href={href} className="text-primary font-medium underline underline-offset-4">
            {children}
          </Link>
        )
      },
      code: ({ children }) => (
        <code className="bg-muted text-foreground rounded-lg px-1.5 py-0.5 font-mono text-[0.875em]">
          {children}
        </code>
      ),
    },

    block: {
      h2: ({ children, value }) => (
        <h2
          id={headingId(value as PortableTextBlock)}
          className="text-foreground mt-12 scroll-mt-24 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {children}
        </h2>
      ),
      h3: ({ children, value }) => (
        <h3
          id={headingId(value as PortableTextBlock)}
          className="text-foreground mt-10 scroll-mt-24 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {children}
        </h3>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-border text-foreground my-8 border-s-4 ps-5 text-lg">
          {children}
        </blockquote>
      ),
    },

    list: {
      bullet: ({ children }) => (
        <ul className="text-muted-foreground my-6 list-disc space-y-2 ps-6">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="text-muted-foreground my-6 list-decimal space-y-2 ps-6">{children}</ol>
      ),
    },

    listItem: {
      bullet: ({ children }) => <li className="ps-1">{children}</li>,
      number: ({ children }) => <li className="ps-1">{children}</li>,
    },
  }
}

export interface PortableTextRendererProps {
  /** The generated projection type, which is wider than PortableTextBlock. */
  value: readonly { _type: string; _key: string }[] | null | undefined
  locale?: string
}

export function PortableTextRenderer({ value, locale = '' }: PortableTextRendererProps) {
  if (!value || value.length === 0) return null

  // Generated block types carry optional children and extra custom types, so they
  // do not structurally satisfy PortableTextBlock. This is the one boundary cast.
  const blocks = value as unknown as PortableTextBlock[]

  return <PortableText value={blocks} components={buildPortableTextComponents(locale)} />
}
