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
    // Check DOM class (most reliable indicator)
    const hasGoogleClass = document.documentElement.classList.contains('translated-ltr')
    
    // Check for translated body class
    const bodyTranslated = document.body.classList.contains('translated-ltr')
    
    // Check googtrans cookie
    const googtransCookie = document.cookie.split(';').find(c => c.trim().startsWith('googtrans='))
    const cookieHasEnglish = googtransCookie && googtransCookie.includes('/en')
    
    // Check if Google Translate frame exists and is active
    const translateFrame = document.querySelector('.goog-te-banner-frame')
    
    if (hasGoogleClass || bodyTranslated || cookieHasEnglish) {
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
    // Check if we came from a "reset to Dutch" action
    const url = new URL(window.location.href)
    const noTranslate = url.searchParams.has('_notranslate')
    
    if (noTranslate) {
      // Remove the parameter from URL without reload
      url.searchParams.delete('_notranslate')
      window.history.replaceState({}, '', url.toString())
      
      // Force Dutch state
      setCurrentLang('nl')
      
      // Clear any remaining cookies one more time
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`
    } else {
      checkCurrentLanguage()
    }
    
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
        setTimeout(() => {
          checkCurrentLanguage()
          setIsLoading(false)
        }, 1000)
      } else {
        document.cookie = 'googtrans=/nl/en; path=/'
        document.cookie = `googtrans=/nl/en; path=/; domain=.${window.location.hostname}`
        setIsLoading(false)
        window.location.reload()
      }
    }
    
    // If switching to Dutch (restore original)
    if (lang === 'nl') {
      // Clear ALL possible googtrans cookies on all domains
      const hostname = window.location.hostname
      const domainParts = hostname.split('.')
      
      // Build list of all possible cookie domains
      const domains = ['', hostname, `.${hostname}`]
      if (domainParts.length >= 2) {
        const parentDomain = domainParts.slice(-2).join('.')
        domains.push(parentDomain, `.${parentDomain}`)
      }
      if (domainParts.length >= 3) {
        const grandparentDomain = domainParts.slice(-3).join('.')
        domains.push(grandparentDomain, `.${grandparentDomain}`)
      }
      
      // Clear cookies on all domains and paths
      domains.forEach(domain => {
        const domainPart = domain ? `; domain=${domain}` : ''
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${domainPart}`
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${window.location.pathname}${domainPart}`
      })
      
      // Also try to remove via setting to empty/null values
      document.cookie = 'googtrans=/nl/nl; path=/'
      
      // Force a clean reload by navigating to URL without any translation state
      // Adding a timestamp parameter forces browser to fetch fresh content
      const url = new URL(window.location.href)
      url.searchParams.set('_notranslate', Date.now().toString())
      window.location.href = url.toString()
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
