import { MicrophoneIcon } from '@sanity/icons/Microphone'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { contentGroups, imageField, languageField, seoField, slugField } from '../shared/fields'

export const speakingTopic = defineType({
  name: 'speakingTopic',
  title: 'Speaking topic',
  type: 'document',
  icon: MicrophoneIcon,
  groups: contentGroups,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    { ...slugField(), group: 'content' },
    { ...languageField(), group: 'content' },
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full description',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'idealAudience',
      title: 'Ideal audience',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'content',
    }),
    defineField({
      name: 'keyTakeaways',
      title: 'Key takeaways',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'content',
    }),
    defineField({
      name: 'availableFormats',
      title: 'Available formats',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          { title: 'Keynote', value: 'keynote' },
          { title: 'Fireside chat', value: 'fireside' },
          { title: 'Executive briefing', value: 'briefing' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Moderated discussion', value: 'moderated' },
        ],
      },
    }),
    { ...imageField('heroImage', 'Hero image'), group: 'content' },
    defineField({ name: 'ctaLabel', title: 'CTA label', type: 'string', group: 'content' }),
    seoField(),
  ],
  preview: {
    select: { title: 'title', media: 'heroImage' },
  },
})
