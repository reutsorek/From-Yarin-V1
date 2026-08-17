import { ImagesIcon } from '@sanity/icons/Images'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const logoCloudBlock = defineType({
  name: 'logoCloudBlock',
  title: 'Logo cloud',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [defineArrayMember({ type: 'imageWithAlt' })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'logos.0' },
    prepare({ title, media }) {
      return { title: title || 'Logo cloud', subtitle: 'Logo cloud', media: media || ImagesIcon }
    },
  },
})
