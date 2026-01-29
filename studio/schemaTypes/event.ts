import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {ActionsField} from '../components/ActionsField'
import {BackButton} from '../components/BackButton'
import {BannerPreview} from '../components/BannerPreview'

export default defineType({
  name: 'buurtActie',
  title: 'Buurt acties',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'backButton',
      title: ' ',
      type: 'string',
      readOnly: true,
      components: {
        input: BackButton,
      },
    }),
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
      name: 'isArchived',
      title: '📦 Gearchiveerd',
      type: 'boolean',
      hidden: true, // Verborgen - gebruik de "Archiveren" knop in het menu
      initialValue: false,
    }),
    defineField({
      name: 'datumTBD',
      title: 'Datum nog niet bekend',
      type: 'boolean',
      description: 'Vink aan als de datum nog niet bekend is (TBD)',
      initialValue: false,
    }),
    defineField({
      name: 'datetime',
      title: 'Datum en tijd',
      type: 'datetime',
      description: 'Wanneer vindt de buurtactie plaats?',
      hidden: ({parent}) => parent?.datumTBD === true,
      validation: (Rule) => Rule.custom((value, context) => {
        const parent = context.parent as any
        if (parent?.datumTBD) return true // Geen datum nodig als TBD
        if (!value) return 'Datum en tijd zijn verplicht (of vink "Datum nog niet bekend" aan)'
        return true
      }),
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
      components: {
        input: BannerPreview,
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
      title: 'Inschrijf knop toevoegen',
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
    defineField({
      name: 'signupButtonText',
      title: 'Tekst op inschrijfknop',
      type: 'string',
      description: 'Standaard: "Ik doe mee"',
      placeholder: 'Ik doe mee',
      hidden: ({parent}) => !parent?.acceptsRegistrations,
    }),
    // Custom actions toolbar - onderaan het document
    defineField({
      name: 'actionsToolbar',
      title: ' ',
      type: 'string',
      readOnly: true,
      components: {
        input: ActionsField,
      },
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
