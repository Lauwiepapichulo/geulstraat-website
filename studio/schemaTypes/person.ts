import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export default defineType({
  name: 'person',
  title: 'Wie zijn wij',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Voor- en achternaam',
      type: 'string',
      description: 'Bijvoorbeeld: "Jan de Vries"',
      validation: (Rule) => Rule.required().error('Een naam is verplicht'),
    }),
    defineField({
      name: 'role',
      title: 'Functie',
      type: 'string',
      description: 'Bijvoorbeeld: "Voorzitter" of "Penningmeester"',
      validation: (Rule) => Rule.required().error('Een functie is verplicht'),
    }),
    defineField({
      name: 'portrait',
      title: 'Portretfoto',
      type: 'image',
      description: 'Een foto van de persoon (bij voorkeur een portret)',
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
    }),
    defineField({
      name: 'bio',
      title: 'Biografie',
      type: 'text',
      rows: 4,
      description: 'Vertel iets over jezelf. Wat doe je graag? Waarom ben je lid van het bestuur?',
    }),
    defineField({
      name: 'email',
      title: 'E-mailadres',
      type: 'string',
      description: 'E-mailadres voor contact (optioneel)',
      validation: (Rule) =>
        Rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
          name: 'email',
          invert: false,
        }).warning('Dit lijkt geen geldig e-mailadres'),
    }),
    defineField({
      name: 'phone',
      title: 'Telefoonnummer',
      type: 'string',
      description: 'Bijvoorbeeld: "06-12345678" (optioneel)',
    }),
    defineField({
      name: 'showPhone',
      title: 'Toon telefoonnummer op de website?',
      type: 'boolean',
      description: 'Zet dit aan als je wilt dat je telefoonnummer zichtbaar is voor bezoekers',
      initialValue: false,
    }),
    defineField({
      name: 'showInFooter',
      title: 'Toon in footer van de website?',
      type: 'boolean',
      description: 'Zet dit aan om deze persoon te tonen in de footer met contactinformatie',
      initialValue: false,
    }),
    defineField({
      name: 'address',
      title: 'Adres',
      type: 'string',
      description: 'Adres om te tonen in de footer (optioneel)',
    }),
    defineField({
      name: 'order',
      title: 'Volgorde',
      type: 'number',
      description: 'Bepaal de volgorde waarin personen worden getoond (lager nummer = eerder)',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'portrait',
    },
  },
  orderings: [
    {
      title: 'Volgorde',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}, {field: 'name', direction: 'asc'}],
    },
    {
      title: 'Naam',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
})
