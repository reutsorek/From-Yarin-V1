import { stegaClean } from 'next-sanity'
import { Section } from '@/components/primitives/section'
import { cn } from '@/lib/cn'
import { CtaLink } from './cta-link'
import type { CtaBlockValue } from './types'

export type CtaBlockProps = CtaBlockValue & { locale: string }

const backgroundClasses: Record<string, string> = {
  muted: 'bg-muted text-foreground',
  card: 'bg-card text-card-foreground border border-border',
  primary: 'bg-primary text-primary-foreground',
}

export function CtaBlock({ heading, body, background, ctas, locale }: CtaBlockProps) {
  if (!heading && !body && !ctas?.length) return null

  const tone = stegaClean(background) ?? 'muted'
  const isPrimary = tone === 'primary'
  const panelClass = backgroundClasses[tone] ?? backgroundClasses.muted

  return (
    <Section container="wide">
      <div
        className={cn(
          'flex flex-col items-center gap-6 rounded-lg px-6 py-14 text-center sm:px-12 sm:py-20',
          panelClass,
        )}
      >
        {heading ? (
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {heading}
          </h2>
        ) : null}
        {body ? (
          <p
            className={cn(
              'max-w-2xl text-base leading-relaxed text-pretty sm:text-lg',
              isPrimary ? 'opacity-90' : 'text-muted-foreground',
            )}
          >
            {body}
          </p>
        ) : null}
        {ctas?.length ? (
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {ctas.map((cta) => (
              <CtaLink key={cta._key} cta={cta} locale={locale} />
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  )
}
