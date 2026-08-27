import { DiamondIcon } from '@sanity/icons/Diamond'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const positioningBlock = defineType({
  name: 'positioningBlock',
  title: 'Positioning (not this / but this)',
  type: 'object',
  icon: DiamondIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'notThisItems',
      title: 'Not this',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'butThisHeading', title: 'But this, heading', type: 'string' }),
    defineField({ name: 'butThisText', title: 'But this, text', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Positioning', subtitle: 'Not this / but this', media: DiamondIcon }
    },
  },
})
