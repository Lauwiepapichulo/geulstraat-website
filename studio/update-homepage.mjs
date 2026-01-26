import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'vs1rb6mu',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

async function updateHomepage() {
  try {
    const result = await client
      .patch('homepage')
      .set({
        aboutSectionTitle: 'Over de Geulstraat',
        aboutSectionText: 'De Geulstraat is een bruisende straat in de Rivierenbuurt met betrokken bewoners en een duidelijk eigen karakter.',
        aboutSectionButtonText: 'Lees meer over de Geulstraat',
        newsSectionTitle: 'Het laatste nieuws',
        newsSectionSubtitle: 'Blijf op de hoogte van wat er speelt in de Geulstraat',
        actiesSectionTitle: 'Buurt acties',
        actiesSectionSubtitle: 'Doe mee aan activiteiten in de buurt',
      })
      .commit()
    
    console.log('Homepage updated!', result)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

updateHomepage()
