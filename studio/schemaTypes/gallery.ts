import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export default defineType({
  name: 'gallery',
  title: 'Fotoalbum',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Naam van het album',
      type: 'string',
      description: 'Bijvoorbeeld: "Buurtbarbecue zomer 2025"',
      validation: (Rule) => Rule.required().error('Een naam is verplicht'),
    }),
    defineField({
      name: 'slug',
      title: 'Webadres',
      type: 'slug',
      hidden: true, // Verborgen voor admin - wordt automatisch gegenereerd
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .slice(0, 96),
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
    }),
    defineField({
      name: 'date',
      title: 'Datum',
      type: 'date',
      description: 'Wanneer zijn deze foto\'s gemaakt?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Omslagfoto',
      type: 'image',
      description: 'De foto die als voorvertoning van het album dient. Klik op de foto om te croppen.',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error('Een omslagfoto is verplicht'),
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Beschrijving van de foto',
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Beschrijving',
      type: 'text',
      rows: 3,
      description: 'Korte beschrijving van wat er te zien is in dit album (optioneel)',
    }),
    // Direct image array - supports bulk upload with drag & drop and shift+select!
    defineField({
      name: 'images',
      title: 'Foto\'s',
      type: 'array',
      description: '📸 Sleep meerdere foto\'s tegelijk hierheen, of gebruik Shift+klik om meerdere bestanden te selecteren. Klik op een foto om te bewerken.',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            metadata: ['blurhash', 'lqip', 'palette', 'exif', 'location'],
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Beschrijving',
              description: 'Kort beschrijven wat er op de foto te zien is (voor toegankelijkheid)',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Bijschrift',
              description: 'Tekst die onder de foto wordt getoond (optioneel)',
            }),
            // Image adjustments - these work with direct image type!
            defineField({
              name: 'brightness',
              title: 'Helderheid',
              type: 'number',
              description: '100 = normaal. Lager = donkerder, hoger = lichter',
              initialValue: 100,
              validation: (Rule) => Rule.min(0).max(200),
            }),
            defineField({
              name: 'contrast',
              title: 'Contrast',
              type: 'number',
              description: '100 = normaal',
              initialValue: 100,
              validation: (Rule) => Rule.min(0).max(200),
            }),
            defineField({
              name: 'saturation',
              title: 'Verzadiging',
              type: 'number',
              description: '100 = normaal. 0 = zwart-wit',
              initialValue: 100,
              validation: (Rule) => Rule.min(0).max(200),
            }),
            defineField({
              name: 'grayscale',
              title: 'Zwart-wit filter',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'sepia',
              title: 'Sepia filter (vintage)',
              type: 'boolean',
              initialValue: false,
            }),
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
      validation: (Rule) => Rule.min(1).error('Voeg minimaal één foto toe'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'coverImage',
      imageCount: 'images.length',
    },
    prepare(selection) {
      const {title, date, media, imageCount} = selection
      const dateStr = date ? new Date(date).toLocaleDateString('nl-NL') : 'Geen datum'
      const imageText = imageCount ? `${imageCount} foto${imageCount !== 1 ? '\'s' : ''}` : 'Geen foto\'s'
      return {
        title,
        subtitle: `${dateStr} · ${imageText}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Datum (nieuwste eerst)',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Datum (oudste eerst)',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
})
