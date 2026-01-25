import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'vs1rb6mu',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sk0DrCbkpO3F2g7Q0GV7VPGrWGFPeBJ2gKujGkrS5oE035ByLhtlfvMy06O9bjBKu29EMsVttcp4oWu3piMESfnzlDaeiXNqpOAo4izGDbJyUPpqbfDfIDrYnmCvXYthcggRnKZPLQ60fbkAQv07SYfaLpT55YZ1wGAZRD0HiEkc6N2Wa1dt',
  useCdn: false,
})

async function fix() {
  // Get existing document with sections
  const existing = await client.fetch('*[_type == "overDeBuurt"][0]')
  console.log('Found:', existing?._id, 'with', existing?.sections?.length, 'sections')
  
  if (existing && existing.sections) {
    // Delete all overDeBuurt documents
    const allDocs = await client.fetch('*[_type == "overDeBuurt"]._id')
    for (const id of allDocs) {
      await client.delete(id)
      console.log('Deleted:', id)
    }
    
    // Also delete drafts
    try {
      await client.delete('drafts.overDeBuurt')
    } catch(e) {}
    
    // Create with correct ID
    const result = await client.createOrReplace({
      _id: 'overDeBuurt',
      _type: 'overDeBuurt',
      title: existing.title,
      sections: existing.sections,
    })
    console.log('Created with ID:', result._id)
  }
}

fix()
