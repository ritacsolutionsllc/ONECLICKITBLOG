import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'trendItem',
  title: 'Trend Item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'momentum',
      title: 'Momentum',
      type: 'string',
      options: {
        list: [
          { title: 'Rising', value: 'rising' },
          { title: 'Stable', value: 'stable' },
          { title: 'Declining', value: 'declining' },
        ],
      },
      initialValue: 'stable',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'score',
      title: 'Score',
      type: 'number',
      description: 'Automated relevance score (0–100) based on mention frequency and recency.',
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'original_post' }, { type: 'buyer_guide' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'momentum',
    },
  },
})
