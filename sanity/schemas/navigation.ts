import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Navigation Area Title',
      type: 'string',
      description: 'Internal reference name',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      options: {
        list: [
          { title: 'Top Corner (Slide-out Menu)', value: 'topCorner' },
          { title: 'Right Side (Single Menu)', value: 'rightSide' },
          { title: 'Bottom Left (Horizontal Menu)', value: 'bottomLeft' },
          { title: 'Bottom Right (Social)', value: 'bottomRight' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Navigation Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'string',
              description: 'Internal links start with / (e.g., /about), external links include https://',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'icon',
              title: 'Icon Name (for social)',
              type: 'string',
              description: 'For social links: facebook, instagram, twitter, linkedin, youtube, etc.',
              hidden: ({ document }) => document?.location !== 'bottomRight',
            },
            {
              name: 'openInNewTab',
              title: 'Open in New Tab',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.custom((items, context) => {
          const location = (context.document as any)?.location
          if (location === 'bottomLeft' && items && items.length > 5) {
            return 'Bottom Left menu cannot have more than 5 links'
          }
          if (location === 'rightSide' && items && items.length > 1) {
            return 'Right Side can only have 1 menu option'
          }
          return true
        }),
    }),
    defineField({
      name: 'showFullSocialNames',
      title: 'Show Full Social Names',
      type: 'boolean',
      description: 'If disabled, only icons will be shown',
      initialValue: false,
      hidden: ({ document }) => document?.location !== 'bottomRight',
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      location: 'location',
      enabled: 'enabled',
    },
    prepare({ title, location, enabled }) {
      const locationLabels = {
        topCorner: 'Top Corner',
        rightSide: 'Right Side',
        bottomLeft: 'Bottom Left',
        bottomRight: 'Social',
      }
      return {
        title: title || locationLabels[location as keyof typeof locationLabels],
        subtitle: `${locationLabels[location as keyof typeof locationLabels]}${enabled ? '' : ' (Disabled)'}`,
      }
    },
  },
})
