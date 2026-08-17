import { Section } from '@/components/primitives/section'
import { Prose } from '@/components/primitives/prose'
import { PortableTextRenderer } from '@/components/portable-text'
import type { RichTextBlockValue } from './types'

export type RichTextBlockProps = RichTextBlockValue & { locale: string }

const widthMap = {
  narrow: 'narrow',
  default: 'narrow',
  wide: 'default',
} as const

export function RichTextBlock({ heading, width, body, locale }: RichTextBlockProps) {
  if (!body?.length && !heading) return null

  const container = widthMap[(width ?? 'default') as keyof typeof widthMap] ?? 'narrow'

  return (
    <Section container={container}>
      {heading ? (
        <h2 className="text-foreground mb-8 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {heading}
        </h2>
      ) : null}
      <Prose>
        <PortableTextRenderer value={body} locale={locale} />
      </Prose>
    </Section>
  )
}
