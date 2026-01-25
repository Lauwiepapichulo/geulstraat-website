import Breadcrumbs from '../components/Breadcrumbs'
import Image from 'next/image'
import {client} from '@/lib/sanity.client'
import {Mail, Phone} from 'lucide-react'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

const peopleQuery = `*[_type == "person"] | order(order asc, name asc) {
  _id,
  name,
  role,
  bio,
  email,
  phone,
  showPhone,
  portrait {
    asset-> {
      _id,
      url
    },
    alt
  }
}`

export const metadata = {
  title: 'Over ons - Buurtplatform',
  description: 'Ontmoet het bestuur en de vrijwilligers van het buurtplatform',
}

export default async function OverOnsPage() {
  const people = await client.fetch(peopleQuery).catch(() => [])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[
            {label: 'Home', href: '/'},
            {label: 'Over ons', href: '/over-ons'},
          ]} />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-6 mb-4">
            Over ons
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Ons bestuur bestaat uit enthousiaste buurtbewoners die zich inzetten voor een levendige en hechte gemeenschap.
          </p>
        </div>
      </div>

      {/* Team Members */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {people.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {people.map((person: any) => (
              <article
                key={person._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 duration-300"
              >
                {/* Portrait */}
                <div className="relative h-80 w-full bg-gradient-to-br from-emerald-100 to-teal-100">
                  {person.portrait ? (
                    <Image
                      src={urlFor(person.portrait).width(600).height(800).url()}
                      alt={person.portrait.alt || person.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-slate-400 text-6xl">👤</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    {person.name}
                  </h2>
                  <p className="text-emerald-600 font-semibold mb-4">{person.role}</p>

                  {person.bio && (
                    <p className="text-slate-700 mb-4 leading-relaxed">
                      {person.bio}
                    </p>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    {person.email && (
                      <div className="flex items-center text-slate-600">
                        <Mail className="h-4 w-4 mr-2 flex-shrink-0 text-emerald-600" aria-hidden="true" />
                        <a
                          href={`mailto:${person.email}`}
                          className="hover:text-emerald-600 transition-colors break-all"
                        >
                          {person.email}
                        </a>
                      </div>
                    )}

                    {person.showPhone && person.phone && (
                      <div className="flex items-center text-slate-600">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0 text-emerald-600" aria-hidden="true" />
                        <a
                          href={`tel:${person.phone}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          {person.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <p className="text-slate-600 text-lg">
              Er zijn nog geen teamleden toegevoegd.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export const revalidate = 60 // Revalidate every 60 seconds
