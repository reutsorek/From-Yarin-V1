import { defineField, defineType } from 'sanity'

export const cta = defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Ghost', value: 'ghost' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: { title: 'link.label', variant: 'variant' },
    prepare({ title, variant }) {
      return { title: title || 'Call to action', subtitle: variant }
    },
  },
})
