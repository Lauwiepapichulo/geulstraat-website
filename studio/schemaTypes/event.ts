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
      description: 'Wordt automatisch gegenereerd op basis van de naam.',
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
      validation: (Rule) => Rule.required().error('Webadres is verplicht'),
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
      name: 'acceptsRegistrations',
      title: 'Inschrijving via website',
      type: 'boolean',
      description: 'Schakel in om mensen zich te laten inschrijven via de website',
      initialValue: true,
    }),
    defineField({
      name: 'signupLink',
      title: 'Externe inschrijflink (optioneel)',
      type: 'url',
      description: 'Alleen invullen als je een EXTERNE link wilt gebruiken (bijv. Tally). Als je dit leeg laat, wordt het ingebouwde formulier gebruikt.',
      hidden: ({parent}) => !parent?.acceptsRegistrations,
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
      hidden: ({parent}) => !parent?.acceptsRegistrations,
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
