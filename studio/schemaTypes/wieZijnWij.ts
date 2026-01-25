import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export default defineType({
  name: 'wieZijnWij',
  title: 'Wie zijn wij',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      initialValue: 'Wie zijn wij',
    }),
    defineField({
      name: 'content',
      title: 'Tekst',
      type: 'array',
      description: 'De hoofdtekst van de pagina',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normaal', value: 'normal'},
            {title: 'Kop', value: 'h2'},
            {title: 'Subkop', value: 'h3'},
          ],
          marks: {
            decorators: [
              {title: 'Vetgedrukt', value: 'strong'},
              {title: 'Cursief', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                ],
              },
            ],
          },
          lists: [
            {title: 'Opsomming', value: 'bullet'},
            {title: 'Genummerd', value: 'number'},
          ],
        },
      ],
    }),
    defineField({
      name: 'photos',
      title: "Foto's",
      type: 'array',
      description: "Foto's van het team of activiteiten",
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Beschrijving',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Bijschrift (optioneel)',
            },
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title || 'Wie zijn wij',
        subtitle: 'Over ons team',
      }
    },
  },
})
