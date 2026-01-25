import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export default defineType({
  name: 'post',
  title: 'Nieuwsbericht',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      description: 'De titel van het nieuwsbericht (bijvoorbeeld: "Buurtfeest op het plein")',
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
      name: 'publishedAt',
      title: 'Publicatiedatum',
      type: 'datetime',
      description: 'Wanneer moet dit bericht online verschijnen?',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Hoofdfoto',
      type: 'image',
      description: 'De foto die bij het bericht hoort. Klik op de foto om het belangrijkste deel aan te wijzen (bijvoorbeeld een gezicht).',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Beschrijving van de foto',
          description: 'Kort beschrijven wat er op de foto te zien is. Dit helpt mensen met een visuele beperking.',
        },
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Korte samenvatting',
      type: 'text',
      rows: 3,
      description: 'Een korte tekst die op de voorpagina verschijnt (maximaal 2-3 zinnen)',
      validation: (Rule) => Rule.max(200).warning('Probeer het kort te houden (maximaal 200 tekens)'),
    }),
    defineField({
      name: 'body',
      title: 'Inhoud',
      type: 'array',
      description: 'De volledige tekst van het nieuwsbericht',
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
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      date: 'publishedAt',
    },
    prepare(selection) {
      const {title, media, date} = selection
      const dateStr = date ? new Date(date).toLocaleDateString('nl-NL') : 'Geen datum'
      return {
        title,
        subtitle: dateStr,
        media,
      }
    },
  },
})
