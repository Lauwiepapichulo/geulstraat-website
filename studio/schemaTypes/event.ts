import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export default defineType({
  name: 'buurtActie',
  title: 'Buurt acties',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Naam van de buurtactie',
      type: 'string',
      description: 'Bijvoorbeeld: "Buurtschoonmaak" of "Straatfeest Geulstraat"',
      validation: (Rule) => Rule.required().error('Een naam is verplicht'),
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
      name: 'datetime',
      title: 'Datum en tijd',
      type: 'datetime',
      description: 'Wanneer vindt de buurtactie plaats?',
      validation: (Rule) => Rule.required().error('Datum en tijd zijn verplicht'),
    }),
    defineField({
      name: 'location',
      title: 'Locatie',
      type: 'string',
      description: 'Waar vindt het plaats?',
      initialValue: 'Buurthuis',
    }),
    defineField({
      name: 'description',
      title: 'Beschrijving',
      type: 'text',
      rows: 4,
      description: 'Wat kunnen bezoekers verwachten? Wat moeten ze meenemen?',
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      description: 'Een sfeervolle foto bij de buurtactie',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error('Een foto is verplicht voor de preview op de homepage'),
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Beschrijving van de foto',
        },
      ],
    }),
    defineField({
      name: 'signupLink',
      title: 'Link naar inschrijfformulier',
      type: 'url',
      description: 'Plak hier de link die je van Tally krijgt als mensen zich kunnen inschrijven. Laat leeg als inschrijven niet nodig is.',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'maxParticipants',
      title: 'Maximum aantal deelnemers',
      type: 'number',
      description: 'Laat leeg als er geen maximum is',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      datetime: 'datetime',
      media: 'image',
      location: 'location',
    },
    prepare(selection) {
      const {title, datetime, media, location} = selection
      const dateStr = datetime
        ? new Date(datetime).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Geen datum'
      return {
        title,
        subtitle: `${dateStr} - ${location || 'Geen locatie'}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Datum (nieuwste eerst)',
      name: 'datetimeDesc',
      by: [{field: 'datetime', direction: 'desc'}],
    },
    {
      title: 'Datum (oudste eerst)',
      name: 'datetimeAsc',
      by: [{field: 'datetime', direction: 'asc'}],
    },
  ],
})
