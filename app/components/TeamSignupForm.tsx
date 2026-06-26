'use client'

import {useState} from 'react'
import {CheckCircle, Loader2, AlertCircle} from 'lucide-react'

interface TeamSignupFormProps {
  teamName: string
  teamValue: string
  color: string
  colorHover: string
}

export default function TeamSignupForm({teamName, teamValue, color, colorHover}: TeamSignupFormProps) {
  const [formData, setFormData] = useState({name: '', email: '', phone: '', message: ''})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/team-signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...formData, team: teamValue, teamName}),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Er ging iets mis')
      setStatus('success')
      setFormData({name: '', email: '', phone: '', message: ''})
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Er ging iets mis')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">Je bent aangemeld!</h3>
        <p className="text-green-700">
          Bedankt voor je aanmelding bij het <strong>{teamName}</strong>. We nemen snel contact met je op.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}

      <div>
        <label htmlFor="team-name" className="block text-sm font-semibold text-slate-700 mb-2">
          Naam <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="team-name"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 outline-none transition-all"
          style={{['--tw-ring-color' as any]: color}}
          placeholder="Je volledige naam"
        />
      </div>

      <div>
        <label htmlFor="team-email" className="block text-sm font-semibold text-slate-700 mb-2">
          E-mailadres <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="team-email"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 outline-none transition-all"
          placeholder="je@email.nl"
        />
      </div>

      <div>
        <label htmlFor="team-phone" className="block text-sm font-semibold text-slate-700 mb-2">
          Telefoonnummer <span className="text-slate-400">(optioneel)</span>
        </label>
        <input
          type="tel"
          id="team-phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 outline-none transition-all"
          placeholder="06-12345678"
        />
      </div>

      <div>
        <label htmlFor="team-message" className="block text-sm font-semibold text-slate-700 mb-2">
          Bericht <span className="text-slate-400">(optioneel)</span>
        </label>
        <textarea
          id="team-message"
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 outline-none transition-all resize-none"
          placeholder="Waarom wil je meedoen? Of laat een vraag achter..."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
        style={{backgroundColor: color}}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colorHover)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = color)}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Bezig met aanmelden...
          </>
        ) : (
          `Meld je aan voor het ${teamName}`
        )}
      </button>
    </form>
  )
}
