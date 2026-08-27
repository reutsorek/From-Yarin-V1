import { Section, SectionHeader } from '@/components/primitives/section'
import { SanityImage } from '@/components/sanity-image'
import { cn } from '@/lib/cn'
import { CtaLink } from './cta-link'
import type { AudiencePathsBlockValue } from './types'

export type AudiencePathsBlockProps = AudiencePathsBlockValue & { locale: string }

export function AudiencePathsBlock({ heading, intro, paths, locale }: AudiencePathsBlockProps) {
  if (!paths?.length) return null

  return (
    <Section>
      <SectionHeader level={2} heading={heading} intro={intro} />
      <div className="mt-14 flex flex-col gap-16 sm:gap-20">
        {paths.map((path, index) => {
          const imageOnEnd = index % 2 === 1
          const hasImage = Boolean(path.image?.asset)

          return (
            <article
              key={path._id}
              className={cn(
                'grid grid-cols-1 items-center gap-8 lg:gap-16',
                hasImage && 'lg:grid-cols-2',
              )}
            >
              {hasImage ? (
                <figure className={cn('flex flex-col gap-2', imageOnEnd && 'lg:order-2')}>
                  <SanityImage
                    image={path.image}
                    width={960}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="aspect-4/3 h-auto w-full rounded-lg object-cover"
                  />
                  {path.image?.caption ? (
                    <figcaption className="text-muted-foreground text-xs">
                      {path.image.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}
              <div className={cn('flex flex-col gap-4 text-start', imageOnEnd && 'lg:order-1')}>
                {path.audienceName ? (
                  <p className="text-primary text-sm font-semibold tracking-widest uppercase">
                    {path.audienceName}
                  </p>
                ) : null}
                {path.headline ? (
                  <h3 className="text-foreground text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                    {path.headline}
                  </h3>
                ) : null}
                {path.motivation ? (
                  <p className="text-muted-foreground text-base leading-relaxed text-pretty">
                    {path.motivation}
                  </p>
                ) : null}
                {path.valueProposition ? (
                  <p className="text-foreground text-base leading-relaxed text-pretty">
                    {path.valueProposition}
                  </p>
                ) : null}
                {path.desiredOutcomes?.length ? (
                  <ul className="mt-1 flex flex-col gap-2">
                    {path.desiredOutcomes.map((outcome, outcomeIndex) => (
                      <li
                        key={outcomeIndex}
                        className="text-muted-foreground border-s-primary border-s-2 ps-3 text-sm"
                      >
                        {outcome}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {path.cta ? (
                  <div className="mt-2">
                    <CtaLink cta={path.cta} locale={locale} size="default" />
                  </div>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}
