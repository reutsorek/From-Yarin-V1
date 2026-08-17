import { HeroBlock } from './blocks/hero'
import { RichTextBlock } from './blocks/rich-text'
import { FeatureGridBlock } from './blocks/feature-grid'
import { LogoCloudBlock } from './blocks/logo-cloud'
import { TestimonialsBlock } from './blocks/testimonials'
import { StatsBlock } from './blocks/stats'
import { FaqsBlock } from './blocks/faqs'
import { PricingBlock } from './blocks/pricing'
import { CtaBlock } from './blocks/cta'
import { ContactFormBlock } from './blocks/contact-form'
import type { PageBuilderBlock } from './blocks/types'

export interface PageBuilderProps {
  blocks: PageBuilderBlock[] | null | undefined
  locale: string
  documentId?: string
}

export function PageBuilder({ blocks, locale, documentId }: PageBuilderProps) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block) => (
        <BlockRenderer key={block._key} block={block} locale={locale} documentId={documentId} />
      ))}
    </>
  )
}

function BlockRenderer({
  block,
  locale,
  documentId,
}: {
  block: PageBuilderBlock
  locale: string
  documentId?: string
}) {
  switch (block._type) {
    case 'heroBlock':
      return <HeroBlock {...block} locale={locale} documentId={documentId} />
    case 'richTextBlock':
      return <RichTextBlock {...block} locale={locale} />
    case 'featureGridBlock':
      return <FeatureGridBlock {...block} locale={locale} />
    case 'logoCloudBlock':
      return <LogoCloudBlock {...block} locale={locale} />
    case 'testimonialsBlock':
      return <TestimonialsBlock {...block} locale={locale} />
    case 'statsBlock':
      return <StatsBlock {...block} locale={locale} />
    case 'faqsBlock':
      return <FaqsBlock {...block} locale={locale} />
    case 'pricingBlock':
      return <PricingBlock {...block} locale={locale} />
    case 'ctaBlock':
      return <CtaBlock {...block} locale={locale} />
    case 'contactFormBlock':
      return <ContactFormBlock {...block} locale={locale} />
    default: {
      // Adding a block schema without a renderer must fail typecheck here, not at runtime.
      const _exhaustive: never = block
      if (process.env.NODE_ENV === 'development') {
        const unknownType = (_exhaustive as { _type?: string })?._type ?? 'unknown'
        return (
          <div className="border-destructive bg-destructive/5 text-destructive mx-auto my-4 max-w-6xl rounded-lg border p-4 text-sm font-medium">
            {`Missing renderer for page builder block: ${unknownType}`}
          </div>
        )
      }
      return null
    }
  }
}
