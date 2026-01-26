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
  const siteSettings = await client.fetch(siteSettingsQuery, {}, { next: { revalidate: 0 } }).catch(() => null)
  const administrators = siteSettings?.administrators || []

  return (
    <footer className="bg-[#1E3A5F] text-white mt-auto">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-[#3B82A0] via-[#5B7C99] to-[#3B82A0]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">{siteSettings?.title || 'De Geulstraat'}</h3>
            <p className="text-slate-300 leading-relaxed">
              Blijf op de hoogte van nieuws, buurt acties en activiteiten in de Geulstraat.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Navigatie</h3>
            <nav className="space-y-2">
              <Link href="/over-de-buurt" className="block text-slate-300 hover:text-white transition-colors duration-300">
                Historie
              </Link>
              <Link href="/nieuws" className="block text-slate-300 hover:text-white transition-colors duration-300">
                Nieuws
              </Link>
              <Link href="/buurt-acties" className="block text-slate-300 hover:text-white transition-colors duration-300">
                Buurt acties
              </Link>
              <Link href="/over-ons" className="block text-slate-300 hover:text-white transition-colors duration-300">
                Over ons
              </Link>
              <Link href="/contact" className="block text-slate-300 hover:text-white transition-colors duration-300">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contact</h3>
            {siteSettings?.contactEmail && (
              <a 
                href={`mailto:${siteSettings.contactEmail}`}
                className="text-slate-300 hover:text-white transition-colors duration-300 block mb-4"
              >
                {siteSettings.contactEmail}
              </a>
            )}
            <Link 
              href="/contact"
              className="inline-block bg-white text-[#1E3A5F] font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:bg-slate-100 hover:shadow-lg"
            >
              Contactformulier
            </Link>
          </div>

          {/* Beheerders */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Beheerders</h3>
            <div className="space-y-4">
              {administrators.length > 0 ? (
                administrators.map((admin: any) => (
                  <div 
                    key={admin._key}
                    className="flex items-center space-x-3 text-slate-300"
                  >
                    {admin.photo?.asset ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/20">
                        <Image
                          src={urlFor(admin.photo).width(96).fit('max').url()}
                          alt={admin.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#152B47] flex items-center justify-center flex-shrink-0 ring-2 ring-white/20">
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
                <p className="text-slate-400 text-sm">
                  Voeg beheerders toe in Site Instellingen
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 text-center text-slate-400">
          <p>&copy; {currentYear} {siteSettings?.title || 'Buurtplatform'}. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  )
}
