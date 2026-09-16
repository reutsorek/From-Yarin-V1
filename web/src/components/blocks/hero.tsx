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
  const isFullBleed = variant === 'centered' && hasImage

  const eyebrowNode = eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null
  const headingNode = heading ? (
    <h1 className="text-foreground text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
      {heading}
    </h1>
  ) : null
  const subheadingNode = subheading ? (
    <p
      className={cn(
        'max-w-2xl text-lg leading-relaxed text-pretty sm:text-xl',
        isFullBleed ? 'text-foreground/85' : 'text-muted-foreground',
        isSplit && 'max-w-xl',
      )}
    >
      {subheading}
    </p>
  ) : null
  const ctasNode =
    ctas && ctas.length > 0 ? (
      <div
        className={cn('mt-2 flex flex-wrap gap-3', isSplit ? 'justify-start' : 'justify-center')}
      >
        {ctas.map((cta) => (
          <CtaLink key={cta._key} cta={cta} locale={locale} />
        ))}
      </div>
    ) : null

  if (isFullBleed) {
    return (
      <section
        data-sanity-document-id={documentId}
        data-sanity-block-key={_key}
        className="relative isolate flex min-h-[60svh] w-full items-end overflow-hidden sm:min-h-[85svh] lg:min-h-[90svh]"
      >
        <SanityImage
          image={image}
          width={2400}
          sizes="100vw"
          priority
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div
          aria-hidden
          className="from-background via-background/55 to-background/10 absolute inset-0 -z-10 bg-gradient-to-t"
        />
        <div className="container-page relative flex flex-col items-start gap-6 pt-32 pb-16 text-start sm:pb-24">
          {eyebrow ? (
            <p className="text-accent-foreground text-sm font-semibold tracking-widest uppercase">
              {eyebrow}
            </p>
          ) : null}
          {headingNode}
          {subheadingNode}
          {ctasNode}
        </div>
      </section>
    )
  }

  const copy = (
    <div
      className={cn(
        'flex flex-col gap-6',
        isSplit ? 'items-start text-start' : 'items-center text-center',
      )}
    >
      {eyebrowNode}
      {headingNode}
      {subheadingNode}
      {ctasNode}
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
          <figure className={cn('flex flex-col gap-2', imageFirst && 'lg:order-1')}>
            <SanityImage
              image={image}
              width={960}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="h-auto w-full rounded-lg object-cover shadow-sm"
            />
            {image?.caption ? (
              <figcaption className="text-muted-foreground text-xs">{image.caption}</figcaption>
            ) : null}
          </figure>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl">{copy}</div>
      )}
    </Section>
  )
}
