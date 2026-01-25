import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'vs1rb6mu',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const overDeBuurtContent = {
  _id: 'overDeBuurt',
  _type: 'overDeBuurt',
  title: 'De Geulstraat',
  sections: [
    // 1. HERO SECTION
    {
      _key: 'hero-main',
      _type: 'heroSection',
      title: 'De Geulstraat',
      subtitle: 'Historie en buurt in de Rivierenbuurt',
      overlay: 'dark',
      height: 'large',
      // backgroundImage moet handmatig worden toegevoegd
    },

    // 2. INTRO TEXT
    {
      _key: 'intro-text',
      _type: 'textSection',
      content: [
        {
          _key: 'intro-block',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'intro-span',
              _type: 'span',
              text: 'De Geulstraat ligt in het hart van de Rivierenbuurt in Amsterdam-Zuid. Deze rustige woonstraat maakt deel uit van het beroemde Plan Zuid van H.P. Berlage en vertelt het verhaal van een buurt waar architectuur, onderwijs en dagelijks leven al bijna een eeuw samenkomen.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
      backgroundColor: 'white',
      textAlign: 'center',
      padding: 'normal',
    },

    // 3. LIGGING EN STRUCTUUR - met foto placeholder
    {
      _key: 'ligging-sectie',
      _type: 'mediaSection',
      title: 'Ligging en structuur van de straat',
      content: [
        {
          _key: 'ligging-block',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'ligging-span',
              _type: 'span',
              text: 'De Geulstraat loopt tussen twee levendige winkelstraten: van het groene plein aan de Maasstraat tot aan het Scheldeplein en de Scheldestraat.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
      layout: 'photo-top',
      backgroundColor: 'gray',
      textAlign: 'center',
      padding: 'spacious',
      // image moet handmatig worden toegevoegd (breed straatfoto of kaart)
    },

    // 4. QUOTE - Scheldeplein
    {
      _key: 'quote-scheldeplein',
      _type: 'quoteSection',
      quote: 'Het Scheldeplein was ooit het einde van de stad; daarachter lagen weilanden en infrastructuur.',
      style: 'decorative',
      backgroundColor: 'emerald',
      textAlign: 'center',
      padding: 'normal',
    },

    // 5. PLAN ZUID - met foto's
    {
      _key: 'plan-zuid-sectie',
      _type: 'mediaSection',
      title: 'Plan Zuid en de Amsterdamse School',
      content: [
        {
          _key: 'planzuid-block1',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'planzuid-span1',
              _type: 'span',
              text: 'De Geulstraat is onderdeel van Plan Zuid, ontworpen door architect en stedenbouwkundige H.P. Berlage. Het plan werd in 1917 goedgekeurd en vanaf de jaren twintig uitgevoerd. Kenmerkend zijn de rechte straten, ruime pleinen en lange bouwblokken.',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _key: 'planzuid-block2',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'planzuid-span2',
              _type: 'span',
              text: 'De bebouwing in de Geulstraat is typisch voor de Amsterdamse School: baksteenarchitectuur, expressieve vormen en zorgvuldige details. Veel woningen dateren van rond 1928 en werden gebouwd door woningbouwverenigingen voor de groeiende middenklasse.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
      layout: 'text-left',
      imageSize: 'medium',
      backgroundColor: 'white',
      textAlign: 'left',
      padding: 'spacious',
      // image moet handmatig worden toegevoegd (historische kaart of geveldetail)
    },

    // 6. SCHOLEN TITEL
    {
      _key: 'scholen-titel',
      _type: 'textSection',
      title: 'Een straat van scholen',
      icon: '🏫',
      content: [
        {
          _key: 'scholen-block1',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'scholen-span1',
              _type: 'span',
              text: 'Onderwijs speelde een grote rol in en rond de Geulstraat. Aan de straat lag de Zuiderschool (Christelijke Lagere School). In de buurt stonden ook de Dongeschool en de Dintelschool.',
              marks: [],
            },
          ],
          markDefs: [],
        },
        {
          _key: 'scholen-block2',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'scholen-span2',
              _type: 'span',
              text: 'Op de hoek met de Dintelstraat bevond zich de Gereformeerde Kweekschool (later CPA), officieel met de ingang aan de Dintelstraat maar bouwkundig verbonden met de Geulstraat. Ook het Amsterdamse Grafisch Lyceum was hier gevestigd.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
      backgroundColor: 'beige',
      textAlign: 'left',
      padding: 'normal',
    },

    // 7. GALERIJ - Schoolgebouwen
    {
      _key: 'scholen-galerij',
      _type: 'gallerySection',
      title: 'Schoolgebouwen door de jaren heen',
      columns: 3,
      showCaptions: true,
      backgroundColor: 'beige',
      textAlign: 'center',
      padding: 'normal',
      // images moeten handmatig worden toegevoegd
    },

    // 8. QUOTE - Onderwijskwartier
    {
      _key: 'quote-onderwijs',
      _type: 'quoteSection',
      quote: 'Tot in de jaren zeventig werd dit deel van de Rivierenbuurt gezien als een echt onderwijskwartier.',
      style: 'boxed',
      backgroundColor: 'white',
      textAlign: 'center',
      padding: 'normal',
    },

    // 9. BUURTLEVEN
    {
      _key: 'buurtleven-sectie',
      _type: 'mediaSection',
      title: 'Buurtleven en middenstand',
      content: [
        {
          _key: 'buurt-block',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'buurt-span',
              _type: 'span',
              text: 'Naast wonen en onderwijs kende de Geulstraat een actief buurtleven. In de straat en directe omgeving waren onder anderen een melkboer, bakker, schoenmaker, kruidenier en een fietsenstalling. Veel winkeliers woonden boven of achter hun zaak, wat zorgde voor een hechte buurtgemeenschap.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
      layout: 'text-right',
      imageSize: 'medium',
      backgroundColor: 'white',
      textAlign: 'left',
      padding: 'spacious',
      // image moet handmatig worden toegevoegd (straatleven jaren '30)
    },

    // DIVIDER
    {
      _key: 'divider-1',
      _type: 'divider',
      style: 'decorative',
    },

    // 10. OORLOGSJAREN
    {
      _key: 'oorlog-sectie',
      _type: 'mediaSection',
      title: 'De oorlogsjaren',
      content: [
        {
          _key: 'oorlog-block',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'oorlog-span',
              _type: 'span',
              text: 'Tijdens de Tweede Wereldoorlog werden enkele schoolgebouwen tijdelijk in gebruik genomen door Duitse militairen. Dit had grote gevolgen voor het onderwijs en het dagelijks leven van bewoners. De oorlog liet diepe sporen na in de Rivierenbuurt.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
      layout: 'text-left',
      imageSize: 'small',
      backgroundColor: 'gray',
      textAlign: 'left',
      padding: 'normal',
      // image moet handmatig worden toegevoegd (archieffoto WOII)
    },

    // 11. NIEUWE FUNCTIES
    {
      _key: 'functies-sectie',
      _type: 'mediaSection',
      title: 'Van onderwijs naar nieuwe functies',
      content: [
        {
          _key: 'functies-block',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'functies-span',
              _type: 'span',
              text: 'Vanaf de jaren zeventig veranderde het gebruik van de gebouwen. Scholen vertrokken en maakten plaats voor nieuwe functies, zoals het Boerhaave Medisch Centrum en later het MediaCollege. De gebouwen kregen een nieuwe rol, terwijl het historische karakter behouden bleef.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
      layout: 'text-right',
      imageSize: 'medium',
      backgroundColor: 'white',
      textAlign: 'left',
      padding: 'spacious',
      // image moet handmatig worden toegevoegd (gebouw toen en nu)
    },

    // 12. VANDAAG - met brede foto
    {
      _key: 'vandaag-sectie',
      _type: 'mediaSection',
      title: 'De Geulstraat vandaag',
      content: [
        {
          _key: 'vandaag-block',
          _type: 'block',
          style: 'normal',
          children: [
            {
              _key: 'vandaag-span',
              _type: 'span',
              text: 'Vandaag is de Geulstraat een actieve woon- en schoolstraat met een rijke geschiedenis. De architectuur van Plan Zuid, de scholen, de horeca en winkels aan beide uiteinden en het sterke buurtgevoel maken de straat tot een levend stukje Amsterdam-Zuid.',
              marks: [],
            },
          ],
          markDefs: [],
        },
      ],
      layout: 'photo-top',
      backgroundColor: 'emerald',
      textAlign: 'center',
      padding: 'spacious',
      // image moet handmatig worden toegevoegd (hedendaags straatbeeld)
    },

    // CTA
    {
      _key: 'cta-contact',
      _type: 'ctaSection',
      title: 'Deel jouw verhaal',
      subtitle: 'Heb je herinneringen, foto\'s of verhalen over de Geulstraat? We horen graag van je!',
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
  ],
}

async function populate() {
  console.log('Populating Over de buurt content...')
  
  try {
    // Delete existing document first
    await client.delete('overDeBuurt').catch(() => {
      console.log('No existing document to delete')
    })
    
    // Create new document
    const result = await client.create(overDeBuurtContent)
    console.log('✅ Content created successfully!')
    console.log('Document ID:', result._id)
    console.log('')
    console.log('📸 Nu moet je de foto\'s handmatig toevoegen in Sanity Studio:')
    console.log('   1. Ga naar http://localhost:3333')
    console.log('   2. Open "Over de buurt"')
    console.log('   3. Klik op elke sectie en voeg de juiste foto toe')
    console.log('')
    console.log('Foto placeholders die je moet invullen:')
    console.log('   - Hero: Mooie hoofdfoto van de Geulstraat')
    console.log('   - Ligging: Breed straatfoto of kaart')
    console.log('   - Plan Zuid: Historische kaart of geveldetail')
    console.log('   - Scholen galerij: 2-6 foto\'s van schoolgebouwen')
    console.log('   - Buurtleven: Straatleven jaren \'30')
    console.log('   - Oorlog: Archieffoto WOII in Zuid')
    console.log('   - Nieuwe functies: Gebouw toen en nu')
    console.log('   - Vandaag: Hedendaags straatbeeld')
  } catch (error) {
    console.error('Error:', error.message)
    if (error.message.includes('token')) {
      console.log('')
      console.log('⚠️  Je hebt een SANITY_WRITE_TOKEN nodig.')
      console.log('   1. Ga naar https://www.sanity.io/manage/project/vs1rb6mu/api')
      console.log('   2. Maak een nieuwe token met "Editor" rechten')
      console.log('   3. Run: SANITY_WRITE_TOKEN=jouw_token node populate-content.mjs')
    }
  }
}

populate()
