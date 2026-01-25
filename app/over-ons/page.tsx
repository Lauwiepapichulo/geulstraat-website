import Breadcrumbs from '../components/Breadcrumbs'
import Image from 'next/image'
import {client} from '@/lib/sanity.client'
import {PortableText} from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

// Query for the wieZijnWij singleton document
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
  title: 'Over ons - De Geulstraat',
  description: 'Ontmoet de mensen achter het buurtplatform van de Geulstraat',
}

const portableTextComponents = {
  block: {
    h2: ({children}: any) => (
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-10 mb-5">{children}</h2>
    ),
    h3: ({children}: any) => (
      <h3 className="text-xl md:text-2xl font-semibold text-slate-800 mt-8 mb-4">{children}</h3>
    ),
    normal: ({children}: any) => (
      <p className="text-lg text-slate-600 mb-5 leading-relaxed">{children}</p>
    ),
  },
  marks: {
    strong: ({children}: any) => <strong className="font-semibold">{children}</strong>,
    em: ({children}: any) => <em className="italic">{children}</em>,
    link: ({children, value}: any) => (
      <a href={value.href} className="text-[#1E3A5F] hover:text-[#152B47] underline transition-colors">
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({children}: any) => (
      <ul className="list-disc list-outside ml-6 mb-5 space-y-2 text-lg text-slate-600">{children}</ul>
    ),
    number: ({children}: any) => (
      <ol className="list-decimal list-outside ml-6 mb-5 space-y-2 text-lg text-slate-600">{children}</ol>
    ),
  },
}

export default async function OverOnsPage() {
  const pageData = await client.fetch(wieZijnWijQuery).catch(() => null)

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E3A5F] via-[#2D5A87] to-[#152B47] pt-24 md:pt-28 pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <Breadcrumbs items={[
            {label: 'Home', href: '/'},
            {label: 'Over ons', href: '/over-ons'},
          ]} />
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-6 mb-4">
            {pageData?.title || 'Over ons'}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Ontmoet de mensen achter het buurtplatform van de Geulstraat
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-14">
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60">
          {pageData?.content ? (
            <PortableText value={pageData.content} components={portableTextComponents} />
          ) : (
            <p className="text-slate-500 text-lg">
              Voeg content toe in Sanity Studio onder "Wie zijn wij".
            </p>
          )}
        </div>

        {/* Photo Grid */}
        {pageData?.photos && pageData.photos.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Foto's</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pageData.photos.map((photo: any, index: number) => (
                <div key={index} className="group">
                  <div className="relative aspect-square rounded-xl overflow-hidden shadow-[0_4px_20px_-4px_rgb(30_58_95/0.1)]">
                    <Image
                      src={urlFor(photo).width(600).fit('max').auto('format').url()}
                      alt={photo.alt || `Foto ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                  {photo.caption && (
                    <p className="mt-3 text-sm text-slate-500 text-center">{photo.caption}</p>
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
