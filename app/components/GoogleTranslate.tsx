'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string
            includedLanguages?: string
            layout?: number
            autoDisplay?: boolean
          },
          elementId: string
        ) => void
      }
    }
  }
}

interface GoogleTranslateProps {
  isScrolled?: boolean
}

export default function GoogleTranslate({ isScrolled = false }: GoogleTranslateProps) {
  const [currentLang, setCurrentLang] = useState<'nl' | 'en'>('nl')

  useEffect(() => {
    // Check if already translated to English
    const checkCurrentLanguage = () => {
      const htmlLang = document.documentElement.lang
      const hasGoogleClass = document.documentElement.classList.contains('translated-ltr')
      if (hasGoogleClass || htmlLang === 'en') {
        setCurrentLang('en')
      } else {
        setCurrentLang('nl')
      }
    }
    
    checkCurrentLanguage()
    
    // Only load Google Translate script once
    if (window.google?.translate) return

    // Define the callback function
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'nl',
            includedLanguages: 'en,nl',
            layout: 0,
            autoDisplay: false,
          },
          'google_translate_element'
        )
      }
    }

    // Load the Google Translate script
    const script = document.createElement('script')
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  const switchLanguage = (lang: 'nl' | 'en') => {
    setCurrentLang(lang)
    
    // Find and trigger the Google Translate dropdown
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
    if (select) {
      select.value = lang === 'en' ? 'en' : 'nl'
      select.dispatchEvent(new Event('change'))
    }
    
    // If switching to Dutch, we need to click "Show original"
    if (lang === 'nl') {
      // Try to restore original
      const frame = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement
      if (frame?.contentDocument) {
        const restoreBtn = frame.contentDocument.querySelector('.goog-te-button button') as HTMLButtonElement
        if (restoreBtn) restoreBtn.click()
      }
      // Alternative: set cookie to restore
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname
      // Reload to show original
      window.location.reload()
    }
  }

  return (
    <>
      {/* Hidden Google Translate element */}
      <div 
        id="google_translate_element" 
        style={{ display: 'none', position: 'absolute', left: '-9999px' }}
      />
      
      {/* Custom language switcher with flags */}
      <div className="flex items-center space-x-1">
        <button
          onClick={() => switchLanguage('nl')}
          className={`p-1.5 rounded-md transition-all duration-200 ${
            currentLang === 'nl' 
              ? 'ring-2 ring-offset-1 ' + (isScrolled ? 'ring-[#1E3A5F]' : 'ring-white') 
              : 'opacity-60 hover:opacity-100'
          }`}
          aria-label="Nederlands"
          title="Nederlands"
        >
          <span className="text-lg">🇳🇱</span>
        </button>
        <button
          onClick={() => switchLanguage('en')}
          className={`p-1.5 rounded-md transition-all duration-200 ${
            currentLang === 'en' 
              ? 'ring-2 ring-offset-1 ' + (isScrolled ? 'ring-[#1E3A5F]' : 'ring-white') 
              : 'opacity-60 hover:opacity-100'
          }`}
          aria-label="English"
          title="English"
        >
          <span className="text-lg">🇬🇧</span>
        </button>
      </div>
    </>
  )
}
