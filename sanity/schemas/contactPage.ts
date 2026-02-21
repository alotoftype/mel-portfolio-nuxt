import { defineType, defineField, defineArrayMember } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Heading',
      type: 'string',
      initialValue: 'Contact us for any further questions, possible projects & business partnerships',
    }),
    defineField({
      name: 'formTitle',
      title: 'Form Section Title',
      type: 'string',
      initialValue: 'Get In Touch',
    }),
    defineField({
      name: 'formEndpoint',
      title: 'Form Submission URL',
      description: 'URL where form data is POSTed (e.g. getform.io endpoint)',
      type: 'url',
    }),
    defineField({
      name: 'responseTemplates',
      title: 'Submission Success Templates',
      description: 'Messages shown after a successful submission for each subject type',
      type: 'object',
      fields: [
        defineField({
          name: 'bookSession',
          title: 'Book a Session',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              initialValue: 'Session Request Received',
            }),
            defineField({
              name: 'message',
              title: 'Message',
              type: 'text',
              rows: 3,
              initialValue:
                'Thanks for reaching out about booking a session. We received your request and will follow up shortly.',
            }),
          ],
        }),
        defineField({
          name: 'generalInquiry',
          title: 'General Inquiry',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              initialValue: 'Inquiry Received',
            }),
            defineField({
              name: 'message',
              title: 'Message',
              type: 'text',
              rows: 3,
              initialValue:
                'Thank you for your message. We received your inquiry and will get back to you soon.',
            }),
          ],
        }),
        defineField({
          name: 'custom',
          title: 'User Input Subject',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              initialValue: 'Message Received',
            }),
            defineField({
              name: 'message',
              title: 'Message',
              type: 'text',
              rows: 3,
              initialValue:
                'Thanks for contacting us. Your message was sent successfully and we will respond as soon as possible.',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'contactItems',
      title: 'Contact Info Cards',
      type: 'array',
      options: {
        insertMenu: {
          views: [{ name: 'list' }, { name: 'grid' }],
        },
      },
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Card Title', type: 'string' }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon name (mail, pin, briefcase)',
              options: {
                list: [
                  { title: 'Mail', value: 'mail' },
                  { title: 'Location Pin', value: 'pin' },
                  { title: 'Briefcase', value: 'briefcase' },
                  { title: 'Phone', value: 'phone' },
                ],
              },
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{ type: 'block' }],
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'icon' },
          },
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Contact Page', subtitle: 'Contact info & form settings' }
    },
  },
})
