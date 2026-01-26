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
} from '@sanity/icons'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('🏘️ De Geulstraat')
    .items([
      // Homepage - banner instellingen
      S.listItem()
        .title('🏠 Homepage')
        .icon(DesktopIcon)
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
            .title('Homepage instellingen')
        ),

      S.listItem()
        .title('📖 Historie')
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
        .title('📰 Nieuwsberichten')
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList('post')
            .title('Nieuwsberichten')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
        ),

      // Buurt acties met inschrijvingen submenu
      S.listItem()
        .title('🎉 Buurt acties')
        .icon(CalendarIcon)
        .child(
          S.list()
            .title('Buurt acties')
            .items([
              S.listItem()
                .title('Alle buurt acties')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('buurtActie')
                    .title('Buurt acties')
                    .defaultOrdering([{field: 'datetime', direction: 'asc'}])
                ),
              S.divider(),
              S.listItem()
                .title('📋 Inschrijvingen')
                .icon(ClipboardIcon)
                .child(
                  S.documentTypeList('registration')
                    .title('Alle inschrijvingen')
                    .defaultOrdering([{field: 'registeredAt', direction: 'desc'}])
                ),
            ])
        ),

      S.listItem()
        .title('📸 Fotoalbums')
        .icon(ImagesIcon)
        .child(
          S.documentTypeList('gallery')
            .title('Fotoalbums')
            .defaultOrdering([{field: 'date', direction: 'desc'}])
        ),

      S.divider(),

      // === PAGINA'S ===

      S.listItem()
        .title('👥 Wie zijn wij')
        .icon(UsersIcon)
        .child(
          S.document()
            .schemaType('wieZijnWij')
            .documentId('wieZijnWij')
            .title('Over ons team')
        ),

      S.listItem()
        .title('📄 Overige pagina\'s')
        .icon(DocumentIcon)
        .child(
          S.documentTypeList('page')
            .title('Vaste pagina\'s')
        ),

      S.divider(),

      // === INSTELLINGEN ===
      S.listItem()
        .title('⚙️ Site Instellingen')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Website instellingen')
        ),
    ])
