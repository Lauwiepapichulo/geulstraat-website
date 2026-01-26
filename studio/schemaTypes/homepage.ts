import {defineField, defineType} from 'sanity'
import {DesktopIcon} from '@sanity/icons'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: DesktopIcon,
  fields: [
    // === BANNER ===
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
    defineField({
      name: 'enableSlideshow',
      title: 'Slideshow inschakelen',
      type: 'boolean',
      description: 'Schakel in om meerdere foto\'s als slideshow te tonen',
      initialValue: false,
    }),
    defineField({
      name: 'heroImage',
      title: 'Banner foto',
      type: 'image',
      description: 'De grote foto bovenaan de homepage (gebruikt als slideshow uit staat)',
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
      hidden: ({document}) => document?.enableSlideshow === true,
    }),
    defineField({
      name: 'heroSlides',
      title: 'Slideshow foto\'s',
      type: 'array',
      description: 'Voeg meerdere foto\'s toe voor de slideshow. Minimaal 2 foto\'s aanbevolen.',
      of: [
        {
          type: 'object',
          name: 'slide',
          title: 'Slide',
          fields: [
            defineField({
              name: 'image',
              title: 'Foto',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Beschrijving',
              type: 'string',
              description: 'Beschrijving van de foto voor toegankelijkheid',
            }),
          ],
          preview: {
            select: {
              media: 'image',
              alt: 'alt',
            },
            prepare({media, alt}) {
              return {
                title: alt || 'Slide',
                media,
              }
            },
          },
        },
      ],
      hidden: ({document}) => document?.enableSlideshow !== true,
      validation: Rule => Rule.custom((slides, context) => {
        if (context.document?.enableSlideshow && (!slides || slides.length < 2)) {
          return 'Voeg minimaal 2 foto\'s toe voor de slideshow'
        }
        return true
      }),
    }),
    defineField({
      name: 'slideshowInterval',
      title: 'Slideshow interval (seconden)',
      type: 'number',
      description: 'Hoe lang elke foto wordt getoond (standaard 5 seconden)',
      initialValue: 5,
      validation: Rule => Rule.min(2).max(20),
      hidden: ({document}) => document?.enableSlideshow !== true,
    }),
    defineField({
      name: 'slideshowTransition',
      title: 'Overgangseffect',
      type: 'string',
      description: 'Het type animatie tussen de foto\'s',
      options: {
        list: [
          {title: 'Fade (vervagen)', value: 'fade'},
          {title: 'Slide (schuiven)', value: 'slide'},
          {title: 'Zoom', value: 'zoom'},
        ],
        layout: 'radio',
      },
      initialValue: 'fade',
      hidden: ({document}) => document?.enableSlideshow !== true,
    }),

    // === OVER DE GEULSTRAAT SECTIE ===
    defineField({
      name: 'aboutSectionTitle',
      title: '📖 Over de Geulstraat - Titel',
      type: 'string',
      description: 'De titel van deze sectie op de homepage',
      initialValue: 'Over de Geulstraat',
    }),
    defineField({
      name: 'aboutSectionText',
      title: '📖 Over de Geulstraat - Tekst',
      type: 'text',
      rows: 4,
      description: 'De tekst die in dit blok wordt getoond',
      initialValue: 'De Geulstraat is een bruisende straat in de Rivierenbuurt met betrokken bewoners en een duidelijk eigen karakter.',
    }),
    defineField({
      name: 'aboutSectionButtonText',
      title: '📖 Over de Geulstraat - Knop tekst',
      type: 'string',
      description: 'De tekst op de knop',
      initialValue: 'Lees meer over de Geulstraat',
    }),

    // === NIEUWS SECTIE ===
    defineField({
      name: 'newsSectionTitle',
      title: '📰 Nieuws - Titel',
      type: 'string',
      description: 'De titel boven de nieuwsberichten',
      initialValue: 'Het laatste nieuws',
    }),
    defineField({
      name: 'newsSectionSubtitle',
      title: '📰 Nieuws - Ondertitel',
      type: 'string',
      description: 'De tekst onder de titel',
      initialValue: 'Blijf op de hoogte van wat er speelt in de Geulstraat',
    }),

    // === BUURT ACTIES SECTIE ===
    defineField({
      name: 'actiesSectionTitle',
      title: '🎉 Buurt acties - Titel',
      type: 'string',
      description: 'De titel boven de buurt acties',
      initialValue: 'Buurt acties',
    }),
    defineField({
      name: 'actiesSectionSubtitle',
      title: '🎉 Buurt acties - Ondertitel',
      type: 'string',
      description: 'De tekst onder de titel',
      initialValue: 'Doe mee aan activiteiten in de buurt',
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle',
      media: 'heroImage',
      slideMedia: 'heroSlides.0.image',
      enableSlideshow: 'enableSlideshow',
    },
    prepare({title, media, slideMedia, enableSlideshow}) {
      return {
        title: 'Homepage',
        subtitle: enableSlideshow 
          ? `Slideshow - ${title || 'Configureer de banner'}` 
          : title || 'Configureer de homepage banner',
        media: enableSlideshow ? slideMedia : media,
      }
    },
  },
})
