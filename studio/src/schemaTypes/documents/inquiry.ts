import { InboxIcon } from '@sanity/icons/Inbox'
import { defineField, defineType } from 'sanity'
import { INQUIRY_TYPES } from './expeditionProduct'

/**
 * Written only by the server-side contact API route, after Turnstile verification. Never
 * selected by any public GROQ query, so the live site has no read path to this data. Actual
 * document-level privacy depends on the dataset's own visibility/token configuration.
 */
export const inquiry = defineType({
  name: 'inquiry',
  title: 'Inquiry',
  type: 'document',
  icon: InboxIcon,
  fields: [
    defineField({ name: 'fullName', title: 'Full name', type: 'string', readOnly: true }),
    defineField({ name: 'organization', title: 'Organization', type: 'string', readOnly: true }),
    defineField({ name: 'roleTitle', title: 'Role / title', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', readOnly: true }),
    defineField({
      name: 'countryRegion',
      title: 'Country / region',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'interestType',
      title: 'Interested in',
      type: 'string',
      readOnly: true,
      options: { list: [...INQUIRY_TYPES] },
    }),
    defineField({
      name: 'preferredTiming',
      title: 'Preferred timing',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'budgetRange',
      title: 'Estimated scope / budget',
      type: 'string',
      readOnly: true,
    }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 5, readOnly: true }),
    defineField({
      name: 'privacyConsent',
      title: 'Privacy consent given',
      type: 'boolean',
      readOnly: true,
    }),
    defineField({
      name: 'captchaVerified',
      title: 'CAPTCHA verified',
      type: 'boolean',
      readOnly: true,
    }),
    defineField({ name: 'createdAt', title: 'Received at', type: 'datetime', readOnly: true }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Closed', value: 'closed' },
        ],
      },
      initialValue: 'new',
    }),
    defineField({ name: 'internalNotes', title: 'Internal notes', type: 'text', rows: 4 }),
  ],
  preview: {
    select: { title: 'fullName', subtitle: 'interestType', status: 'status' },
    prepare({ title, subtitle, status }) {
      return { title: title || 'Inquiry', subtitle: [subtitle, status].filter(Boolean).join(' · ') }
    },
  },
})
