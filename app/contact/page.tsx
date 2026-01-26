import {client} from '@/lib/sanity.client'
import Breadcrumbs from '../components/Breadcrumbs'
import ContactForm from '../components/ContactForm'
import {Mail, MapPin} from 'lucide-react'

const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  contactEmail,
  formspreeEndpoint
}`

export const metadata = {
  title: 'Contact - De Geulstraat',
  description: 'Neem contact op met de Geulstraat',
}

export default async function ContactPage() {
  const siteSettings = await client.fetch(siteSettingsQuery, {}, { next: { revalidate: 0 } }).catch(() => null)

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E3A5F] via-[#2D5A87] to-[#152B47] pt-24 md:pt-28 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[
            {label: 'Home', href: '/'},
            {label: 'Contact', href: '/contact'},
          ]} />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-6 mb-4">
            Contact
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Heb je vragen of opmerkingen? Neem contact met ons op!
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Email Contact */}
          <div className="bg-white rounded-xl p-8 shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-[#1E3A5F]/10 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-[#1E3A5F]" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                E-mail
              </h2>
            </div>
            <p className="text-slate-600 mb-4">
              Stuur ons direct een e-mail
            </p>
            <a
              href={`mailto:${siteSettings?.contactEmail || 'info@geulstraatamsterdam.nl'}`}
              className="inline-flex items-center text-[#1E3A5F] hover:text-[#152B47] font-semibold text-lg transition-colors duration-300"
            >
              {siteSettings?.contactEmail || 'info@geulstraatamsterdam.nl'}
            </a>
          </div>

          {/* Location */}
          <div className="bg-[#3B82A0]/10 rounded-xl p-8 border border-[#3B82A0]/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-[#3B82A0]/20 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-[#3B82A0]" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Locatie
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Geulstraat<br />
              Amsterdam Rivierenbuurt<br />
              Nederland
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Stuur ons een bericht
          </h2>
          <p className="text-slate-500 mb-8">
            Vul het formulier in en we nemen zo snel mogelijk contact met je op.
          </p>
          
          <ContactForm 
            formspreeEndpoint={siteSettings?.formspreeEndpoint}
            recipientEmail={siteSettings?.contactEmail || 'info@geulstraatamsterdam.nl'}
          />
        </div>
      </div>
    </div>
  )
}

export const revalidate = 0
