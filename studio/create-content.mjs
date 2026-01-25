import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'vs1rb6mu',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sk0DrCbkpO3F2g7Q0GV7VPGrWGFPeBJ2gKujGkrS5oE035ByLhtlfvMy06O9bjBKu29EMsVttcp4oWu3piMESfnzlDaeiXNqpOAo4izGDbJyUPpqbfDfIDrYnmCvXYthcggRnKZPLQ60fbkAQv07SYfaLpT55YZ1wGAZRD0HiEkc6N2Wa1dt',
  useCdn: false,
})

const sections = [
  {
    _key: 'hero-main',
    _type: 'heroSection',
    title: 'De Geulstraat',
    subtitle: 'Historie en buurt in de Rivierenbuurt',
    overlay: 'dark',
    height: 'large',
  },
  {
    _key: 'intro-text',
    _type: 'textSection',
    content: [
      {
        _key: 'intro-block',
        _type: 'block',
        style: 'normal',
        children: [{_key: 'intro-span', _type: 'span', text: 'De Geulstraat ligt in het hart van de Rivierenbuurt in Amsterdam-Zuid. Deze rustige woonstraat maakt deel uit van het beroemde Plan Zuid van H.P. Berlage en vertelt het verhaal van een buurt waar architectuur, onderwijs en dagelijks leven al bijna een eeuw samenkomen.', marks: []}],
        markDefs: [],
      },
    ],
    backgroundColor: 'white',
    textAlign: 'center',
    padding: 'normal',
  },
  {
    _key: 'ligging-sectie',
    _type: 'mediaSection',
    title: 'Ligging en structuur van de straat',
    content: [
      {
        _key: 'ligging-block',
        _type: 'block',
        style: 'normal',
        children: [{_key: 'ligging-span', _type: 'span', text: 'De Geulstraat loopt tussen twee levendige winkelstraten: van het groene plein aan de Maasstraat tot aan het Scheldeplein en de Scheldestraat.', marks: []}],
        markDefs: [],
      },
    ],
    layout: 'photo-top',
    backgroundColor: 'gray',
    textAlign: 'center',
    padding: 'spacious',
  },
  {
    _key: 'quote-scheldeplein',
    _type: 'quoteSection',
    quote: 'Het Scheldeplein was ooit het einde van de stad; daarachter lagen weilanden en infrastructuur.',
    style: 'decorative',
    backgroundColor: 'emerald',
    textAlign: 'center',
    padding: 'normal',
  },
  {
    _key: 'plan-zuid-sectie',
    _type: 'mediaSection',
    title: 'Plan Zuid en de Amsterdamse School',
    content: [
      {
        _key: 'pz-block1',
        _type: 'block',
        style: 'normal',
        children: [{_key: 'pz-span1', _type: 'span', text: 'De Geulstraat is onderdeel van Plan Zuid, ontworpen door architect en stedenbouwkundige H.P. Berlage. Het plan werd in 1917 goedgekeurd en vanaf de jaren twintig uitgevoerd. Kenmerkend zijn de rechte straten, ruime pleinen en lange bouwblokken.', marks: []}],
        markDefs: [],
      },
      {
        _key: 'pz-block2',
        _type: 'block',
        style: 'normal',
        children: [{_key: 'pz-span2', _type: 'span', text: 'De bebouwing in de Geulstraat is typisch voor de Amsterdamse School: baksteenarchitectuur, expressieve vormen en zorgvuldige details. Veel woningen dateren van rond 1928 en werden gebouwd door woningbouwverenigingen voor de groeiende middenklasse.', marks: []}],
        markDefs: [],
      },
    ],
    layout: 'text-left',
    imageSize: 'medium',
    backgroundColor: 'white',
    textAlign: 'left',
    padding: 'spacious',
  },
  {
    _key: 'scholen-titel',
    _type: 'textSection',
    title: 'Een straat van scholen',
    icon: '🏫',
    content: [
      {
        _key: 'sch-block1',
        _type: 'block',
        style: 'normal',
        children: [{_key: 'sch-span1', _type: 'span', text: 'Onderwijs speelde een grote rol in en rond de Geulstraat. Aan de straat lag de Zuiderschool (Christelijke Lagere School). In de buurt stonden ook de Dongeschool en de Dintelschool.', marks: []}],
        markDefs: [],
      },
      {
        _key: 'sch-block2',
        _type: 'block',
        style: 'normal',
        children: [{_key: 'sch-span2', _type: 'span', text: 'Op de hoek met de Dintelstraat bevond zich de Gereformeerde Kweekschool (later CPA), officieel met de ingang aan de Dintelstraat maar bouwkundig verbonden met de Geulstraat. Ook het Amsterdamse Grafisch Lyceum was hier gevestigd.', marks: []}],
        markDefs: [],
      },
    ],
    backgroundColor: 'beige',
    textAlign: 'left',
    padding: 'normal',
  },
  {
    _key: 'scholen-galerij',
    _type: 'gallerySection',
    title: 'Schoolgebouwen door de jaren heen',
    columns: 3,
    showCaptions: true,
    backgroundColor: 'beige',
    textAlign: 'center',
    padding: 'normal',
  },
  {
    _key: 'quote-onderwijs',
    _type: 'quoteSection',
    quote: 'Tot in de jaren zeventig werd dit deel van de Rivierenbuurt gezien als een echt onderwijskwartier.',
    style: 'boxed',
    backgroundColor: 'white',
    textAlign: 'center',
    padding: 'normal',
  },
  {
    _key: 'buurtleven-sectie',
    _type: 'mediaSection',
    title: 'Buurtleven en middenstand',
    content: [
      {
        _key: 'buurt-block',
        _type: 'block',
        style: 'normal',
        children: [{_key: 'buurt-span', _type: 'span', text: 'Naast wonen en onderwijs kende de Geulstraat een actief buurtleven. In de straat en directe omgeving waren onder anderen een melkboer, bakker, schoenmaker, kruidenier en een fietsenstalling. Veel winkeliers woonden boven of achter hun zaak, wat zorgde voor een hechte buurtgemeenschap.', marks: []}],
        markDefs: [],
      },
    ],
    layout: 'text-right',
    imageSize: 'medium',
    backgroundColor: 'white',
    textAlign: 'left',
    padding: 'spacious',
  },
  {
    _key: 'divider-1',
    _type: 'divider',
    style: 'decorative',
  },
  {
    _key: 'oorlog-sectie',
    _type: 'mediaSection',
    title: 'De oorlogsjaren',
    content: [
      {
        _key: 'oorlog-block',
        _type: 'block',
        style: 'normal',
        children: [{_key: 'oorlog-span', _type: 'span', text: 'Tijdens de Tweede Wereldoorlog werden enkele schoolgebouwen tijdelijk in gebruik genomen door Duitse militairen. Dit had grote gevolgen voor het onderwijs en het dagelijks leven van bewoners. De oorlog liet diepe sporen na in de Rivierenbuurt.', marks: []}],
        markDefs: [],
      },
    ],
    layout: 'text-left',
    imageSize: 'small',
    backgroundColor: 'gray',
    textAlign: 'left',
    padding: 'normal',
  },
  {
    _key: 'functies-sectie',
    _type: 'mediaSection',
    title: 'Van onderwijs naar nieuwe functies',
    content: [
      {
        _key: 'functies-block',
        _type: 'block',
        style: 'normal',
        children: [{_key: 'functies-span', _type: 'span', text: 'Vanaf de jaren zeventig veranderde het gebruik van de gebouwen. Scholen vertrokken en maakten plaats voor nieuwe functies, zoals het Boerhaave Medisch Centrum en later het MediaCollege. De gebouwen kregen een nieuwe rol, terwijl het historische karakter behouden bleef.', marks: []}],
        markDefs: [],
      },
    ],
    layout: 'text-right',
    imageSize: 'medium',
    backgroundColor: 'white',
    textAlign: 'left',
    padding: 'spacious',
  },
  {
    _key: 'vandaag-sectie',
    _type: 'mediaSection',
    title: 'De Geulstraat vandaag',
    content: [
      {
        _key: 'vandaag-block',
        _type: 'block',
        style: 'normal',
        children: [{_key: 'vandaag-span', _type: 'span', text: 'Vandaag is de Geulstraat een actieve woon- en schoolstraat met een rijke geschiedenis. De architectuur van Plan Zuid, de scholen, de horeca en winkels aan beide uiteinden en het sterke buurtgevoel maken de straat tot een levend stukje Amsterdam-Zuid.', marks: []}],
        markDefs: [],
      },
    ],
    layout: 'photo-top',
    backgroundColor: 'emerald',
    textAlign: 'center',
    padding: 'spacious',
  },
  {
    _key: 'cta-contact',
    _type: 'ctaSection',
    title: 'Deel jouw verhaal',
    subtitle: "Heb je herinneringen, foto's of verhalen over de Geulstraat? We horen graag van je!",
    buttons: [
      {
        _key: 'btn-contact',
        text: 'Neem contact op',
        url: '/contact',
        style: 'primary',
      },
    ],
    backgroundColor: 'dark',
    textAlign: 'center',
    padding: 'spacious',
  },
]

async function createContent() {
  console.log('Creating content...')
  
  try {
    // First, find and delete any existing overDeBuurt documents
    const existing = await client.fetch('*[_type == "overDeBuurt"]._id')
    console.log('Found existing documents:', existing)
    
    for (const id of existing) {
      console.log('Deleting:', id)
      await client.delete(id)
    }
    
    // Create new document
    const doc = {
      _type: 'overDeBuurt',
      title: 'De Geulstraat',
      sections: sections,
    }
    
    const result = await client.create(doc)
    console.log('✅ Document created with ID:', result._id)
    console.log('')
    console.log('Ga nu naar http://localhost:3333 en refresh de pagina!')
    
  } catch (error) {
    console.error('Error:', error.message)
    console.error(error)
  }
}

createContent()
