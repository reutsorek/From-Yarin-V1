import { BlockquoteIcon } from '@sanity/icons/Blockquote'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const testimonialsBlock = defineType({
  name: 'testimonialsBlock',
  title: 'Testimonials',
  type: 'object',
  icon: BlockquoteIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Testimonials',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'testimonial',
          title: 'Testimonial',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'authorName',
              title: 'Author name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'authorRole', title: 'Author role', type: 'string' }),
            defineField({ name: 'avatar', title: 'Avatar', type: 'imageWithAlt' }),
          ],
          preview: {
            select: { title: 'authorName', quote: 'quote', media: 'avatar' },
            prepare({ title, quote, media }) {
              const excerpt = typeof quote === 'string' ? quote.slice(0, 60) : ''
              return { title: title || 'Testimonial', subtitle: excerpt, media }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Testimonials', subtitle: 'Testimonials', media: BlockquoteIcon }
    },
  },
})
