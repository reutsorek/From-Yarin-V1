import { ImageIcon } from '@sanity/icons/Image'
import { defineField, defineType } from 'sanity'

export const logoCloudLogo = defineType({
  name: 'logoCloudLogo',
  title: 'Logo',
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
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    defineField({
      name: 'url',
      title: 'Website URL',
      type: 'url',
      description: "Optional. Links the logo to the partner's official site.",
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: { media: 'asset', title: 'alt', subtitle: 'url' },
  },
})
