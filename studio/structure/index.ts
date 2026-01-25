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
} from '@sanity/icons'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Homepage - banner instellingen
      S.listItem()
        .title('Homepage')
        .icon(DesktopIcon)
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
            .title('Homepage')
        ),

      // Over de buurt
      S.listItem()
        .title('Over de buurt')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('overDeBuurt')
            .documentId('overDeBuurt')
            .title('Over de buurt')
        ),

      S.divider(),

      // Nieuws (posts)
      S.listItem()
        .title('Laatste nieuws')
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList('post')
            .title('Nieuwsberichten')
        ),

      // Buurt acties
      S.listItem()
        .title('Buurt acties')
        .icon(CalendarIcon)
        .child(
          S.documentTypeList('buurtActie')
            .title('Buurt acties')
        ),

      // Fotoalbums
      S.listItem()
        .title('Fotoalbums')
        .icon(ImagesIcon)
        .child(
          S.documentTypeList('gallery')
            .title('Fotoalbums')
        ),

      S.divider(),

      // Wie zijn wij
      S.listItem()
        .title('Wie zijn wij')
        .icon(UsersIcon)
        .child(
          S.document()
            .schemaType('wieZijnWij')
            .documentId('wieZijnWij')
            .title('Wie zijn wij')
        ),

      // Vaste paginas
      S.listItem()
        .title('Vaste pagina\'s')
        .icon(DocumentIcon)
        .child(
          S.documentTypeList('page')
            .title('Vaste pagina\'s')
        ),

      S.divider(),

      // Site instellingen
      S.listItem()
        .title('Site Instellingen')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Instellingen')
        ),
    ])
