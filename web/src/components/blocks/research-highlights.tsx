import { Section, SectionHeader } from '@/components/primitives/section'
import type { ResearchHighlightsBlockValue } from './types'

export type ResearchHighlightsBlockProps = ResearchHighlightsBlockValue & { locale: string }

export function ResearchHighlightsBlock({ heading, intro, items }: ResearchHighlightsBlockProps) {
  if (!items?.length) return null

  return (
    <Section>
      <SectionHeader level={2} heading={heading} intro={intro} />
      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item._key} className="border-border border-s-2 ps-6">
            {item.title ? (
              <h3 className="text-foreground text-lg font-semibold">{item.title}</h3>
            ) : null}
            {item.description ? (
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-pretty">
                {item.description}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  )
}
