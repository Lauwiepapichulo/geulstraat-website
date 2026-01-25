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
  title: 'Nieuws - De Geulstraat',
  description: 'Blijf op de hoogte van het laatste nieuws uit de Geulstraat',
}

export default async function NieuwsPage() {
  const posts = await client.fetch(postsQuery).catch(() => [])

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E3A5F] via-[#2D5A87] to-[#152B47] pt-24 md:pt-28 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[
            {label: 'Home', href: '/'},
            {label: 'Nieuws', href: '/nieuws'},
          ]} />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-6 mb-4">
            Nieuws
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Blijf op de hoogte van het laatste nieuws uit de Geulstraat
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => {
              const imageUrl = post.mainImage?.asset 
                ? urlFor(post.mainImage).width(800).fit('max').auto('format').url()
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
          <div className="bg-white rounded-xl p-12 text-center shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60">
            <p className="text-slate-600 text-lg">
              Er zijn nog geen nieuwsberichten gepubliceerd.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
