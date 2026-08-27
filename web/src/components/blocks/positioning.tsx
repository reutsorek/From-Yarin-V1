import { Check, X } from 'lucide-react'
import { Section, SectionHeader } from '@/components/primitives/section'
import type { PositioningBlockValue } from './types'

export type PositioningBlockProps = PositioningBlockValue & { locale: string }

export function PositioningBlock({
  heading,
  intro,
  notThisItems,
  butThisHeading,
  butThisText,
}: PositioningBlockProps) {
  if (!heading && !notThisItems?.length && !butThisText) return null

  return (
    <Section>
      <SectionHeader level={2} heading={heading} intro={intro} />
      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {notThisItems?.length ? (
          <div className="border-border flex flex-col gap-4 rounded-lg border p-8">
            <ul className="flex flex-col gap-3">
              {notThisItems.map((item, index) => (
                <li key={index} className="text-muted-foreground flex items-start gap-3 text-base">
                  <X className="text-muted-foreground mt-0.5 size-5 shrink-0" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {butThisText ? (
          <div className="bg-card border-border flex flex-col gap-4 rounded-lg border p-8">
            {butThisHeading ? (
              <h3 className="text-foreground text-lg font-semibold">{butThisHeading}</h3>
            ) : null}
            <p className="text-foreground flex items-start gap-3 text-base leading-relaxed text-pretty">
              <Check className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
              <span>{butThisText}</span>
            </p>
          </div>
        ) : null}
      </div>
    </Section>
  )
}
