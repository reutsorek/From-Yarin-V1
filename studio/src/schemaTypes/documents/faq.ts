import { HelpCircleIcon } from '@sanity/icons/HelpCircle'
import { defineField, defineType } from 'sanity'
import { languageField } from '../shared/fields'

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: HelpCircleIcon,
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
    languageField(),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
      description: 'Groups related questions together.',
    }),
  ],
  preview: {
    select: { title: 'question', subtitle: 'topic' },
  },
})
