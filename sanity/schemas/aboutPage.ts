import { defineType, defineField, defineArrayMember } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Say Hello From Melshotya!',
    }),
    defineField({
      name: 'excerpt',
      title: 'About Text',
      description: 'Main introductory paragraph about the studio',
      type: 'text',
      rows: 5,
    }),

    // Services
    defineField({
      name: 'servicesTitle',
      title: 'Services Section Title',
      type: 'string',
      initialValue: 'Our Services',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    // Team
    defineField({
      name: 'teamTitle',
      title: 'Team Section Title',
      type: 'string',
      initialValue: 'Meet Our Team',
    }),
    defineField({
      name: 'team',
      title: 'Team Members',
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
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'role', title: 'Role / Title', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'role', media: 'image' },
          },
        }),
      ],
    }),

    // Testimonial
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'object',
      fields: [
        defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4 }),
        defineField({ name: 'author', title: 'Author Name', type: 'string' }),
        defineField({ name: 'role', title: 'Author Role / Company', type: 'string' }),
      ],
    }),

    // Awards
    defineField({
      name: 'awardsTitle',
      title: 'Awards Section Title',
      type: 'string',
      initialValue: 'Awards Achieved',
    }),
    defineField({
      name: 'awards',
      title: 'Awards',
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
            defineField({ name: 'title', title: 'Award Title', type: 'string' }),
            defineField({ name: 'platform', title: 'Platform / Org', type: 'string' }),
            defineField({ name: 'year', title: 'Year', type: 'string' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'platform' },
          },
        }),
      ],
    }),

    // Clients
    defineField({
      name: 'clientsTitle',
      title: 'Clients Section Title',
      type: 'string',
      initialValue: 'Our Clients',
    }),
    defineField({
      name: 'clientsExcerpt',
      title: 'Clients Description',
      type: 'string',
    }),
    defineField({
      name: 'clients',
      title: 'Client Logos',
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
            defineField({ name: 'name', title: 'Client Name', type: 'string' }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
            }),
          ],
          preview: {
            select: { title: 'name', media: 'logo' },
          },
        }),
      ],
    }),

    // Gallery
    defineField({
      name: 'gallery',
      title: 'About Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'About Page', subtitle: 'Team, services, awards & clients' }
    },
  },
})
