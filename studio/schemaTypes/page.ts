import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export default defineType({
  name: 'page',
  title: 'Vaste pagina',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Paginatitel',
      type: 'string',
      description: 'Bijvoorbeeld: "Geschiedenis van de buurt"',
      validation: (Rule) => Rule.required().error('Een titel is verplicht'),
    }),
    defineField({
      name: 'slug',
      title: 'Webadres',
      type: 'slug',
      description: 'Klik op "Generate" om automatisch een webadres te maken.',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (Rule) => Rule.required().error('Klik op "Generate" om een webadres te maken'),
    }),
    defineField({
      name: 'content',
      title: 'Inhoud',
      type: 'array',
      description: 'De tekst en afbeeldingen van de pagina',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normaal', value: 'normal'},
            {title: 'Kop groot', value: 'h2'},
            {title: 'Kop middel', value: 'h3'},
            {title: 'Citaat', value: 'blockquote'},
          ],
          lists: [
            {title: 'Opsomming', value: 'bullet'},
            {title: 'Genummerd', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Vetgedrukt', value: 'strong'},
              {title: 'Cursief', value: 'em'},
            ],
          },
        },
        {
          type: 'image',
          title: 'Afbeelding',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Beschrijving van de foto',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Bijschrift',
              description: 'Tekst onder de afbeelding (optioneel)',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'showInNavigation',
      title: 'Toon in navigatiemenu',
      type: 'boolean',
      description: 'Wil je dat deze pagina in het menu bovenaan verschijnt?',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
