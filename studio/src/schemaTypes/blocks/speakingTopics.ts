import { MicrophoneIcon } from '@sanity/icons/Microphone'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const speakingTopicsBlock = defineType({
  name: 'speakingTopicsBlock',
  title: 'Speaking topics',
  type: 'object',
  icon: MicrophoneIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 2 }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'speakingTopic' }] })],
    }),
    defineField({
      name: 'displayMode',
      title: 'Display mode',
      type: 'string',
      options: {
        list: [
          { title: 'Preview', value: 'preview' },
          { title: 'Detailed', value: 'detailed' },
        ],
        layout: 'radio',
      },
      initialValue: 'preview',
    }),
  ],
  preview: {
    select: { title: 'heading', mode: 'displayMode' },
    prepare({ title, mode }) {
      return { title: title || 'Speaking topics', subtitle: mode, media: MicrophoneIcon }
    },
  },
})
