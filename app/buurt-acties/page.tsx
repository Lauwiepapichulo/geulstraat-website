import Breadcrumbs from '../components/Breadcrumbs'
import BuurtActieCard from '../components/BuurtActieCard'
import {client} from '@/lib/sanity.client'
import {Calendar} from 'lucide-react'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

const upcomingActiesQuery = `*[_type == "buurtActie" && (datetime > now() || datumTBD == true) && isArchived != true] | order(datumTBD desc, datetime asc) {
  _id,
  title,
  slug,
  datetime,
  datumTBD,
  location,
  description,
  signupLink,
  acceptsRegistrations,
  image {
    asset->,
    crop,
    hotspot,
    alt
  }
}`

const pastActiesQuery = `*[_type == "buurtActie" && datetime < now() && datumTBD != true && isArchived != true] | order(datetime desc)[0...10] {
  _id,
  title,
  slug,
  datetime,
  datumTBD,
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
  title: 'Buurt acties - De Geulstraat',
  description: 'Bekijk alle aankomende buurt acties en activiteiten in de Geulstraat',
}

export default async function BuurtActiesPage() {
  const [upcomingActies, pastActies] = await Promise.all([
    client.fetch(upcomingActiesQuery).catch(() => []),
    client.fetch(pastActiesQuery).catch(() => []),
  ])

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <div className="bg-gradient-to-br from-[#1E3A5F] via-[#2D5A87] to-[#152B47] pt-24 md:pt-28 pb-16 md:pb-20">
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

      {upcomingActies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-6 h-6 text-[#1E3A5F]" />
              <h2 className="text-2xl font-bold text-slate-900">
                Aankomende acties
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {upcomingActies.map((actie: any) => {
                if (actie.datumTBD) {
                  return (
                    <a
                      key={actie._id}
                      href={`#actie-${actie._id}`}
                      className="flex flex-col items-center justify-center bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 hover:border-slate-400 rounded-lg p-3 min-w-[80px] transition-all hover:scale-105"
                    >
                      <span className="text-lg font-bold text-slate-600">TBD</span>
                      <span className="text-xs text-slate-500">datum volgt</span>
                    </a>
                  )
                }
                
                const date = new Date(actie.datetime)
                const day = date.toLocaleDateString('nl-NL', { day: '2-digit' })
                const month = date.toLocaleDateString('nl-NL', { month: 'short' })
                
                return (
                  <a
                    key={actie._id}
                    href={`#actie-${actie._id}`}
                    className="flex flex-col items-center justify-center bg-[#1E3A5F]/5 hover:bg-[#1E3A5F]/10 border-2 border-[#1E3A5F]/20 hover:border-[#1E3A5F] rounded-lg p-3 min-w-[80px] transition-all hover:scale-105"
                  >
                    <span className="text-2xl font-bold text-[#1E3A5F]">{day}</span>
                    <span className="text-sm text-slate-600 capitalize">{month}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
          Alle aankomende acties
        </h2>

        {upcomingActies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingActies.map((actie: any) => {
              const imageUrl = actie.image?.asset 
                ? urlFor(actie.image).width(800).fit('max').auto('format').url()
                : undefined
              return (
                <div key={actie._id} id={`actie-${actie._id}`}>
                  <BuurtActieCard
                    title={actie.title}
                    description={actie.description}
                    imageUrl={imageUrl}
                    imageAlt={actie.image?.alt}
                    datetime={actie.datetime}
                    datumTBD={actie.datumTBD}
                    location={actie.location}
                    signupLink={actie.signupLink}
                    acceptsRegistrations={actie.acceptsRegistrations !== false}
                    slug={actie.slug.current}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60">
            <p className="text-slate-600 text-lg">Er staan momenteel geen buurt acties gepland. Check later terug!</p>
          </div>
        )}
      </section>

      {pastActies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Archief
          </h2>
          <details className="bg-white rounded-xl p-6 shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60">
            <summary className="cursor-pointer font-semibold text-lg text-slate-900 hover:text-[#1E3A5F] transition-colors">
              Bekijk eerdere buurt acties ({pastActies.length})
            </summary>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastActies.map((actie: any) => {
                const imageUrl = actie.image?.asset 
                  ? urlFor(actie.image).width(800).fit('max').auto('format').url()
                  : undefined
                return (
                  <BuurtActieCard
                    key={actie._id}
                    title={actie.title}
                    description={actie.description}
                    imageUrl={imageUrl}
                    imageAlt={actie.image?.alt}
                    datetime={actie.datetime}
                    datumTBD={actie.datumTBD}
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

export const revalidate = 0
