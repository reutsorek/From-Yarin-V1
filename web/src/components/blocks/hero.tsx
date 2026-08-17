import { stegaClean } from 'next-sanity'
import { Section } from '@/components/primitives/section'
import { Eyebrow } from '@/components/primitives/eyebrow'
import { SanityImage } from '@/components/sanity-image'
import { cn } from '@/lib/cn'
import { CtaLink } from './cta-link'
import type { HeroBlockValue } from './types'

export type HeroBlockProps = HeroBlockValue & { locale: string; documentId?: string }

export function HeroBlock({
  _key,
  eyebrow,
  heading,
  subheading,
  layout,
  image,
  ctas,
  locale,
  documentId,
}: HeroBlockProps) {
  const hasImage = Boolean(image?.asset)
  const variant = stegaClean(layout) ?? 'centered'
  const isSplit = (variant === 'split' || variant === 'imageStart') && hasImage
  const imageFirst = variant === 'imageStart'

  const copy = (
    <div
      className={cn(
        'flex flex-col gap-6',
        isSplit ? 'items-start text-start' : 'items-center text-center',
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {heading ? (
        <h1 className="text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {heading}
        </h1>
      ) : null}
      {subheading ? (
        <p
          className={cn(
            'text-muted-foreground text-lg leading-relaxed text-pretty sm:text-xl',
            isSplit ? 'max-w-xl' : 'max-w-2xl',
          )}
        >
          {subheading}
        </p>
      ) : null}
      {ctas && ctas.length > 0 ? (
        <div
          className={cn('mt-2 flex flex-wrap gap-3', isSplit ? 'justify-start' : 'justify-center')}
        >
          {ctas.map((cta) => (
            <CtaLink key={cta._key} cta={cta} locale={locale} />
          ))}
        </div>
      ) : null}
    </div>
  )

  return (
    <Section
      spacing="loose"
      container="wide"
      data-sanity-document-id={documentId}
      data-sanity-block-key={_key}
    >
      {isSplit ? (
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className={cn(imageFirst && 'lg:order-2')}>{copy}</div>
          <div className={cn(imageFirst && 'lg:order-1')}>
            <SanityImage
              image={image}
              width={960}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="h-auto w-full rounded-lg object-cover shadow-sm"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-12">
          <div className="mx-auto max-w-3xl">{copy}</div>
          {hasImage ? (
            <SanityImage
              image={image}
              width={1600}
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
              className="h-auto w-full max-w-5xl rounded-lg object-cover shadow-sm"
            />
          ) : null}
        </div>
      )}
    </Section>
  )
}
