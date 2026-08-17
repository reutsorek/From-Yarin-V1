import { EnvelopeIcon } from '@sanity/icons/Envelope'
import { defineField, defineType } from 'sanity'

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
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Contact form', subtitle: 'Contact form', media: EnvelopeIcon }
    },
  },
})
