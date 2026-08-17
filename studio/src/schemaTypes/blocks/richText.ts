import { TextIcon } from '@sanity/icons/Text'
import { defineField, defineType } from 'sanity'

export const richTextBlock = defineType({
  name: 'richTextBlock',
  title: 'Rich text',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
      options: {
        list: [
          { title: 'Narrow', value: 'narrow' },
          { title: 'Wide', value: 'wide' },
        ],
        layout: 'radio',
      },
      initialValue: 'narrow',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Rich text', subtitle: 'Rich text', media: TextIcon }
    },
  },
})
