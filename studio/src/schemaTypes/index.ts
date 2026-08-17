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
import { pageBuilder } from './blocks/pageBuilder'

import { page } from './documents/page'
import { post } from './documents/post'
import { author } from './documents/author'
import { category } from './documents/category'
import { faq } from './documents/faq'
import { legalDocument } from './documents/legalDocument'
import { redirect } from './documents/redirect'
import { siteSettings } from './documents/siteSettings'
import { navigation } from './documents/navigation'

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
  // documents
  page,
  post,
  author,
  category,
  faq,
  legalDocument,
  redirect,
  siteSettings,
  navigation,
]

export const schemaTypes = definitions.map(withDocumentGuards)

export const SINGLETON_TYPES = ['siteSettings', 'navigation'] as const
export const LOCALIZED_TYPES = ['page', 'post', 'legalDocument'] as const
