import { BookIcon } from '@sanity/icons/Book'
import { defineField, defineType } from 'sanity'
import { contentGroups, languageField, seoField, slugField } from '../shared/fields'

export const legalDocument = defineType({
  name: 'legalDocument',
  title: 'Legal document',
  type: 'document',
  icon: BookIcon,
  groups: contentGroups,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    { ...slugField(), group: 'content' },
    { ...languageField(), group: 'content' },
    defineField({
      name: 'documentType',
      title: 'Document type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Terms of service', value: 'terms' },
          { title: 'Privacy policy', value: 'privacy' },
          { title: 'Accessibility statement', value: 'accessibility' },
          { title: 'Cookie policy', value: 'cookies' },
        ],
      },
    }),
    defineField({ name: 'version', title: 'Version', type: 'string', group: 'content' }),
    defineField({ name: 'effectiveDate', title: 'Effective date', type: 'date', group: 'content' }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    seoField(),
  ],
  preview: {
    select: { title: 'title', subtitle: 'documentType' },
  },
})
