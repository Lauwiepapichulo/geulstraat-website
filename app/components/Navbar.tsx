'use client'

import Link from 'next/link'
import Image from 'next/image'
import {useState, useEffect, useRef} from 'react'
import {usePathname} from 'next/navigation'
import {Menu, X} from 'lucide-react'
import {motion, AnimatePresence, useScroll, useMotionValueEvent} from 'framer-motion'

interface NavbarProps {
  logoUrl?: string
  siteName?: string
}

export default function Navbar({logoUrl, siteName = "Buurtplatform"}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const lastScrollY = useRef(0)

  const navItems = [
    {href: '/', label: 'Home'},
    {href: '/over-de-buurt', label: 'Over de buurt'},
    {href: '/nieuws', label: 'Nieuws'},
    {href: '/buurt-acties', label: 'Buurt acties'},
    {href: '/over-ons', label: 'Over ons'},
    {href: '/contact', label: 'Contact'},
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Handle scroll behavior - hide on scroll down, show on scroll up
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const direction = latest > lastScrollY.current ? 'down' : 'up'
    
    if (latest > 80) {
      setIsScrolled(true)
      if (direction === 'down' && latest > 150) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }
    } else {
      setIsScrolled(false)
      setIsHidden(false)
    }
    
    lastScrollY.current = latest
  })

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isHidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-500
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo/Brand */}
          <Link 
            href="/" 
            className={`flex items-center space-x-3 font-bold text-xl md:text-2xl transition-colors duration-300 ${
              isScrolled 
                ? 'text-slate-800 hover:text-[#1E3A5F]' 
                : 'text-white hover:text-white/80 drop-shadow-md'
            }`}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 min-h-[44px] flex items-center whitespace-nowrap
                  ${isScrolled
                    ? isActive(item.href) 
                      ? 'text-[#1E3A5F] bg-[#1E3A5F]/10' 
                      : 'text-slate-600 hover:text-[#1E3A5F] hover:bg-slate-100'
                    : isActive(item.href)
                      ? 'text-white bg-white/20'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className={`absolute bottom-1 left-4 right-4 h-0.5 rounded-full ${isScrolled ? 'bg-[#1E3A5F]' : 'bg-white'}`}
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
            className={`md:hidden inline-flex items-center justify-center p-2 rounded-lg transition-all duration-300 min-h-[44px] min-w-[44px] ${
              isScrolled 
                ? 'text-slate-600 hover:text-[#1E3A5F] hover:bg-slate-100' 
                : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Sluit menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`md:hidden overflow-hidden ${!isScrolled ? 'bg-white/95 backdrop-blur-md rounded-b-2xl mt-2 mx-2 shadow-lg' : ''}`}
            >
              <div className={`flex flex-col space-y-1 py-4 ${isScrolled ? 'border-t border-slate-100' : 'px-2'}`}>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={`
                        px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 block min-h-[44px]
                        ${isActive(item.href)
                          ? 'bg-[#1E3A5F]/10 text-[#1E3A5F]'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-[#1E3A5F]'
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
