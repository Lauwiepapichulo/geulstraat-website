import {StructureBuilder} from 'sanity/structure'
import {
  DocumentTextIcon,
  CalendarIcon,
  ImagesIcon,
  UsersIcon,
  DocumentIcon,
  HomeIcon,
  DesktopIcon,
  CogIcon,
  ClipboardIcon,
  ArchiveIcon,
  CheckmarkCircleIcon,
} from '@sanity/icons'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('De Geulstraat')
    .items([
      // Homepage - banner instellingen
      S.listItem()
        .title('Homepage')
        .icon(DesktopIcon)
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
            .title('Homepage instellingen')
        ),

      S.listItem()
        .title('Historie')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('overDeBuurt')
            .documentId('overDeBuurt')
            .title('Historie van de Geulstraat')
        ),

      S.divider(),

      // === CONTENT ===
      S.listItem()
        .title('Nieuwsberichten')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Nieuwsberichten')
            .items([
              S.listItem()
                .title('Actieve berichten')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentTypeList('post')
                    .title('Actieve nieuwsberichten')
                    .filter('_type == "post" && (isArchived != true)')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Archief')
                .icon(ArchiveIcon)
                .child(
                  S.documentTypeList('post')
                    .title('Gearchiveerde berichten')
                    .filter('_type == "post" && isArchived == true')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
              S.divider(),
              S.listItem()
                .title('Alle berichten')
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList('post')
                    .title('Alle nieuwsberichten')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
            ])
        ),

      // Buurt acties met inschrijvingen submenu
      S.listItem()
        .title('Buurt acties')
        .icon(CalendarIcon)
        .child(
          S.list()
            .title('Buurt acties')
            .items([
              S.listItem()
                .title('Actieve acties')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentTypeList('buurtActie')
                    .title('Actieve buurt acties')
                    .filter('_type == "buurtActie" && (isArchived != true)')
                    .defaultOrdering([{field: 'datetime', direction: 'asc'}])
                ),
              S.listItem()
                .title('Archief')
                .icon(ArchiveIcon)
                .child(
                  S.documentTypeList('buurtActie')
                    .title('Gearchiveerde acties')
                    .filter('_type == "buurtActie" && isArchived == true')
                    .defaultOrdering([{field: 'datetime', direction: 'desc'}])
                ),
              S.divider(),
              S.listItem()
                .title('Alle acties')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('buurtActie')
                    .title('Alle buurt acties')
                    .defaultOrdering([{field: 'datetime', direction: 'asc'}])
                ),
              S.divider(),
              S.listItem()
                .title('Inschrijvingen')
                .icon(ClipboardIcon)
                .child(
                  S.documentTypeList('registration')
                    .title('Alle inschrijvingen')
                    .defaultOrdering([{field: 'registeredAt', direction: 'desc'}])
                ),
            ])
        ),

      S.listItem()
        .title('Fotoalbums')
        .icon(ImagesIcon)
        .child(
          S.documentTypeList('gallery')
            .title('Fotoalbums')
            .defaultOrdering([{field: 'date', direction: 'desc'}])
        ),

      S.divider(),

      // === PAGINA'S ===

      S.listItem()
        .title('Wie zijn wij')
        .icon(UsersIcon)
        .child(
          S.document()
            .schemaType('wieZijnWij')
            .documentId('wieZijnWij')
            .title('Over ons team')
        ),

      S.listItem()
        .title('Overige pagina\'s')
        .icon(DocumentIcon)
        .child(
          S.documentTypeList('page')
            .title('Vaste pagina\'s')
        ),

      S.divider(),

      // === INSTELLINGEN ===
      S.listItem()
        .title('Site Instellingen')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Website instellingen')
        ),
    ])
