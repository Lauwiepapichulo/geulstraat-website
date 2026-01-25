import Link from 'next/link'
import Image from 'next/image'
import {client} from '@/lib/sanity.client'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

// Query to get site settings including administrators
const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  title,
  contactEmail,
  administrators[] {
    _key,
    name,
    address,
    email,
    photo {
      asset->,
      crop,
      hotspot
    }
  }
}`

export default async function Footer() {
  const currentYear = new Date().getFullYear()
  const siteSettings = await client.fetch(siteSettingsQuery).catch(() => null)
  const administrators = siteSettings?.administrators || []

  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">{siteSettings?.title || 'De Geulstraat'}</h3>
            <p className="text-slate-300 leading-relaxed">
              Blijf op de hoogte van nieuws, buurt acties en activiteiten in de Geulstraat.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Navigatie</h3>
            <nav className="space-y-2">
              <Link href="/over-de-buurt" className="block text-slate-300 hover:text-white transition-colors">
                Over de buurt
              </Link>
              <Link href="/nieuws" className="block text-slate-300 hover:text-white transition-colors">
                Laatste nieuws
              </Link>
              <Link href="/buurt-acties" className="block text-slate-300 hover:text-white transition-colors">
                Buurt acties
              </Link>
              <Link href="/fotos" className="block text-slate-300 hover:text-white transition-colors">
                Foto's
              </Link>
              <Link href="/over-ons" className="block text-slate-300 hover:text-white transition-colors">
                Over ons
              </Link>
              <Link href="/contact" className="block text-slate-300 hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            {siteSettings?.contactEmail && (
              <a 
                href={`mailto:${siteSettings.contactEmail}`}
                className="text-slate-300 hover:text-white transition-colors block mb-4"
              >
                {siteSettings.contactEmail}
              </a>
            )}
            <Link 
              href="/contact"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Contactformulier
            </Link>
          </div>

          {/* Beheerders */}
          <div>
            <h3 className="text-xl font-bold mb-4">Beheerders</h3>
            <div className="space-y-4">
              {administrators.length > 0 ? (
                administrators.map((admin: any) => (
                  <div 
                    key={admin._key}
                    className="flex items-center space-x-3 text-slate-300"
                  >
                    {admin.photo?.asset ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-slate-700">
                        <Image
                          src={urlFor(admin.photo).width(96).height(96).fit('crop').url()}
                          alt={admin.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 ring-2 ring-slate-700">
                        <span className="text-2xl">👤</span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-white">{admin.name}</div>
                      {admin.address && (
                        <div className="text-sm text-slate-400">{admin.address}</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">
                  Voeg beheerders toe in Site Instellingen
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; {currentYear} {siteSettings?.title || 'Buurtplatform'}. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  )
}
