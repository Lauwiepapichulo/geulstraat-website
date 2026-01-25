import Breadcrumbs from '../components/Breadcrumbs'
import Image from 'next/image'
import {client} from '@/lib/sanity.client'
import {PortableText} from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

const wieZijnWijQuery = `*[_type == "wieZijnWij"][0] {
  title,
  content,
  photos[] {
    asset->,
    crop,
    hotspot,
    alt,
    caption
  }
}`

export const metadata = {
  title: 'Wie zijn wij - De Geulstraat',
  description: 'Ontmoet de mensen achter het buurtplatform van de Geulstraat',
}

const portableTextComponents = {
  block: {
    h2: ({children}: any) => (
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mt-8 mb-4">{children}</h2>
    ),
    h3: ({children}: any) => (
      <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mt-6 mb-3">{children}</h3>
    ),
    normal: ({children}: any) => (
      <p className="text-lg text-slate-700 mb-4 leading-relaxed">{children}</p>
    ),
  },
  marks: {
    strong: ({children}: any) => <strong className="font-semibold">{children}</strong>,
    em: ({children}: any) => <em className="italic">{children}</em>,
    link: ({children, value}: any) => (
      <a href={value.href} className="text-emerald-600 hover:text-emerald-700 underline">
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({children}: any) => (
      <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-lg text-slate-700">{children}</ul>
    ),
    number: ({children}: any) => (
      <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-lg text-slate-700">{children}</ol>
    ),
  },
}

export default async function WieZijnWijPage() {
  const pageData = await client.fetch(wieZijnWijQuery).catch(() => null)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <Breadcrumbs items={[
            {label: 'Home', href: '/'},
            {label: 'Wie zijn wij', href: '/wie-zijn-wij'},
          ]} />
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-6">
            {pageData?.title || 'Wie zijn wij'}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm">
          {pageData?.content ? (
            <PortableText value={pageData.content} components={portableTextComponents} />
          ) : (
            <p className="text-slate-600 text-lg">
              Voeg content toe in Sanity Studio onder "Wie zijn wij".
            </p>
          )}
        </div>

        {/* Photo Grid */}
        {pageData?.photos && pageData.photos.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Foto's</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pageData.photos.map((photo: any, index: number) => (
                <div key={index} className="group">
                  <div className="relative aspect-square rounded-lg overflow-hidden shadow-sm">
                    <Image
                      src={urlFor(photo).width(600).height(600).fit('crop').auto('format').url()}
                      alt={photo.alt || `Foto ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                  {photo.caption && (
                    <p className="mt-2 text-sm text-slate-600 text-center">{photo.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const revalidate = 60
