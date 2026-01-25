import {client} from '@/lib/sanity.client'
import Breadcrumbs from '../components/Breadcrumbs'
import {Mail, Send} from 'lucide-react'

const siteSettingsQuery = `*[_type == "siteSettings" && _id == "site-settings-singleton"][0] {
  contactEmail,
  tallyFormUrl
}`

export const metadata = {
  title: 'Contact - Buurtplatform',
  description: 'Neem contact op met het buurtplatform',
}

export default async function ContactPage() {
  const siteSettings = await client.fetch(siteSettingsQuery).catch(() => null)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Email Contact */}
          <div className="bg-white rounded-xl p-8 shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                E-mail
              </h2>
            </div>
            <p className="text-slate-600 mb-4">
              Stuur ons een e-mail voor vragen of opmerkingen
            </p>
            {siteSettings?.contactEmail ? (
              <a
                href={`mailto:${siteSettings.contactEmail}`}
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold text-lg transition-colors"
              >
                {siteSettings.contactEmail}
                <Send className="w-5 h-5 ml-2" />
              </a>
            ) : (
              <p className="text-slate-500 italic">
                E-mailadres wordt geconfigureerd in Sanity Studio
              </p>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-emerald-50 rounded-xl p-8 border-2 border-emerald-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Raak betrokken
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Wil je meedoen aan buurt acties of heb je ideeën voor de buurt? We horen graag van je!
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-md">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Contactformulier
          </h2>
          
          {siteSettings?.tallyFormUrl ? (
            <div className="w-full">
              <iframe
                src={siteSettings.tallyFormUrl}
                width="100%"
                height="600"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Contact formulier"
                className="rounded-lg"
              >
                Laden…
              </iframe>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-lg p-12 text-center">
              <p className="text-slate-600 text-lg mb-4">
                Het contactformulier wordt nog geconfigureerd.
              </p>
              <p className="text-slate-500">
                Voeg een Tally formulier URL toe in Sanity Studio onder "Instellingen" om het formulier hier te tonen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const revalidate = 60 // Revalidate every 60 seconds
