import { UsersIcon } from '@sanity/icons/Users'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { contentGroups, imageField, languageField, slugField } from '../shared/fields'

export const audiencePath = defineType({
  name: 'audiencePath',
  title: 'Audience path',
  type: 'document',
  icon: UsersIcon,
  groups: contentGroups,
  fields: [
    defineField({
      name: 'audienceName',
      title: 'Audience name',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    { ...slugField('audienceName'), group: 'content' },
    { ...languageField(), group: 'content' },
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'content',
      description: 'The strategic or emotional hook.',
    }),
    defineField({
      name: 'motivation',
      title: 'Core motivation',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'valueProposition',
      title: 'Value they gain',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'desiredOutcomes',
      title: 'Desired outcomes',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'content',
    }),
    { ...imageField('image', 'Image'), group: 'content' },
    defineField({ name: 'cta', title: 'Call to action', type: 'cta', group: 'content' }),
    defineField({
      name: 'linkedProducts',
      title: 'Linked expedition products',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'expeditionProduct' }] })],
      group: 'content',
    }),
  ],
  preview: {
    select: { title: 'audienceName', subtitle: 'headline', media: 'image' },
  },
})
