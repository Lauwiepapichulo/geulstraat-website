import {defineField, defineType} from 'sanity'
import {DesktopIcon} from '@sanity/icons'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: DesktopIcon,
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Banner foto',
      type: 'image',
      description: 'De grote foto bovenaan de homepage',
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
      name: 'heroTitle',
      title: 'Banner titel',
      type: 'string',
      description: 'De grote tekst op de banner',
      initialValue: 'Bij ons in de Geulstraat',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Banner ondertitel',
      type: 'text',
      rows: 2,
      description: 'De kleinere tekst onder de titel',
      initialValue: 'De fijnste straat van Amsterdam',
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle',
      media: 'heroImage',
    },
    prepare({title, media}) {
      return {
        title: 'Homepage',
        subtitle: title || 'Configureer de homepage banner',
        media,
      }
    },
  },
})
