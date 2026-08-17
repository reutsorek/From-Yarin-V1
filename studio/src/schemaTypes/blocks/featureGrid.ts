import { ThLargeIcon } from '@sanity/icons/ThLarge'
import { defineArrayMember, defineField, defineType } from 'sanity'

const ICON_OPTIONS = [
  { title: 'Sparkles', value: 'sparkles' },
  { title: 'Zap', value: 'zap' },
  { title: 'Shield', value: 'shield' },
  { title: 'Heart', value: 'heart' },
  { title: 'Chart', value: 'chart' },
  { title: 'Users', value: 'users' },
  { title: 'Calendar', value: 'calendar' },
  { title: 'Message', value: 'message' },
]

export const featureGridBlock = defineType({
  name: 'featureGridBlock',
  title: 'Feature grid',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [2, 3, 4] },
      initialValue: 3,
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          title: 'Feature',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: { list: ICON_OPTIONS },
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          ],
          preview: {
            select: { title: 'title', icon: 'icon' },
            prepare({ title, icon }) {
              return { title: title || 'Feature', subtitle: icon || 'No icon' }
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Feature grid', subtitle: 'Feature grid', media: ThLargeIcon }
    },
  },
})
