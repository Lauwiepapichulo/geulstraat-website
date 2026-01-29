import {defineField, defineType} from 'sanity'
import {DocumentTextIcon, BlockElementIcon, ImageIcon, BlockquoteIcon, RocketIcon, ClockIcon, ThLargeIcon, ImagesIcon, TextIcon} from '@sanity/icons'
import {BannerPreview} from '../components/BannerPreview'
import {ColorPicker} from '../components/ColorPicker'

// Shared styling fields for all sections
const sharedStyleFields = [
  defineField({
    name: 'backgroundColor',
    title: 'Achtergrondkleur',
    type: 'string',
    initialValue: 'white',
    components: {
      input: ColorPicker,
    },
  }),
  defineField({
    name: 'textAlign',
    title: 'Tekst uitlijning',
    type: 'string',
    initialValue: 'left',
    options: {
      list: [
        {title: 'Links', value: 'left'},
        {title: 'Midden', value: 'center'},
        {title: 'Rechts', value: 'right'},
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
  }),
  defineField({
    name: 'padding',
    title: 'Sectie hoogte',
    type: 'string',
    initialValue: 'normal',
    options: {
      list: [
        {title: 'Compact', value: 'compact'},
        {title: 'Normaal', value: 'normal'},
        {title: 'Ruim', value: 'spacious'},
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
  }),
]

// Button field (reusable)
const buttonField = defineField({
  name: 'button',
  title: 'Knop (optioneel)',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: 'text',
      title: 'Knop tekst',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'Link URL',
      type: 'string',
      description: 'Bijv. /contact of https://example.com',
    }),
    defineField({
      name: 'style',
      title: 'Knop stijl',
      type: 'string',
      initialValue: 'primary',
      options: {
        list: [
          {title: 'Primair (groen)', value: 'primary'},
          {title: 'Secundair (wit)', value: 'secondary'},
          {title: 'Outline', value: 'outline'},
        ],
      },
    }),
  ],
})

// Rich text field (reusable)
const richTextField = (name: string, title: string, required: boolean = false) => defineField({
  name,
  title,
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        {title: 'Normaal', value: 'normal'},
        {title: 'Kop', value: 'h3'},
      ],
      marks: {
        decorators: [
          {title: 'Vetgedrukt', value: 'strong'},
          {title: 'Cursief', value: 'em'},
        ],
      },
      lists: [
        {title: 'Opsomming', value: 'bullet'},
        {title: 'Genummerd', value: 'number'},
      ],
    },
  ],
  validation: required ? (Rule) => Rule.required() : undefined,
})

