// Centrale configuratie voor de 3 buurtthema's (teams).
// De `value` wordt gebruikt als opgeslagen waarde in Sanity (thema-tag op
// nieuws en acties) en als URL-slug voor de themapagina (/thema/<value>).

export interface Theme {
  value: 'green-team' | 'clean-team' | 'happy-team'
  name: string
  badge: string
  // Accentkleuren voor de themapagina
  color: string
  colorHover: string
  ring: string
  // Korte tekst onder de knop op de homepage
  tagline: string
  // Toelichting op de themapagina (per alinea een item; URLs worden klikbaar)
  description: string[]
}

export const themes: Theme[] = [
  {
    value: 'green-team',
    name: 'Green Team',
    badge: '/themes/green-team.png',
    color: '#2F7D32',
    colorHover: '#256528',
    ring: '#2F7D32',
    tagline: 'Gevel zoekt Groen',
    description: [
      "Wil je meer groen? Sluit je aan bij de GroenGroep. We hebben een aanvraag gedaan voor de inrichting van meer boomtuintjes en geveltuintjes. Geef onze buurt een groene boost en adopteer een boomtuintje! Er is budget voor plantjes, wie pakt de handschoen op? Zo'n boomtuintje helpt bijen en vlinders, vergroot de biodiversiteit en maakt onze buurt gezelliger. Een paar plantjes maken al een groot verschil. Samen zorgen we voor een koelere, mooiere en gezondere leefomgeving. Het is makkelijk, leuk en je ziet direct resultaat van je inzet. Ben je al actief met groen in je straat? Laat het ons weten: samen staan we sterk. Doe mee en geef je op voor de groen-groep.",
    ],
  },
  {
    value: 'clean-team',
    name: 'Clean Team',
    badge: '/themes/clean-team.png',
    color: '#1E7A8C',
    colorHover: '#175E6C',
    ring: '#1E7A8C',
    tagline: 'Zwerfafval zoekt baasje',
    description: [
      'Een schone en groene buurt maken we samen. Dat hoeft helemaal niet veel tijd te kosten. Wil je een handje helpen? Eenmalig of vaker? Er zijn veel kleine activiteiten die helpen:',
      'Op zaterdag 26 september om 10 uur is onze CleanUp van 10-11 uur. We maken elk kwartaal een uurtje schoon. En drinken daarna koffie op het Maasplein. Meld je aan, dan zorgen we voor prikkers.',
      'Wil je een of meerdere eigen prikkers (volwassenen of kinderen) en/of een metalen ring voor vuilniszakken om zelf vaker schoon te maken? Meld het ons!',
      'Je kunt een afvalcontainer van de gemeente adopteren. Als meer mensen dat doen, houden we de buurt rond de containers gemakkelijker schoon: https://www.amsterdam.nl/afval/adopteer-afvalcontainer/',
      'Zie je veel zwerfvuil? Meld het de gemeente, dan wordt er actie ondernomen, het helpt! https://meldingen.amsterdam.nl/incident/beschrijf',
    ],
  },
  {
    value: 'happy-team',
    name: 'Happy Team',
    badge: '/themes/happy-team.png',
    color: '#C2680F',
    colorHover: '#9E540C',
    ring: '#C2680F',
    tagline: 'Koffie zoekt gezelschap',
    description: [
      'Een fijne buurt maken we samen. Na elke Clean Up (elk kwartaal) drinken we koffie op het Maasplein en maken we er een ontmoetingsmoment van. Geen tijd voor Clean Up? Kom ook dan langs om 11 uur voor koffie en een praatje.',
      'Op zaterdag 26 september is het Burendag. Dan organiseren we een straatfeestje. Zet het alvast in je agenda. We zoeken nog mensen die een handje willen helpen, op de dag zelf, of die vooraf mee willen denken: een uurtje voor je buurtje.',
      "En we zoeken mensen die mee willen denken over het creëren van deze 'happy moments'.",
    ],
  },
]

export function getTheme(value: string): Theme | undefined {
  return themes.find((t) => t.value === value)
}

// Opties voor het Sanity-keuzeveld
export const themeOptions = themes.map((t) => ({title: t.name, value: t.value}))
