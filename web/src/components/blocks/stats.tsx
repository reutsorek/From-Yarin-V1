import { Section, SectionHeader } from '@/components/primitives/section'
import type { StatsBlockValue } from './types'

export type StatsBlockProps = StatsBlockValue & { locale: string }

export function StatsBlock({ heading, items }: StatsBlockProps) {
  if (!items?.length) return null

  return (
    <Section>
      <SectionHeader level={2} heading={heading} />
      <dl className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item._key}
            className="border-border bg-card flex flex-col items-center gap-2 rounded-lg border p-8 text-center"
          >
            <dt className="text-muted-foreground order-2 text-sm font-medium">{item.label}</dt>
            <dd className="text-foreground order-1 text-4xl font-semibold tracking-tight sm:text-5xl">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
