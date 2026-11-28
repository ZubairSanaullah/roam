import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

const API_VERSION = '2026-02-01'

export const policyType = defineType({
  name: 'policy',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return 'Slug is required'
          const client = context.getClient({apiVersion: API_VERSION})
          const id = context.document?._id?.replace(/^drafts\./, '')
          const existing = await client.fetch<number>(
            `count(*[_type == "policy" && slug.current == $slug && _id != $id && !(_id in path("drafts.**"))])`,
            {slug: slug.current, id},
          )
          return existing === 0 || 'Slug already exists'
        }),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          {title: 'Cancellation', value: 'cancellation'},
          {title: 'Pets', value: 'pets'},
          {title: 'Check-in & Access', value: 'check_in'},
          {title: 'House Rules', value: 'house_rules'},
          {title: 'Safety & Parking', value: 'safety_parking'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'string',
      description: 'Concise 1 to 2 sentence summary displayed on Stay Details policy cards.',
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'exactText',
      type: 'text',
      rows: 6,
      description:
        'Canonical word-for-word policy text shown in Stay Details and policy answers.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
  },
})
