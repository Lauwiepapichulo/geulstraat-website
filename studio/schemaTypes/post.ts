import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'
import {ActionsField} from '../components/ActionsField'
import {BackButton} from '../components/BackButton'
import {BannerPreview} from '../components/BannerPreview'

export default defineType({
  name: 'post',
  title: 'Nieuwsbericht',
  type: 'document',
  icon: DocumentTextIcon,
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
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required().error('Een titel is verplicht'),
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
      name: 'publishedAt',
      title: 'Datum',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Banner foto (optioneel)',
      type: 'image',
      description: 'Verschijnt bovenaan het artikel als grote banner.',
      options: {
        hotspot: true,
      },
      components: {
        input: BannerPreview,
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
      name: 'body',
      title: 'Artikel inhoud',
      type: 'array',
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
                    validation: (Rule: any) => Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel'],
                    }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          title: 'Foto in artikel',
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
              title: 'Bijschrift',
            },
          ],
        },
      ],
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
