import Breadcrumbs from '../components/Breadcrumbs'
import BuurtActieCard from '../components/BuurtActieCard'
import {client} from '@/lib/sanity.client'
import {Calendar} from 'lucide-react'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

const upcomingActiesQuery = `*[_type == "buurtActie" && datetime > now()] | order(datetime asc) {
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

const pastActiesQuery = `*[_type == "buurtActie" && datetime < now()] | order(datetime desc)[0...10] {
  _id,
  title,
  slug,
  datetime,
  location,
  description,
  image {
    asset->,
    crop,
    hotspot,
    alt
  }
}`

export const metadata = {
  title: 'Buurt acties - Buurtplatform',
  description: 'Bekijk alle aankomende buurt acties en activiteiten in de Geulstraat',
}

export default async function BuurtActiesPage() {
  const upcomingActies = await client.fetch(upcomingActiesQuery).catch(() => [])
  const pastActies = await client.fetch(pastActiesQuery).catch(() => [])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-500 to-purple-500 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[
            {label: 'Home', href: '/'},
            {label: 'Buurt acties', href: '/buurt-acties'},
          ]} />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-6 mb-4">
            Buurt acties
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Doe mee aan activiteiten in de Geulstraat en ontmoet je buren
          </p>
        </div>
      </div>

      {/* Calendar View */}
      {upcomingActies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                Aankomende acties
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {upcomingActies.map((actie: any) => {
                const date = new Date(actie.datetime)
                const day = date.toLocaleDateString('nl-NL', { day: '2-digit' })
                const month = date.toLocaleDateString('nl-NL', { month: 'short' })
                
                return (
                  <a
                    key={actie._id}
                    href={`#actie-${actie._id}`}
                    className="flex flex-col items-center justify-center bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 hover:border-emerald-600 rounded-lg p-3 min-w-[80px] transition-all hover:scale-105"
                  >
                    <span className="text-2xl font-bold text-emerald-600">{day}</span>
                    <span className="text-sm text-slate-600 capitalize">{month}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Acties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
          Alle aankomende acties
        </h2>

        {upcomingActies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingActies.map((actie: any) => {
              // Use urlFor to apply crop/hotspot
              const imageUrl = actie.image?.asset 
                ? urlFor(actie.image).width(800).height(600).fit('crop').auto('format').url()
                : undefined
              return (
                <div key={actie._id} id={`actie-${actie._id}`}>
                  <BuurtActieCard
                    title={actie.title}
                    description={actie.description}
                    imageUrl={imageUrl}
                    imageAlt={actie.image?.alt}
                    datetime={actie.datetime}
                    location={actie.location}
                    signupLink={actie.signupLink}
                    slug={actie.slug.current}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <p className="text-slate-600 text-lg">
              Er staan momenteel geen buurt acties gepland. Check later terug!
            </p>
          </div>
        )}
      </section>

      {/* Past Acties Archive */}
      {pastActies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Archief
          </h2>
          <details className="bg-white rounded-xl p-6 shadow-md">
            <summary className="cursor-pointer font-semibold text-lg text-slate-900 hover:text-emerald-600 transition-colors">
              Bekijk eerdere buurt acties ({pastActies.length})
            </summary>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastActies.map((actie: any) => {
                // Use urlFor to apply crop/hotspot
                const imageUrl = actie.image?.asset 
                  ? urlFor(actie.image).width(800).height(600).fit('crop').auto('format').url()
                  : undefined
                return (
                  <BuurtActieCard
                    key={actie._id}
                    title={actie.title}
                    description={actie.description}
                    imageUrl={imageUrl}
                    imageAlt={actie.image?.alt}
                    datetime={actie.datetime}
                    location={actie.location}
                    slug={actie.slug.current}
                  />
                )
              })}
            </div>
          </details>
        </section>
      )}
    </div>
  )
}

export const revalidate = 60 // Revalidate every 60 seconds
