import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export default defineType({
  name: 'siteSettings',
  title: 'Site Instellingen',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'Algemeen', default: true},
    {name: 'administrators', title: 'Beheerders'},
    {name: 'contact', title: 'Contact'},
  ],
  fields: [
    // ========== ALGEMEEN ==========
    defineField({
      name: 'title',
      title: 'Website naam',
      type: 'string',
      group: 'general',
      description: 'De naam in de navigatiebalk',
      initialValue: 'De Geulstraat',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'general',
      description: 'Een klein logo voor in de navigatiebalk (optioneel)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Beschrijving',
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Website beschrijving',
      type: 'text',
      rows: 3,
      group: 'general',
      description: 'Korte beschrijving voor zoekmachines (SEO)',
      initialValue: 'Het digitale platform voor de Geulstraat in de Rivierenbuurt.',
    }),

    // ========== BEHEERDERS ==========
    defineField({
      name: 'administrators',
      title: 'Beheerders',
      type: 'array',
      group: 'administrators',
      description: 'De beheerders van de website (worden getoond in de footer)',
      of: [
        {
          type: 'object',
          name: 'administrator',
          title: 'Beheerder',
          fields: [
            defineField({
              name: 'name',
              title: 'Naam',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'photo',
              title: 'Foto',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'address',
              title: 'Adres',
              type: 'string',
              description: 'Bijv. "Geulstraat 42"',
            }),
            defineField({
              name: 'email',
              title: 'E-mail (optioneel)',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'address',
              media: 'photo',
            },
          },
        },
      ],
    }),

    // ========== CONTACT ==========
    defineField({
      name: 'contactEmail',
      title: 'Contact e-mailadres',
      type: 'string',
      group: 'contact',
      description: 'Algemeen e-mailadres voor de contact pagina',
      initialValue: 'info@geulstraatamsterdam.nl',
      validation: (Rule) =>
        Rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
          name: 'email',
        }).error('Voer een geldig e-mailadres in'),
    }),
    defineField({
      name: 'formspreeEndpoint',
      title: 'Formspree Endpoint',
      type: 'url',
      group: 'contact',
      description: 'De Formspree endpoint URL (bijv. https://formspree.io/f/xxxxxxxx)',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['https'],
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: 'Site Instellingen',
        subtitle: title || 'Configureer website instellingen',
      }
    },
  },
})
