import { ImageIcon } from '@sanity/icons/Image'
import { defineField, defineType } from 'sanity'

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describes the image for screen readers and search engines.',
      validation: (rule) => rule.required().warning('Every image needs alternative text.'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: { media: 'asset', title: 'alt' },
  },
})
