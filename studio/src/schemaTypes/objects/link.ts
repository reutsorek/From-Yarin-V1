import { LinkIcon } from '@sanity/icons/Link'
import { defineField, defineType } from 'sanity'

export const LINKABLE_TYPES = ['page', 'post', 'legalDocument'] as const

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Links to',
      type: 'string',
      options: {
        list: [
          { title: 'A page on this site', value: 'internal' },
          { title: 'An external URL', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reference',
      title: 'Page',
      type: 'reference',
      to: LINKABLE_TYPES.map((type) => ({ type })),
      hidden: ({ parent }) => parent?.kind !== 'internal',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { kind?: string } | undefined
          if (parent?.kind === 'internal' && !value) return 'Pick a page.'
          return true
        }),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      hidden: ({ parent }) => parent?.kind !== 'external',
      validation: (rule) =>
        rule
          .uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] })
          .custom((value, context) => {
            const parent = context.parent as { kind?: string } | undefined
            if (parent?.kind === 'external' && !value) return 'Enter a URL.'
            return true
          }),
    }),
  ],
  preview: {
    select: { title: 'label', kind: 'kind', href: 'href' },
    prepare({ title, kind, href }) {
      return { title: title || 'Untitled link', subtitle: kind === 'external' ? href : 'Internal' }
    },
  },
})
