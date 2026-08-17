import { RocketIcon } from '@sanity/icons/Rocket'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 3 }),
    defineField({ name: 'image', title: 'Image', type: 'imageWithAlt' }),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({ type: 'cta' })],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Centered', value: 'centered' },
          { title: 'Split', value: 'split' },
          { title: 'Split, image first', value: 'imageStart' },
        ],
        layout: 'radio',
      },
      initialValue: 'centered',
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Untitled hero', subtitle: 'Hero', media: media || RocketIcon }
    },
  },
})
