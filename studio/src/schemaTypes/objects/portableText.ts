import { defineArrayMember, defineField, defineType } from 'sanity'
import { LINKABLE_TYPES } from './link'

/**
 * Heading levels are presentational, so the schema offers h2-h4 only.
 * The page's h1 comes from the document title, not from body copy.
 */
export const portableText = defineType({
  name: 'portableText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          defineArrayMember({
            name: 'externalLink',
            title: 'External link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule
                    .required()
                    .uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
              }),
            ],
          }),
          defineArrayMember({
            name: 'internalLink',
            title: 'Internal link',
            type: 'object',
            fields: [
              defineField({
                name: 'reference',
                title: 'Page',
                type: 'reference',
                to: LINKABLE_TYPES.map((type) => ({ type })),
                validation: (rule) => rule.required(),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({ type: 'imageWithAlt' }),
    defineArrayMember({ type: 'callout' }),
    defineArrayMember({ type: 'videoEmbed' }),
  ],
})

export const callout = defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: {
        list: [
          { title: 'Tip', value: 'tip' },
          { title: 'Info', value: 'info' },
          { title: 'Warning', value: 'warning' },
          { title: 'Important', value: 'important' },
        ],
      },
      initialValue: 'tip',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({ type: 'block', styles: [{ title: 'Normal', value: 'normal' }] })],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', tone: 'tone' },
    prepare({ title, tone }) {
      return { title: title || 'Callout', subtitle: tone }
    },
  },
})

export const videoEmbed = defineType({
  name: 'videoEmbed',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube or Loom URL',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'title', title: 'Accessible title', type: 'string' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'url' },
  },
})
