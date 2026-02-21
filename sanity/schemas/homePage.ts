import { defineType, defineField, defineArrayMember } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'slider',
      title: 'Hero Slider',
      description: 'Full-screen hero images shown on the homepage',
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
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtitle',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'image',
              title: 'Background Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'buttonText',
              title: 'Button Text',
              type: 'string',
            }),
            defineField({
              name: 'link',
              title: 'Button Link',
              type: 'string',
              description: 'Use /path for internal links or a full URL for external links',
              initialValue: '/portfolio',
              validation: (Rule) =>
                Rule.custom((value) => {
                  const url = typeof value === 'string' ? value.trim() : ''
                  if (!url) return true
                  if (
                    url.startsWith('/') ||
                    url.startsWith('#') ||
                    /^(https?:)?\/\//i.test(url) ||
                    /^(mailto:|tel:|sms:|ftp:)/i.test(url)
                  ) {
                    return true
                  }
                  return 'Use /path for internal links or a full/protocol URL'
                }),
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'subtitle', media: 'image' },
          },
        }),
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
    defineField({
      name: 'quote',
      title: 'Quote / Tagline',
      description: 'Displayed below the hero slider on the homepage',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA Section Title',
      type: 'string',
      initialValue: 'Ready to capture your story?',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: 'CTA Section Subtitle',
      type: 'string',
      initialValue: "Let's create something beautiful",
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page', subtitle: 'Hero slider, quote & CTA' }
    },
  },
})
