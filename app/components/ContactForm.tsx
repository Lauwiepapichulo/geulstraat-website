'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const form = e.currentTarget
    const formData = new FormData(form)

    // Converteer FormData naar JSON object
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Er is iets misgegaan. Probeer het later opnieuw.')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Er is iets misgegaan. Probeer het later opnieuw.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-[#1E3A5F]/10 rounded-xl p-8 md:p-12 text-center">
        <CheckCircle className="w-16 h-16 text-[#1E3A5F] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Bericht verzonden!</h3>
        <p className="text-slate-600 mb-6">
          Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="inline-flex items-center justify-center bg-[#1E3A5F] hover:bg-[#152B47] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300"
        >
          Nieuw bericht versturen
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name field */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
          Naam *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none transition-all duration-300 bg-white text-slate-800"
          placeholder="Je naam"
        />
      </div>

      {/* Email field */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
          E-mailadres *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none transition-all duration-300 bg-white text-slate-800"
          placeholder="je@email.nl"
        />
      </div>

      {/* Phone field (optional) */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
          Telefoonnummer <span className="text-slate-400 font-normal">(optioneel)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none transition-all duration-300 bg-white text-slate-800"
          placeholder="06-12345678"
        />
      </div>

      {/* Subject field */}
      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
          Onderwerp *
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none transition-all duration-300 bg-white text-slate-800"
        >
          <option value="">Selecteer een onderwerp</option>
          <option value="Vraag over de buurt">Vraag over de buurt</option>
          <option value="Idee voor buurt actie">Idee voor buurt actie</option>
          <option value="Probleem melden">Probleem melden</option>
          <option value="Meedoen als vrijwilliger">Meedoen als vrijwilliger</option>
          <option value="Website feedback">Website feedback</option>
          <option value="Overig">Overig</option>
        </select>
      </div>

      {/* Message field */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
          Bericht *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20 outline-none transition-all duration-300 bg-white text-slate-800 resize-y"
          placeholder="Typ hier je bericht..."
        />
      </div>

      {/* Error message */}
      {status === 'error' && (
        <div className="flex items-start gap-3 bg-red-50 text-red-700 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full inline-flex items-center justify-center bg-[#1E3A5F] hover:bg-[#152B47] disabled:bg-slate-400 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Verzenden...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Verstuur bericht
          </>
        )}
      </button>

      <p className="text-sm text-slate-500 text-center">
        * Verplichte velden
      </p>
    </form>
  )
}
