import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Set to true in production for better performance
  perspective: 'published',
})

const builder = imageUrlBuilder(client)

// Helper function to generate optimized image URLs
export function urlForImage(source: any) {
  return builder.image(source)
}
