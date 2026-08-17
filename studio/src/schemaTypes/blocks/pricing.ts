import { CreditCardIcon } from '@sanity/icons/CreditCard'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const pricingBlock = defineType({
  name: 'pricingBlock',
  title: 'Pricing',
  type: 'object',
  icon: CreditCardIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'plans',
      title: 'Plans',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pricingPlan',
          title: 'Plan',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'price', title: 'Price', type: 'string' }),
            defineField({
              name: 'period',
              title: 'Period',
              type: 'string',
              description: 'For example per month.',
            }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
            }),
            defineField({ name: 'cta', title: 'Button', type: 'cta' }),
            defineField({
              name: 'highlighted',
              title: 'Highlighted',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'price' },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Pricing', subtitle: 'Pricing', media: CreditCardIcon }
    },
  },
})
