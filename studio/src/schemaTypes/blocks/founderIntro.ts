import { UserIcon } from '@sanity/icons/User'
import { defineField, defineType } from 'sanity'

export const founderIntroBlock = defineType({
  name: 'founderIntroBlock',
  title: 'Founder intro',
  type: 'object',
  icon: UserIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 2 }),
    defineField({
      name: 'founder',
      title: 'Founder profile',
      type: 'reference',
      to: [{ type: 'founderProfile' }],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Founder intro', subtitle: 'Founder intro', media: UserIcon }
    },
  },
})
