import { SparklesIcon } from '@sanity/icons/Sparkles'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { contentGroups, imageField, languageField, seoField, slugField } from '../shared/fields'

export const INQUIRY_TYPES = [
  { title: 'Extreme Environments Sprint', value: 'sprint' },
  { title: 'Signature Science Expedition', value: 'signature' },
  { title: 'Research collaboration', value: 'research' },
  { title: 'Strategic advisory', value: 'advisory' },
  { title: 'Speaking / keynote', value: 'speaking' },
  { title: 'Media / documentary', value: 'media' },
  { title: 'Other', value: 'other' },
] as const

export const expeditionProduct = defineType({
  name: 'expeditionProduct',
  title: 'Expedition product',
  type: 'document',
  icon: SparklesIcon,
  groups: contentGroups,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
      description: 'Exactly two products by design: do not add a third.',
    }),
    { ...slugField(), group: 'content' },
    { ...languageField(), group: 'content' },
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'content',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full description',
      type: 'portableText',
      group: 'content',
    }),
    defineField({ name: 'idealFor', title: 'Ideal for', type: 'text', rows: 3, group: 'content' }),
    defineField({ name: 'duration', title: 'Duration', type: 'string', group: 'content' }),
    defineField({
      name: 'recommendedGroupSize',
      title: 'Recommended group size',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'includedItems',
      title: 'What is included',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'content',
    }),
    defineField({
      name: 'potentialOutcomes',
      title: 'Potential outcomes',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'content',
    }),
    defineField({
      name: 'deliverables',
      title: 'Potential deliverables',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'content',
    }),
    defineField({
      name: 'strategicOutcome',
      title: 'Core / strategic value',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'engagementModel',
      title: 'Engagement model',
      type: 'string',
      group: 'content',
      description:
        'Short label for the comparison table, e.g. "Single sprint" or "Full expedition, Science Director led".',
    }),
    defineField({
      name: 'useCases',
      title: 'Suitable for',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'content',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({ type: 'imageWithAlt' })],
      group: 'content',
    }),
    defineField({ name: 'ctaLabel', title: 'CTA label', type: 'string', group: 'content' }),
    defineField({
      name: 'ctaInquiryType',
      title: 'CTA inquiry type',
      type: 'string',
      group: 'content',
      options: { list: [...INQUIRY_TYPES] },
      description: 'Pre-selects this option on the contact form.',
    }),
    seoField(),
  ],
  preview: {
    select: { title: 'title', subtitle: 'duration' },
  },
})
