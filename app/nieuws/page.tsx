import Breadcrumbs from '../components/Breadcrumbs'
import NewsCard from '../components/NewsCard'
import {client} from '@/lib/sanity.client'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

const postsQuery = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage {
    asset->,
    crop,
    hotspot,
    alt
  }
}`

export const metadata = {
  title: 'Nieuws - Buurtplatform',
  description: 'Blijf op de hoogte van het laatste nieuws uit de buurt',
}

export default async function NieuwsPage() {
  const posts = await client.fetch(postsQuery).catch(() => [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{label: 'Nieuws'}]} />

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
        Nieuws
      </h1>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => {
            // Use urlFor to apply crop/hotspot
            const imageUrl = post.mainImage?.asset 
              ? urlFor(post.mainImage).width(800).height(600).fit('crop').auto('format').url()
              : undefined
            return (
              <NewsCard
                key={post._id}
                title={post.title}
                excerpt={post.excerpt}
                imageUrl={imageUrl}
                imageAlt={post.mainImage?.alt}
                publishedAt={post.publishedAt}
                slug={post.slug.current}
              />
            )
          })}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">
            Er zijn nog geen nieuwsberichten gepubliceerd.
          </p>
        </div>
      )}
    </div>
  )
}
