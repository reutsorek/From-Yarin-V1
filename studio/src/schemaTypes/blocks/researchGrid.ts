import { DocumentsIcon } from '@sanity/icons/Documents'
import { defineField, defineType } from 'sanity'

/**
 * Renders every researchProject and publicationOrMedia document for the current locale
 * (auto-fetched, not manually picked), with an explicit empty state when none exist yet.
 */
export const researchGridBlock = defineType({
  name: 'researchGridBlock',
  title: 'Research grid',
  type: 'object',
  icon: DocumentsIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 2 }),
    defineField({
      name: 'emptyStateText',
      title: 'Empty state text',
      type: 'text',
      rows: 2,
      description: 'Shown when there are no research projects or publications yet.',
    }),
    defineField({
      name: 'googleScholarUrl',
      title: 'Google Scholar URL',
      type: 'url',
      description: 'Link to the full Google Scholar profile. Leave empty to hide.',
    }),
    defineField({
      name: 'orcidUrl',
      title: 'ORCID URL',
      type: 'url',
      description: 'Link to the full ORCID record. Leave empty to hide.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Research grid', subtitle: 'Research grid', media: DocumentsIcon }
    },
  },
})
