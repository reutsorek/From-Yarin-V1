import { CogIcon } from '@sanity/icons/Cog'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageField } from '../shared/fields'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'description', title: 'Site description', type: 'text', rows: 3 }),
    imageField('logo', 'Logo'),
    defineField({
      name: 'defaultOgImage',
      title: 'Default social share image',
      type: 'image',
      options: { hotspot: true },
      description: '1200x630 recommended.',
    }),
    defineField({
      name: 'socials',
      title: 'Social profiles',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
          title: 'Social profile',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'X', value: 'x' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'TikTok', value: 'tiktok' },
                ],
              },
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        }),
      ],
    }),
    defineField({ name: 'contactEmail', title: 'Contact email', type: 'string' }),
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      fields: [
        defineField({ name: 'gaMeasurementId', title: 'Google Analytics ID', type: 'string' }),
        defineField({ name: 'posthogKey', title: 'PostHog project key', type: 'string' }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site settings' }),
  },
})
