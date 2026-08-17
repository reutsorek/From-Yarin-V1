import { HelpCircleIcon } from '@sanity/icons/HelpCircle'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const faqsBlock = defineType({
  name: 'faqsBlock',
  title: 'FAQs',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Reuse existing FAQs', value: 'referenced' },
          { title: 'Write them here', value: 'inline' },
        ],
        layout: 'radio',
      },
      initialValue: 'referenced',
    }),
    defineField({
      name: 'items',
      title: 'FAQs',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })],
      hidden: ({ parent }) => parent?.source !== 'referenced',
    }),
    defineField({
      name: 'inlineItems',
      title: 'FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          title: 'FAQ',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'portableText',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'question' },
            prepare({ title }) {
              return { title: title || 'FAQ' }
            },
          },
        }),
      ],
      hidden: ({ parent }) => parent?.source !== 'inline',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'FAQs', subtitle: 'FAQs', media: HelpCircleIcon }
    },
  },
})
