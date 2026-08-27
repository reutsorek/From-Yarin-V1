import { UsersIcon } from '@sanity/icons/Users'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const audiencePathsBlock = defineType({
  name: 'audiencePathsBlock',
  title: 'Audience paths',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 2 }),
    defineField({
      name: 'paths',
      title: 'Audience paths',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'audiencePath' }] })],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Audience paths', subtitle: 'Audience paths', media: UsersIcon }
    },
  },
})