export default defineType({
  name: 'overDeBuurt',
  title: 'Over de buurt',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Paginatitel',
      type: 'string',
      description: 'De titel van de "Over de buurt" pagina',
      initialValue: 'Over de buurt',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Secties',
      type: 'array',
      description: 'Bouw je pagina op met verschillende sectie types. Sleep om de volgorde te wijzigen.',
      of: [
        // ========== 1. HERO SECTION ==========
        {
          type: 'object',
          name: 'heroSection',
          title: 'Hero/Banner',
          icon: ImageIcon,
          fields: [
            defineField({
              name: 'title',
              title: 'Titel',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'subtitle',
              title: 'Ondertitel',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'backgroundImage',
              title: 'Achtergrond afbeelding',
              type: 'image',
              options: {hotspot: true},
              components: {
                input: BannerPreview,
              },
              validation: (Rule) => Rule.required(),
              fields: [
                {name: 'alt', type: 'string', title: 'Alt tekst'},
              ],
            }),
            defineField({
              name: 'overlay',
              title: 'Overlay',
              type: 'string',
              initialValue: 'dark',
              options: {
                list: [
                  {title: 'Donker (voor lichte tekst)', value: 'dark'},
                  {title: 'Licht (voor donkere tekst)', value: 'light'},
                  {title: 'Geen', value: 'none'},
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'height',
              title: 'Hoogte',
              type: 'string',
              initialValue: 'large',
              options: {
                list: [
                  {title: 'Medium', value: 'medium'},
                  {title: 'Groot', value: 'large'},
                  {title: 'Volledig scherm', value: 'full'},
                ],
              },
            }),
            buttonField,
          ],
          preview: {
            select: {title: 'title', media: 'backgroundImage'},
            prepare: ({title, media}) => ({
              title: title || 'Hero sectie',
              subtitle: '🖼️ Hero/Banner',
              media,
            }),
          },
        },

        // ========== 2. TEXT SECTION ==========
        {
          type: 'object',
          name: 'textSection',
          title: 'Tekst',
          icon: TextIcon,
          fields: [
            defineField({
              name: 'title',
              title: 'Titel (optioneel)',
              type: 'string',
            }),
            richTextField('content', 'Tekst', true),
            defineField({
              name: 'columns',
              title: 'Kolommen',
              type: 'number',
              initialValue: 1,
              options: {
                list: [
                  {title: '1 kolom', value: 1},
                  {title: '2 kolommen', value: 2},
                  {title: '3 kolommen', value: 3},
                ],
              },
            }),
            defineField({
              name: 'icon',
              title: 'Icoon (optioneel)',
              type: 'string',
              description: 'Emoji of tekst icoon boven de titel',
            }),
            ...sharedStyleFields,
            buttonField,
          ],
          preview: {
            select: {title: 'title', columns: 'columns'},
            prepare: ({title, columns}) => ({
              title: title || 'Tekst sectie',
              subtitle: `📝 Tekst (${columns || 1} kolom${columns > 1 ? 'men' : ''})`,
            }),
          },
        },

        // ========== 3. TEXT + PHOTO SECTION ==========
        {
          type: 'object',
          name: 'mediaSection',
          title: 'Tekst + Foto',
          icon: ImageIcon,
          fields: [
            defineField({
              name: 'title',
              title: 'Titel (optioneel)',
              type: 'string',
            }),
            richTextField('content', 'Tekst', true),
            defineField({
              name: 'image',
              title: 'Afbeelding',
              type: 'image',
              options: {hotspot: true},
              validation: (Rule) => Rule.required(),
              fields: [
                {name: 'alt', type: 'string', title: 'Alt tekst'},
              ],
            }),
            defineField({
              name: 'layout',
              title: 'Layout',
              type: 'string',
              initialValue: 'text-left',
              options: {
                list: [
                  {title: 'Tekst links, foto rechts', value: 'text-left'},
                  {title: 'Tekst rechts, foto links', value: 'text-right'},
                  {title: 'Foto boven, tekst onder', value: 'photo-top'},
                  {title: 'Tekst boven, foto onder', value: 'text-top'},
                  {title: 'Tekst over foto (overlay)', value: 'overlay'},
                ],
                layout: 'dropdown',
              },
            }),
            defineField({
              name: 'imageSize',
              title: 'Foto grootte',
              type: 'string',
              initialValue: 'medium',
              options: {
                list: [
                  {title: 'Klein (1/3)', value: 'small'},
                  {title: 'Medium (1/2)', value: 'medium'},
                  {title: 'Groot (2/3)', value: 'large'},
                ],
              },
              hidden: ({parent}) => parent?.layout === 'overlay' || parent?.layout === 'photo-top' || parent?.layout === 'text-top',
            }),
            ...sharedStyleFields,
            buttonField,
          ],
          preview: {
            select: {title: 'title', media: 'image', layout: 'layout'},
            prepare: ({title, media, layout}) => {
              const layoutLabels: Record<string, string> = {
                'text-left': '← Tekst | Foto →',
                'text-right': '← Foto | Tekst →',
                'photo-top': '↑ Foto ↓ Tekst',
                'text-top': '↑ Tekst ↓ Foto',
                'overlay': '📷 Overlay',
              }
              return {
                title: title || 'Tekst + Foto',
                subtitle: `🖼️ ${layoutLabels[layout] || 'Tekst + Foto'}`,
                media,
              }
            },
          },
        },

        // ========== 4. GALLERY SECTION ==========
        {
          type: 'object',
          name: 'gallerySection',
          title: 'Foto Galerij',
          icon: ImagesIcon,
          fields: [
            defineField({
              name: 'title',
              title: 'Titel (optioneel)',
              type: 'string',
            }),
            defineField({
              name: 'images',
              title: 'Foto\'s',
              type: 'array',
              of: [
                {
                  type: 'image',
                  options: {hotspot: true},
                  fields: [
                    {name: 'alt', type: 'string', title: 'Alt tekst'},
                    {name: 'caption', type: 'string', title: 'Bijschrift'},
                  ],
                },
              ],
              options: {layout: 'grid'},
              validation: (Rule) => Rule.min(2).max(6),
            }),
            defineField({
              name: 'columns',
              title: 'Kolommen',
              type: 'number',
              initialValue: 3,
              options: {
                list: [
                  {title: '2 kolommen', value: 2},
                  {title: '3 kolommen', value: 3},
                  {title: '4 kolommen', value: 4},
                ],
              },
            }),
            defineField({
              name: 'showCaptions',
              title: 'Toon bijschriften',
              type: 'boolean',
              initialValue: false,
            }),
            ...sharedStyleFields,
          ],
          preview: {
            select: {title: 'title', images: 'images'},
            prepare: ({title, images}) => ({
              title: title || 'Foto galerij',
              subtitle: `📸 Galerij (${images?.length || 0} foto's)`,
            }),
          },
        },

        // ========== 5. QUOTE SECTION ==========
        {
          type: 'object',
          name: 'quoteSection',
          title: 'Citaat',
          icon: BlockquoteIcon,
          fields: [
            defineField({
              name: 'quote',
              title: 'Citaat',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'author',
              title: 'Auteur/Bron (optioneel)',
              type: 'string',
            }),
            defineField({
              name: 'authorRole',
              title: 'Functie/Rol (optioneel)',
              type: 'string',
            }),
            defineField({
              name: 'image',
              title: 'Foto auteur (optioneel)',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'style',
              title: 'Stijl',
              type: 'string',
              initialValue: 'simple',
              options: {
                list: [
                  {title: 'Simpel', value: 'simple'},
                  {title: 'Met grote aanhalingstekens', value: 'decorative'},
                  {title: 'In kader', value: 'boxed'},
                ],
              },
            }),
            ...sharedStyleFields,
          ],
          preview: {
            select: {quote: 'quote', author: 'author'},
            prepare: ({quote, author}) => ({
              title: quote ? `"${quote.substring(0, 50)}..."` : 'Citaat',
              subtitle: author ? `💬 ${author}` : '💬 Citaat',
            }),
          },
        },

        // ========== 6. CTA SECTION ==========
        {
          type: 'object',
          name: 'ctaSection',
          title: 'Call-to-Action',
          icon: RocketIcon,
          fields: [
            defineField({
              name: 'title',
              title: 'Titel',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'subtitle',
              title: 'Tekst',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'buttons',
              title: 'Knoppen',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'text', type: 'string', title: 'Tekst', validation: (Rule) => Rule.required()},
                    {name: 'url', type: 'string', title: 'URL', validation: (Rule) => Rule.required()},
                    {
                      name: 'style',
                      type: 'string',
                      title: 'Stijl',
                      initialValue: 'primary',
                      options: {
                        list: [
                          {title: 'Primair', value: 'primary'},
                          {title: 'Secundair', value: 'secondary'},
                        ],
                      },
                    },
                  ],
                  preview: {
                    select: {title: 'text'},
                  },
                },
              ],
              validation: (Rule) => Rule.min(1).max(3),
            }),
            ...sharedStyleFields.filter(f => f.name !== 'textAlign'),
            defineField({
              name: 'textAlign',
              title: 'Tekst uitlijning',
              type: 'string',
              initialValue: 'center',
              options: {
                list: [
                  {title: 'Links', value: 'left'},
                  {title: 'Midden', value: 'center'},
                  {title: 'Rechts', value: 'right'},
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
            }),
          ],
          preview: {
            select: {title: 'title'},
            prepare: ({title}) => ({
              title: title || 'Call-to-Action',
              subtitle: '🚀 CTA sectie',
            }),
          },
        },

        // ========== 7. TIMELINE SECTION ==========
        {
          type: 'object',
          name: 'timelineSection',
          title: 'Tijdlijn',
          icon: ClockIcon,
          fields: [
            defineField({
              name: 'title',
              title: 'Titel (optioneel)',
              type: 'string',
            }),
            defineField({
              name: 'events',
              title: 'Gebeurtenissen',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'year', type: 'string', title: 'Jaar/Datum', validation: (Rule) => Rule.required()},
                    {name: 'title', type: 'string', title: 'Titel', validation: (Rule) => Rule.required()},
                    {name: 'description', type: 'text', title: 'Beschrijving', rows: 2},
                    {name: 'image', type: 'image', title: 'Afbeelding (optioneel)', options: {hotspot: true}},
                  ],
                  preview: {
                    select: {title: 'title', year: 'year', media: 'image'},
                    prepare: ({title, year, media}) => ({
                      title: title,
                      subtitle: year,
                      media,
                    }),
                  },
                },
              ],
              validation: (Rule) => Rule.min(2),
            }),
            ...sharedStyleFields,
          ],
          preview: {
            select: {title: 'title', events: 'events'},
            prepare: ({title, events}) => ({
              title: title || 'Tijdlijn',
              subtitle: `⏱️ Tijdlijn (${events?.length || 0} events)`,
            }),
          },
        },

        // ========== 8. CARDS SECTION ==========
        {
          type: 'object',
          name: 'cardsSection',
          title: 'Kaarten Grid',
          icon: ThLargeIcon,
          fields: [
            defineField({
              name: 'title',
              title: 'Titel (optioneel)',
              type: 'string',
            }),
            defineField({
              name: 'subtitle',
              title: 'Ondertitel (optioneel)',
              type: 'string',
            }),
            defineField({
              name: 'cards',
              title: 'Kaarten',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'icon', type: 'string', title: 'Icoon (emoji)', description: 'Bijv. 🏠 📍 🎉'},
                    {name: 'title', type: 'string', title: 'Titel', validation: (Rule) => Rule.required()},
                    {name: 'description', type: 'text', title: 'Beschrijving', rows: 2},
                    {name: 'link', type: 'string', title: 'Link (optioneel)'},
                  ],
                  preview: {
                    select: {title: 'title', icon: 'icon'},
                    prepare: ({title, icon}) => ({
                      title: title,
                      subtitle: icon || '📋',
                    }),
                  },
                },
              ],
              validation: (Rule) => Rule.min(2).max(6),
            }),
            defineField({
              name: 'columns',
              title: 'Kolommen',
              type: 'number',
              initialValue: 3,
              options: {
                list: [
                  {title: '2 kolommen', value: 2},
                  {title: '3 kolommen', value: 3},
                  {title: '4 kolommen', value: 4},
                ],
              },
            }),
            ...sharedStyleFields,
          ],
          preview: {
            select: {title: 'title', cards: 'cards'},
            prepare: ({title, cards}) => ({
              title: title || 'Kaarten grid',
              subtitle: `🃏 ${cards?.length || 0} kaarten`,
            }),
          },
        },

        // ========== DIVIDER ==========
        {
          type: 'object',
          name: 'divider',
          title: 'Scheidingslijn',
          icon: BlockElementIcon,
          fields: [
            defineField({
              name: 'style',
              title: 'Stijl',
              type: 'string',
              initialValue: 'line',
              options: {
                list: [
                  {title: 'Dunne lijn', value: 'line'},
                  {title: 'Dikke lijn', value: 'thick'},
                  {title: 'Stippellijn', value: 'dotted'},
                  {title: 'Decoratief', value: 'decorative'},
                  {title: 'Kleine ruimte', value: 'space-small'},
                  {title: 'Grote ruimte', value: 'space-large'},
                ],
              },
            }),
          ],
          preview: {
            select: {style: 'style'},
            prepare: ({style}) => {
              const labels: Record<string, string> = {
                'line': '─────────',
                'thick': '━━━━━━━━━',
                'dotted': '· · · · · · ·',
                'decorative': '─ ✦ ─',
                'space-small': '↕ ruimte',
                'space-large': '↕↕ ruimte',
              }
              return {
                title: 'Scheidingslijn',
                subtitle: labels[style] || style,
              }
            },
          },
        },

        // ========== LEGACY SECTION (voor oude content) ==========
        {
          type: 'object',
          name: 'section',
          title: '⚠️ Oude sectie (verwijder en vervang)',
          icon: DocumentTextIcon,
          fields: [
            defineField({
              name: 'sectionTitle',
              title: 'Sectie titel',
              type: 'string',
            }),
            defineField({
              name: 'text',
              title: 'Tekst',
              type: 'array',
              of: [{type: 'block'}],
            }),
            defineField({
              name: 'image',
              title: 'Afbeelding',
              type: 'image',
              options: {hotspot: true},
              fields: [{name: 'alt', type: 'string', title: 'Alt tekst'}],
            }),
            defineField({
              name: 'layout',
              title: 'Layout',
              type: 'string',
              options: {
                list: [
                  {title: 'Tekst links', value: 'text-left'},
                  {title: 'Tekst rechts', value: 'text-right'},
                ],
              },
            }),
            defineField({
              name: 'style',
              title: 'Stijl',
              type: 'object',
              fields: [
                {name: 'backgroundColor', type: 'string', title: 'Achtergrondkleur'},
                {name: 'textColor', type: 'string', title: 'Tekstkleur'},
                {name: 'fontStyle', type: 'string', title: 'Lettertype'},
              ],
            }),
          ],
          preview: {
            select: {title: 'sectionTitle'},
            prepare: ({title}) => ({
              title: title || '⚠️ Oude sectie',
              subtitle: '⚠️ Verwijder en gebruik nieuwe sectie types',
            }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
