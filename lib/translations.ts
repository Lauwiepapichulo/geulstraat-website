export const translations = {
  nl: {
    // Navigation
    nav: {
      home: 'Home',
      overDeBuurt: 'Historie',
      nieuws: 'Nieuws',
      buurtActies: 'Buurt acties',
      overOns: 'Over ons',
      contact: 'Contact',
    },
    // Common
    common: {
      readMore: 'Lees meer',
      viewAll: 'Bekijk alles',
      backToHome: 'Terug naar home',
      loading: 'Laden...',
      noResults: 'Geen resultaten gevonden',
      checkLater: 'Check later terug!',
    },
    // Home page
    home: {
      latestNews: 'Laatste nieuws',
      noNews: 'Er zijn nog geen nieuwsberichten. Check later terug!',
      viewAllNews: 'Bekijk alle nieuwsberichten',
      buurtActies: 'Buurt acties',
      buurtActiesSubtitle: 'Doe mee aan activiteiten in de buurt',
      noActies: 'Er zijn momenteel geen geplande buurt acties. Check later terug!',
      viewAllActies: 'Bekijk alle buurt acties',
    },
    // News page
    news: {
      title: 'Nieuws',
      subtitle: 'Blijf op de hoogte van het laatste nieuws uit de Geulstraat',
      noNews: 'Er zijn nog geen nieuwsberichten gepubliceerd.',
    },
    // Buurt acties page
    acties: {
      title: 'Buurt acties',
      subtitle: 'Doe mee aan activiteiten in de Geulstraat en ontmoet je buren',
      upcoming: 'Aankomende acties',
      allUpcoming: 'Alle aankomende acties',
      noActies: 'Er staan momenteel geen buurt acties gepland. Check later terug!',
      archive: 'Archief',
      viewPast: 'Bekijk eerdere buurt acties',
      signUp: 'Aanmelden',
      location: 'Locatie',
    },
    // Contact page
    contact: {
      title: 'Contact',
      subtitle: 'Heb je vragen of opmerkingen? Neem contact met ons op!',
      email: 'E-mail',
      emailSubtitle: 'Stuur ons direct een e-mail',
      location: 'Locatie',
      sendMessage: 'Stuur ons een bericht',
      formSubtitle: 'Vul het formulier in en we nemen zo snel mogelijk contact met je op.',
      name: 'Naam',
      emailAddress: 'E-mailadres',
      message: 'Bericht',
      send: 'Verstuur',
      sending: 'Verzenden...',
      success: 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
      error: 'Er is iets misgegaan. Probeer het later opnieuw.',
    },
    // Over ons page
    overOns: {
      title: 'Over ons',
      subtitle: 'Ontmoet de mensen achter het buurtplatform van de Geulstraat',
      photos: "Foto's",
      addContent: 'Voeg content toe in Sanity Studio onder "Wie zijn wij".',
    },
    // Footer
    footer: {
      navigation: 'Navigatie',
      contact: 'Contact',
      socials: 'Socials',
      copyright: '© 2026 De Geulstraat. Alle rechten voorbehouden.',
    },
    // Breadcrumbs
    breadcrumbs: {
      home: 'Home',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      overDeBuurt: 'History',
      nieuws: 'News',
      buurtActies: 'Community events',
      overOns: 'About us',
      contact: 'Contact',
    },
    // Common
    common: {
      readMore: 'Read more',
      viewAll: 'View all',
      backToHome: 'Back to home',
      loading: 'Loading...',
      noResults: 'No results found',
      checkLater: 'Check back later!',
    },
    // Home page
    home: {
      latestNews: 'Latest news',
      noNews: 'No news articles yet. Check back later!',
      viewAllNews: 'View all news',
      buurtActies: 'Community events',
      buurtActiesSubtitle: 'Join activities in the neighborhood',
      noActies: 'No community events planned at the moment. Check back later!',
      viewAllActies: 'View all events',
    },
    // News page
    news: {
      title: 'News',
      subtitle: 'Stay up to date with the latest news from the Geulstraat',
      noNews: 'No news articles have been published yet.',
    },
    // Buurt acties page
    acties: {
      title: 'Community events',
      subtitle: 'Join activities in the Geulstraat and meet your neighbors',
      upcoming: 'Upcoming events',
      allUpcoming: 'All upcoming events',
      noActies: 'No community events planned at the moment. Check back later!',
      archive: 'Archive',
      viewPast: 'View past events',
      signUp: 'Sign up',
      location: 'Location',
    },
    // Contact page
    contact: {
      title: 'Contact',
      subtitle: 'Have questions or comments? Get in touch with us!',
      email: 'Email',
      emailSubtitle: 'Send us an email directly',
      location: 'Location',
      sendMessage: 'Send us a message',
      formSubtitle: 'Fill out the form and we will get back to you as soon as possible.',
      name: 'Name',
      emailAddress: 'Email address',
      message: 'Message',
      send: 'Send',
      sending: 'Sending...',
      success: 'Thank you for your message! We will get back to you as soon as possible.',
      error: 'Something went wrong. Please try again later.',
    },
    // Over ons page
    overOns: {
      title: 'About us',
      subtitle: 'Meet the people behind the Geulstraat community platform',
      photos: 'Photos',
      addContent: 'Add content in Sanity Studio under "Who we are".',
    },
    // Footer
    footer: {
      navigation: 'Navigation',
      contact: 'Contact',
      socials: 'Socials',
      copyright: '© 2026 De Geulstraat. All rights reserved.',
    },
    // Breadcrumbs
    breadcrumbs: {
      home: 'Home',
    },
  },
}

export type Language = 'nl' | 'en'
export type Translations = typeof translations.nl
