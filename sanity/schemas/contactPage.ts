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
      name: 'contactItems',
      title: 'Contact Info Cards',
      type: 'array',
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
  ],
  preview: {
    prepare() {
      return { title: 'Contact Page', subtitle: 'Contact info & form settings' }
    },
  },
})
