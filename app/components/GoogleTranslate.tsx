'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'

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
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [loadError, setLoadError] = useState(false)

  // Check current language from cookies/DOM
  const checkCurrentLanguage = useCallback(() => {
    const hasGoogleClass = document.documentElement.classList.contains('translated-ltr')
    const googtransCookie = document.cookie.split(';').find(c => c.trim().startsWith('googtrans='))
    
    if (hasGoogleClass || (googtransCookie && googtransCookie.includes('/en'))) {
      setCurrentLang('en')
    } else {
      setCurrentLang('nl')
    }
  }, [])

  // Wait for Google Translate to be ready
  const waitForGoogleTranslate = useCallback((maxAttempts = 20): Promise<boolean> => {
    return new Promise((resolve) => {
      let attempts = 0
      const check = () => {
        attempts++
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
        if (select) {
          resolve(true)
        } else if (attempts >= maxAttempts) {
          resolve(false)
        } else {
          setTimeout(check, 250)
        }
      }
      check()
    })
  }, [])

  useEffect(() => {
    checkCurrentLanguage()
    
    // If already loaded, just mark as ready
    if (window.google?.translate) {
      waitForGoogleTranslate(10).then(ready => {
        setIsReady(ready)
        if (!ready) setLoadError(true)
      })
      return
    }

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
        
        // Wait for the widget to be ready
        waitForGoogleTranslate().then(ready => {
          setIsReady(ready)
          if (!ready) setLoadError(true)
        })
      }
    }

    // Load the Google Translate script
    const existingScript = document.querySelector('script[src*="translate.google.com"]')
    if (existingScript) {
      // Script exists, wait for it to initialize
      waitForGoogleTranslate().then(ready => {
        setIsReady(ready)
        if (!ready) setLoadError(true)
      })
      return
    }

    const script = document.createElement('script')
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    script.onerror = () => {
      setLoadError(true)
      console.warn('Google Translate kon niet worden geladen')
    }
    document.body.appendChild(script)

    // Set a timeout for loading
    const timeout = setTimeout(() => {
      if (!isReady) {
        setLoadError(true)
      }
    }, 10000) // 10 second timeout

    return () => {
      clearTimeout(timeout)
    }
  }, [checkCurrentLanguage, waitForGoogleTranslate, isReady])

  // Observe DOM changes to detect when translation happens
  useEffect(() => {
    const observer = new MutationObserver(() => {
      checkCurrentLanguage()
      setIsLoading(false)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'lang']
    })

    return () => observer.disconnect()
  }, [checkCurrentLanguage])

  const switchLanguage = async (lang: 'nl' | 'en') => {
    if (isLoading) return
    if (lang === currentLang) return
    
    setIsLoading(true)

    // If switching to English
    if (lang === 'en') {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
      if (select) {
        select.value = 'en'
        select.dispatchEvent(new Event('change'))
        // Update state after a short delay
        setTimeout(() => {
          checkCurrentLanguage()
          setIsLoading(false)
        }, 1000)
      } else {
        // Fallback: try to reload with cookie
        document.cookie = 'googtrans=/nl/en; path=/'
        document.cookie = `googtrans=/nl/en; path=/; domain=.${window.location.hostname}`
        setIsLoading(false)
        window.location.reload()
      }
    }
    
    // If switching to Dutch (restore original)
    if (lang === 'nl') {
      // Clear the translation cookies
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`
      
      // Try to click the restore button in the Google Translate banner
      const frame = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement
      if (frame?.contentDocument) {
        const restoreBtn = frame.contentDocument.querySelector('.goog-te-button button') as HTMLButtonElement
        if (restoreBtn) {
          restoreBtn.click()
          setTimeout(() => {
            checkCurrentLanguage()
            setIsLoading(false)
          }, 500)
          return
        }
      }
      
      // Fallback: reload the page
      setIsLoading(false)
      window.location.reload()
    }
  }

  // If there was an error loading, show disabled state with tooltip
  if (loadError) {
    return (
      <div className="flex items-center space-x-1" title="Vertaling niet beschikbaar">
        <button
          disabled
          className="p-1.5 rounded-md opacity-40 cursor-not-allowed"
          aria-label="Nederlands"
        >
          <span className="text-lg">🇳🇱</span>
        </button>
        <button
          disabled
          className="p-1.5 rounded-md opacity-40 cursor-not-allowed"
          aria-label="English"
        >
          <span className="text-lg">🇬🇧</span>
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Hidden Google Translate element */}
      <div 
        id="google_translate_element" 
        style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
        aria-hidden="true"
      />
      
      {/* Custom language switcher with flags */}
      <div className="flex items-center space-x-1">
        <button
          onClick={() => switchLanguage('nl')}
          disabled={isLoading || !isReady}
          className={`p-1.5 rounded-md transition-all duration-200 ${
            currentLang === 'nl' 
              ? 'ring-2 ring-offset-1 ' + (isScrolled ? 'ring-[#1E3A5F]' : 'ring-white') 
              : 'opacity-60 hover:opacity-100'
          } ${(isLoading || !isReady) ? 'cursor-wait' : ''}`}
          aria-label="Nederlands"
          title="Nederlands"
        >
          {isLoading && currentLang === 'en' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="text-lg">🇳🇱</span>
          )}
        </button>
        <button
          onClick={() => switchLanguage('en')}
          disabled={isLoading || !isReady}
          className={`p-1.5 rounded-md transition-all duration-200 ${
            currentLang === 'en' 
              ? 'ring-2 ring-offset-1 ' + (isScrolled ? 'ring-[#1E3A5F]' : 'ring-white') 
              : 'opacity-60 hover:opacity-100'
          } ${(isLoading || !isReady) ? 'cursor-wait' : ''}`}
          aria-label="English"
          title={!isReady ? 'Laden...' : 'English'}
        >
          {isLoading && currentLang === 'nl' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="text-lg">🇬🇧</span>
          )}
        </button>
      </div>
    </>
  )
}
