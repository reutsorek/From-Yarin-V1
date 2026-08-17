import { BulbOutlineIcon } from '@sanity/icons/BulbOutline'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'Call to action',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({ type: 'cta' })],
      validation: (rule) => rule.min(1).max(2),
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'Muted', value: 'muted' },
          { title: 'Card', value: 'card' },
          { title: 'Primary', value: 'primary' },
        ],
        layout: 'radio',
      },
      initialValue: 'muted',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return {
        title: title || 'Call to action',
        subtitle: 'Call to action',
        media: BulbOutlineIcon,
      }
    },
  },
})
