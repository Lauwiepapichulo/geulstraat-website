import Breadcrumbs from '../components/Breadcrumbs'
import Link from 'next/link'
import Image from 'next/image'
import {client} from '@/lib/sanity.client'
import {Calendar} from 'lucide-react'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

const galleriesQuery = `*[_type == "gallery"] | order(date desc) {
  _id,
  title,
  slug,
  date,
  description,
  coverImage {
    asset->,
    crop,
    hotspot,
    alt
  },
  "imageCount": count(images)
}`

export const metadata = {
  title: "Foto's - Buurtplatform",
  description: 'Bekijk fotoalbums van evenementen en activiteiten in de buurt',
}

export default async function FotosPage() {
  const galleries = await client.fetch(galleriesQuery).catch(() => [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{label: "Foto's"}]} />

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
        Fotoalbums
      </h1>

      {galleries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery: any) => {
            const formattedDate = new Date(gallery.date).toLocaleDateString('nl-NL', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })

            return (
              <Link
                key={gallery._id}
                href={`/fotos/${gallery.slug.current}`}
                className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Cover Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  {gallery.coverImage?.asset ? (
                    <Image
                      src={urlFor(gallery.coverImage).width(800).height(600).fit('crop').auto('format').url()}
                      alt={gallery.coverImage.alt || gallery.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">📷</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {gallery.title}
                  </h2>

                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                    <time dateTime={gallery.date}>{formattedDate}</time>
                  </div>

                  {gallery.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {gallery.description}
                    </p>
                  )}

                  <p className="text-primary font-semibold text-sm">
                    {gallery.imageCount} foto{gallery.imageCount !== 1 ? "'s" : ''}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">
            Er zijn nog geen fotoalbums geüpload.
          </p>
        </div>
      )}
    </div>
  )
}
