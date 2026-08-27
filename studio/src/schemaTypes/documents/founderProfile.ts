import { UserIcon } from '@sanity/icons/User'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { contentGroups, imageField, languageField, seoField, slugField } from '../shared/fields'

export const founderProfile = defineType({
  name: 'founderProfile',
  title: 'Founder profile',
  type: 'document',
  icon: UserIcon,
  groups: contentGroups,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    { ...slugField('name'), group: 'content' },
    { ...languageField(), group: 'content' },
    defineField({ name: 'role', title: 'Role', type: 'string', group: 'content' }),
    defineField({
      name: 'shortBio',
      title: 'Short bio',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Used in previews and social cards.',
    }),
    defineField({
      name: 'fullBio',
      title: 'Full bio',
      type: 'portableText',
      group: 'content',
    }),
    { ...imageField('portrait', 'Portrait'), group: 'content' },
    defineField({
      name: 'edgeNarrative',
      title: 'Edge narrative',
      type: 'text',
      rows: 8,
      group: 'content',
      description: 'The "come to the edge" founder statement, in her own words.',
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'content',
      description: 'Verified degrees and titles only. Leave empty until confirmed.',
    }),
    defineField({
      name: 'affiliations',
      title: 'Affiliations',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'content',
      description: 'Verified institutional affiliations only. Leave empty until confirmed.',
    }),
    defineField({
      name: 'specialties',
      title: 'Specialties',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'content',
    }),
    defineField({
      name: 'speakingAndAdvisoryCopy',
      title: 'Speaking and advisory availability',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'socialOverrides',
      title: 'Social links override',
      type: 'array',
      description: 'Only set these to override the site-wide social links from Site settings.',
      group: 'content',
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
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Google Scholar', value: 'googleScholar' },
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
    seoField(),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'portrait' },
  },
})
