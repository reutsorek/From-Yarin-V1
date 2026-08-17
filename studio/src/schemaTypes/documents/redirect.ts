import { EnterRightIcon } from '@sanity/icons/EnterRight'
import { defineField, defineType } from 'sanity'

export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: EnterRightIcon,
  fields: [
    defineField({
      name: 'source',
      title: 'Source path',
      type: 'string',
      description: 'The old path, starting with a slash.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (typeof value === 'string' && !value.startsWith('/')) return 'Start the path with /.'
          return true
        }),
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'string',
      description: 'A path on this site or a full URL.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent (308)',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'isEnabled', title: 'Enabled', type: 'boolean', initialValue: true }),
  ],
  validation: (rule) =>
    rule.custom((doc) => {
      const value = doc as { source?: string; destination?: string } | undefined
      if (value?.source && value.source === value.destination) {
        return 'Source and destination must differ.'
      }
      return true
    }),
  preview: {
    select: { title: 'source', destination: 'destination' },
    prepare({ title, destination }) {
      return { title: `${title || '/'} -> ${destination || '?'}` }
    },
  },
})
