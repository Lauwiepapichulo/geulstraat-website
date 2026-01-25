import {notFound} from 'next/navigation'
import Image from 'next/image'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import {client} from '@/lib/sanity.client'
import {Calendar, MapPin, ExternalLink} from 'lucide-react'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

const buurtActieQuery = `*[_type == "buurtActie" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  datetime,
  location,
  description,
  signupLink,
  image {
    asset->,
    crop,
    hotspot,
    alt
  }
}`

export default async function BuurtActieDetailPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const buurtActie = await client.fetch(buurtActieQuery, {slug}).catch(() => null)

  if (!buurtActie) {
    notFound()
  }

  const actieDate = new Date(buurtActie.datetime)
  const formattedDate = actieDate.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = actieDate.toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const isPast = actieDate < new Date()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Image */}
      <div className="relative h-[400px] md:h-[500px]">
        {buurtActie.image ? (
          <Image
            src={urlFor(buurtActie.image).width(1920).fit('max').auto('format').url()}
            alt={buurtActie.image.alt || buurtActie.title}
            fill
            priority
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/50 to-transparent" />
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <Breadcrumbs
          items={[
            {label: 'Home', href: '/'},
            {label: 'Buurt acties', href: '/buurt-acties'},
            {label: buurtActie.title, href: `/buurt-acties/${slug}`}
          ]}
          className="mb-6"
        />

        <div className="bg-white rounded-xl p-8 md:p-12 shadow-xl">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {buurtActie.title}
            </h1>

            <div className="flex flex-col gap-4">
              <div className="flex items-center text-lg text-slate-700">
                <Calendar className="h-6 w-6 mr-3 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                <span>
                  <strong>{formattedDate}</strong> om {formattedTime}
                </span>
              </div>

              {buurtActie.location && (
                <div className="flex items-center text-lg text-slate-700">
                  <MapPin className="h-6 w-6 mr-3 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                  <span>{buurtActie.location}</span>
                </div>
              )}
            </div>

            {buurtActie.signupLink && !isPast && (
              <div className="mt-8">
                <a
                  href={buurtActie.signupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 text-lg min-h-[56px]"
                >
                  Doe mee met deze buurt actie
                  <ExternalLink className="ml-2 h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            )}

            {isPast && (
              <div className="mt-8 inline-flex items-center bg-slate-100 text-slate-600 px-6 py-3 rounded-lg">
                Deze actie heeft al plaatsgevonden
              </div>
            )}
          </header>

          {/* Description */}
          {buurtActie.description && (
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Over deze actie</h2>
              <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                {buurtActie.description}
              </p>
            </div>
          )}
        </div>
      </article>

      {/* Spacing for footer */}
      <div className="h-16" />
    </div>
  )
}

export async function generateStaticParams() {
  const acties = await client
    .fetch(`*[_type == "buurtActie"] { slug }`)
    .catch(() => [])

  return acties.map((actie: any) => ({
    slug: actie.slug.current,
  }))
}

export const revalidate = 60 // Revalidate every 60 seconds
