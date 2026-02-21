import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: false,
  },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      description: 'Recommended: 50-60 characters',
      type: 'string',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      description: 'Recommended: 140-160 characters',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      description: 'Used for social sharing cards',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      description: 'Discourage search engines from indexing this page',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
