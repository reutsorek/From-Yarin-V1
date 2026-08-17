import { BarChartIcon } from '@sanity/icons/BarChart'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const statsBlock = defineType({
  name: 'statsBlock',
  title: 'Stats',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          title: 'Stat',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'For example 98%.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(4),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Stats', subtitle: 'Stats', media: BarChartIcon }
    },
  },
})
