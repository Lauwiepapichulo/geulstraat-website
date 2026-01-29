import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: 'vs1rb6mu',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})
