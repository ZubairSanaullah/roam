import {defineArrayMember, defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

const API_VERSION = '2026-02-01'

export const hostType = defineType({
  name: 'host',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return 'Slug is required'
          const client = context.getClient({apiVersion: API_VERSION})
          const id = context.document?._id?.replace(/^drafts\./, '')
          const existing = await client.fetch<number>(
            `count(*[_type == "host" && slug.current == $slug && _id != $id && !(_id in path("drafts.**"))])`,
            {slug: slug.current, id},
          )
          return existing === 0 || 'Slug already exists'
        }),
    }),
    defineField({
      name: 'avatar',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'bio',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'isSuperhost',
      title: 'Superhost',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'responseTime',
      type: 'string',
      initialValue: 'within an hour',
      options: {
        list: [
          {title: 'Within an hour', value: 'within an hour'},
          {title: 'Within a few hours', value: 'within a few hours'},
          {title: 'Within a day', value: 'within a day'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'languages',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'memberSince',
      type: 'number',
      validation: (rule) => rule.integer().min(2010).max(2030),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      isSuperhost: 'isSuperhost',
      media: 'avatar',
    },
    prepare({title, isSuperhost, media}) {
      return {
        title,
        subtitle: isSuperhost ? 'Superhost' : 'Host',
        media,
      }
    },
  },
})
