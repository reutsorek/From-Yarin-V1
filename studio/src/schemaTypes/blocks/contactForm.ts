import { EnvelopeIcon } from '@sanity/icons/Envelope'
import { defineField, defineType } from 'sanity'
import { INQUIRY_TYPES } from '../documents/expeditionProduct'

export const contactFormBlock = defineType({
  name: 'contactFormBlock',
  title: 'Contact form',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
    defineField({
      name: 'successMessage',
      title: 'Success message',
      type: 'string',
      description: 'Shown after the form is submitted.',
    }),
    defineField({ name: 'submitLabel', title: 'Submit button label', type: 'string' }),
    defineField({
      name: 'interestTypeOptions',
      title: 'Interest type options',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: [...INQUIRY_TYPES] },
      description: 'Which "I am interested in" options to show. Defaults to all when empty.',
    }),
    defineField({
      name: 'privacyNote',
      title: 'Privacy note',
      type: 'text',
      rows: 3,
      description: 'Shown beneath the form, explaining how submissions are handled.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Contact form', subtitle: 'Contact form', media: EnvelopeIcon }
    },
  },
})
