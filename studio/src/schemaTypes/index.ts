import type { DocumentDefinition, Rule, SchemaTypeDefinition } from 'sanity'
import { dashFreeDocument } from '../lib/contentDashes'

import { seo } from './objects/seo'
import { link } from './objects/link'
import { cta } from './objects/cta'
import { imageWithAlt } from './objects/imageWithAlt'
import { callout, portableText, videoEmbed } from './objects/portableText'

import { heroBlock } from './blocks/hero'
import { richTextBlock } from './blocks/richText'
import { featureGridBlock } from './blocks/featureGrid'
import { logoCloudBlock } from './blocks/logoCloud'
import { testimonialsBlock } from './blocks/testimonials'
import { statsBlock } from './blocks/stats'
import { faqsBlock } from './blocks/faqs'
import { pricingBlock } from './blocks/pricing'
import { ctaBlock } from './blocks/cta'
import { contactFormBlock } from './blocks/contactForm'
import { positioningBlock } from './blocks/positioning'
import { audiencePathsBlock } from './blocks/audiencePaths'
import { expeditionProductsBlock } from './blocks/expeditionProducts'
import { speakingTopicsBlock } from './blocks/speakingTopics'
import { researchHighlightsBlock } from './blocks/researchHighlights'
import { researchGridBlock } from './blocks/researchGrid'
import { founderIntroBlock } from './blocks/founderIntro'
import { pageBuilder } from './blocks/pageBuilder'

import { page } from './documents/page'
import { faq } from './documents/faq'
import { legalDocument } from './documents/legalDocument'
import { redirect } from './documents/redirect'
import { siteSettings } from './documents/siteSettings'
import { navigation } from './documents/navigation'
import { founderProfile } from './documents/founderProfile'
import { expeditionProduct } from './documents/expeditionProduct'
import { audiencePath } from './documents/audiencePath'
import { researchProject } from './documents/researchProject'
import { publicationOrMedia } from './documents/publicationOrMedia'
import { speakingTopic } from './documents/speakingTopic'
import { inquiry } from './documents/inquiry'

/**
 * Cross-cutting document validation, applied here rather than field-by-field so a
 * document type added later is covered with nothing to remember.
 * Object types are validated through the document that embeds them.
 */
function withDocumentGuards(schema: SchemaTypeDefinition): SchemaTypeDefinition {
  if (schema.type !== 'document') return schema
  const own = (schema as DocumentDefinition).validation
  return {
    ...schema,
    validation: (rule: Rule) => {
      const existing = typeof own === 'function' ? own(rule) : undefined
      const before = Array.isArray(existing) ? existing : existing ? [existing] : []
      return [...before, rule.custom(dashFreeDocument).error()]
    },
  } as SchemaTypeDefinition
}

const definitions: SchemaTypeDefinition[] = [
  // objects
  seo,
  link,
  cta,
  imageWithAlt,
  portableText,
  callout,
  videoEmbed,
  // page builder
  pageBuilder,
  heroBlock,
  richTextBlock,
  featureGridBlock,
  logoCloudBlock,
  testimonialsBlock,
  statsBlock,
  faqsBlock,
  pricingBlock,
  ctaBlock,
  contactFormBlock,
  positioningBlock,
  audiencePathsBlock,
  expeditionProductsBlock,
  speakingTopicsBlock,
  researchHighlightsBlock,
  researchGridBlock,
  founderIntroBlock,
  // documents
  page,
  faq,
  legalDocument,
  redirect,
  siteSettings,
  navigation,
  founderProfile,
  expeditionProduct,
  audiencePath,
  researchProject,
  publicationOrMedia,
  speakingTopic,
  inquiry,
]

export const schemaTypes = definitions.map(withDocumentGuards)

export const SINGLETON_TYPES = ['siteSettings', 'navigation'] as const
export const LOCALIZED_TYPES = [
  'page',
  'legalDocument',
  'founderProfile',
  'expeditionProduct',
  'audiencePath',
  'researchProject',
  'publicationOrMedia',
  'speakingTopic',
] as const
