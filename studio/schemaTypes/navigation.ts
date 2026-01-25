import {defineField, defineType} from 'sanity'
import {MenuIcon, DocumentIcon, LinkIcon} from '@sanity/icons'

// Nested navigation item type (for children)
const navItemFields = [
  defineField({
    name: 'title',
    title: 'Menu titel',
    type: 'string',
    description: 'De tekst die in het menu verschijnt',
    validation: (Rule) => Rule.required().error('Een titel is verplicht'),
  }),
  defineField({
    name: 'linkType',
    title: 'Type link',
    type: 'string',
    initialValue: 'page',
    options: {
      list: [
        {title: 'Pagina (intern)', value: 'page'},
        {title: 'Externe link', value: 'external'},
        {title: 'Alleen menu (geen link)', value: 'none'},
      ],
      layout: 'radio',
    },
  }),
  defineField({
    name: 'page',
    title: 'Pagina',
    type: 'reference',
    to: [{type: 'page'}],
    description: 'Selecteer een pagina uit je website',
    hidden: ({parent}) => parent?.linkType !== 'page',
  }),
  defineField({
    name: 'externalUrl',
    title: 'Externe URL',
    type: 'url',
    description: 'Voer een volledige URL in (bijv. https://example.com)',
    hidden: ({parent}) => parent?.linkType !== 'external',
    validation: (Rule) =>
      Rule.uri({
        scheme: ['http', 'https'],
      }),
  }),
  defineField({
    name: 'customSlug',
    title: 'Aangepaste URL (optioneel)',
    type: 'string',
    description: 'Overschrijf de standaard URL van de pagina (bijv. "/over-ons" in plaats van de pagina slug)',
    hidden: ({parent}) => parent?.linkType !== 'page',
  }),
]

export default defineType({
  name: 'navigation',
  title: 'Navigatie',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Naam',
      type: 'string',
      description: 'Interne naam voor deze navigatie (bijv. "Hoofdmenu" of "Sidebar")',
      initialValue: 'Hoofdnavigatie',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Menu items',
      type: 'array',
      description: 'Sleep items om de volgorde te wijzigen. Je kunt ook sub-items toevoegen.',
      of: [
        {
          type: 'object',
          name: 'navItem',
          title: 'Menu item',
          icon: DocumentIcon,
          fields: [
            ...navItemFields,
            defineField({
              name: 'children',
              title: 'Sub-items',
              type: 'array',
              description: 'Voeg sub-pagina\'s toe onder dit menu item',
              of: [
                {
                  type: 'object',
                  name: 'childNavItem',
                  title: 'Sub-item',
                  icon: LinkIcon,
                  fields: [
                    ...navItemFields,
                    // Third level children (optional, for deeper nesting)
                    defineField({
                      name: 'children',
                      title: 'Sub-sub-items',
                      type: 'array',
                      description: 'Nog een niveau dieper (optioneel)',
                      of: [
                        {
                          type: 'object',
                          name: 'grandchildNavItem',
                          title: 'Sub-sub-item',
                          icon: LinkIcon,
                          fields: navItemFields,
                          preview: {
                            select: {
                              title: 'title',
                              linkType: 'linkType',
                            },
                            prepare({title, linkType}) {
                              const icons: Record<string, string> = {
                                page: '📄',
                                external: '🔗',
                                none: '📁',
                              }
                              return {
                                title: title || 'Naamloos item',
                                subtitle: icons[linkType] || '📄',
                              }
                            },
                          },
                        },
                      ],
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      linkType: 'linkType',
                      childCount: 'children.length',
                    },
                    prepare({title, linkType, childCount}) {
                      const icons: Record<string, string> = {
                        page: '📄',
                        external: '🔗',
                        none: '📁',
                      }
                      const childText = childCount ? ` (${childCount} sub-items)` : ''
                      return {
                        title: title || 'Naamloos item',
                        subtitle: `${icons[linkType] || '📄'}${childText}`,
                      }
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title',
              linkType: 'linkType',
              childCount: 'children.length',
            },
            prepare({title, linkType, childCount}) {
              const icons: Record<string, string> = {
                page: '📄',
                external: '🔗',
                none: '📁',
              }
              const childText = childCount ? ` → ${childCount} sub-items` : ''
              return {
                title: title || 'Naamloos item',
                subtitle: `${icons[linkType] || '📄'}${childText}`,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      itemCount: 'items.length',
    },
    prepare({title, itemCount}) {
      return {
        title: title || 'Navigatie',
        subtitle: `${itemCount || 0} menu items`,
      }
    },
  },
})
