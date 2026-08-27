import { EarthGlobeIcon } from '@sanity/icons/EarthGlobe'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const expeditionProductsBlock = defineType({
  name: 'expeditionProductsBlock',
  title: 'Expedition products',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 2 }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'expeditionProduct' }] })],
      description: 'Exactly two products by design.',
    }),
    defineField({
      name: 'displayMode',
      title: 'Display mode',
      type: 'string',
      options: {
        list: [
          { title: 'Cards (short)', value: 'cards' },
          { title: 'Comparison table', value: 'comparisonTable' },
          { title: 'Detailed sections', value: 'detailed' },
        ],
        layout: 'radio',
      },
      initialValue: 'cards',
    }),
  ],
  preview: {
    select: { title: 'heading', mode: 'displayMode' },
    prepare({ title, mode }) {
      return { title: title || 'Expedition products', subtitle: mode, media: EarthGlobeIcon }
    },
  },
})
