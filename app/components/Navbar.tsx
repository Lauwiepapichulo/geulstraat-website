'use client'

import Link from 'next/link'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import {usePathname} from 'next/navigation'
import {Menu, X} from 'lucide-react'
import {motion, AnimatePresence} from 'framer-motion'

interface NavbarProps {
  logoUrl?: string
  siteName?: string
}

export default function Navbar({logoUrl, siteName = "Buurtplatform"}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    {href: '/', label: 'Home'},
    {href: '/over-de-buurt', label: 'Over de buurt'},
    {href: '/nieuws', label: 'Laatste nieuws'},
    {href: '/buurt-acties', label: 'Buurt acties'},
    {href: '/over-ons', label: 'Over ons'},
    {href: '/contact', label: 'Contact'},
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo/Brand */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 font-bold text-xl md:text-2xl text-slate-900 hover:text-emerald-600 transition-colors"
          >
            {logoUrl ? (
              <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Image
                  src={logoUrl}
                  alt={`${siteName} logo`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <span className="text-2xl">🏘️</span>
            )}
            <span>{siteName}</span>
          </Link>

          {/* Desktop Navigation - Always visible, no hamburger */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative px-3 py-2 rounded-lg text-sm lg:text-base font-medium transition-colors min-h-[44px] flex items-center whitespace-nowrap
                  ${isActive(item.href) 
                    ? 'text-emerald-600' 
                    : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                  }
                `}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-colors min-h-[44px] min-w-[44px]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Sluit menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-1 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      px-4 py-3 rounded-lg text-base font-medium transition-colors block min-h-[44px]
                      ${isActive(item.href)
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-600'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
