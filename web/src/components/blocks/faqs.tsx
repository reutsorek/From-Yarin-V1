import { stegaClean } from 'next-sanity'
import { Section, SectionHeader } from '@/components/primitives/section'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Prose } from '@/components/primitives/prose'
import { PortableTextRenderer } from '@/components/portable-text'
import type { FaqsBlockValue, PortableTextValue } from './types'

export type FaqsBlockProps = FaqsBlockValue & { locale: string }

interface ResolvedFaq {
  id: string
  question: string
  answer: PortableTextValue | null
}

export function FaqsBlock({ heading, source, items, inlineItems, locale }: FaqsBlockProps) {
  const resolved: ResolvedFaq[] =
    stegaClean(source) === 'inline'
      ? (inlineItems ?? [])
          .filter((item) => Boolean(item.question))
          .map((item) => ({
            id: item._key,
            question: item.question as string,
            answer: item.answer ?? null,
          }))
      : (items ?? [])
          .filter((item) => Boolean(item.question))
          .map((item) => ({
            id: item._id,
            question: item.question as string,
            answer: item.answer ?? null,
          }))

  if (resolved.length === 0) return null

  return (
    <Section container="narrow">
      <SectionHeader level={2} heading={heading} />
      <Accordion type="single" collapsible className="border-border mt-12 w-full border-t">
        {resolved.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              <Prose className="prose-sm">
                <PortableTextRenderer value={faq.answer} locale={locale} />
              </Prose>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  )
}
