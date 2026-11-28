import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

const API_VERSION = '2026-02-01'

export const STAY_CATEGORIES = [
  {title: 'Cabins', value: 'cabins'},
  {title: 'Beach', value: 'beach'},
  {title: 'City', value: 'city'},
  {title: 'Villas', value: 'villas'},
] as const

export const STAY_AMENITIES = [
  {title: 'Hot Tub', value: 'hot-tub'},
  {title: 'Dedicated Workspace', value: 'dedicated-workspace'},
  {title: 'Free Parking', value: 'free-parking'},
  {title: 'Fast Wi-Fi', value: 'fast-wifi'},
  {title: 'Fireplace', value: 'fireplace'},
  {title: 'Firepit', value: 'firepit'},
  {title: 'Wood Stove', value: 'wood-stove'},
  {title: 'Pool', value: 'pool'},
  {title: 'Infinity Pool', value: 'infinity-pool'},
  {title: 'Beachfront', value: 'beachfront'},
  {title: 'Chef Kitchen', value: 'chef-kitchen'},
  {title: 'Forest Trail', value: 'forest-trail'},
  {title: 'City Skyline', value: 'city-skyline'},
  {title: 'EV Charger', value: 'ev-charger'},
  {title: 'Patio or Deck', value: 'patio-deck'},
] as const

export const stayType = defineType({
  name: 'stay',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'overview', title: 'Overview', default: true},
    {name: 'media', title: 'Media'},
    {name: 'specs', title: 'Pricing & Specs'},
    {name: 'embeddings', title: 'Embeddings Copy'},
    {name: 'relationships', title: 'Host & Policies'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'overview',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'overview',
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
            `count(*[_type == "stay" && slug.current == $slug && _id != $id && !(_id in path("drafts.**"))])`,
            {slug: slug.current, id},
          )
          return existing === 0 || 'Slug already exists'
        }),
    }),
    defineField({
      name: 'category',
      type: 'string',
      group: 'overview',
      options: {
        list: [...STAY_CATEGORIES],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      type: 'object',
      group: 'overview',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'display',
          type: 'string',
          description: 'Formatted city and region label, e.g. "Lake Arrowhead, CA".',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'city',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'region',
          title: 'State or Province',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'country',
          type: 'string',
          initialValue: 'United States',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'images',
      type: 'array',
      group: 'media',
      description:
        'First image appears on Home and Search cards; all images render in the Stay Details gallery.',
      of: [
        defineArrayMember({
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
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'pricePerNight',
      title: 'Price per Night (USD)',
      type: 'number',
      group: 'specs',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'maxGuests',
      type: 'number',
      group: 'specs',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'bedrooms',
      type: 'number',
      group: 'specs',
      description: 'Use 0 for studio layouts.',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'beds',
      type: 'number',
      group: 'specs',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'bathrooms',
      type: 'number',
      group: 'specs',
      validation: (rule) => rule.required().min(0.5),
    }),
    defineField({
      name: 'petFriendly',
      type: 'boolean',
      group: 'specs',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'amenities',
      type: 'array',
      group: 'specs',
      of: [defineArrayMember({type: 'string'})],
      options: {
        list: [...STAY_AMENITIES],
      },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'sleepingArrangements',
      type: 'array',
      group: 'specs',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'sleepingRoom',
          fields: [
            defineField({
              name: 'roomName',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'bedDetails',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'roomName',
              subtitle: 'bedDetails',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'rating',
      type: 'number',
      group: 'specs',
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: 'reviewCount',
      type: 'number',
      group: 'specs',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'tagline',
      type: 'string',
      group: 'embeddings',
      description: 'Short one-sentence summary stored on the stay for embedding ranking.',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 5,
      group: 'embeddings',
      description:
        'Full descriptive prose stored directly on the stay document for Sanity Dataset Embeddings.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'neighborhoodOverview',
      type: 'text',
      rows: 3,
      group: 'embeddings',
      description:
        'Surrounding setting, quietness, and nearby trails, beaches, or transit for embedding ranking.',
    }),
    defineField({
      name: 'highlights',
      type: 'array',
      group: 'embeddings',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'checkInTime',
      type: 'string',
      group: 'relationships',
      initialValue: '3:00 PM',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'checkOutTime',
      type: 'string',
      group: 'relationships',
      initialValue: '11:00 AM',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'host',
      type: 'reference',
      group: 'relationships',
      to: [{type: 'host'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'policies',
      type: 'array',
      group: 'relationships',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'policy'}],
        }),
      ],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'staySpecificNotes',
      type: 'array',
      group: 'relationships',
      description:
        'Optional property-specific rule notes displayed word for word alongside shared policies.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stayNote',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'detail',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'detail',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location.display',
      media: 'images.0',
    },
  },
})
