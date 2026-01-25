'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TocItem {
  id: string
  title: string
  type: string
}

interface TableOfContentsProps {
  items: TocItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show TOC after scrolling past the hero
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    // Intersection Observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -60% 0%',
        threshold: 0
      }
    )

    // Observe all sections
    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [items])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (items.length < 2) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="hidden xl:block fixed left-8 top-1/2 -translate-y-1/2 z-40 max-w-[200px]"
        >
          <nav className="relative">
            {/* Decorative line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
            
            <div className="pl-4 space-y-1">
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-3">
                Inhoud
              </span>
              
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`
                    block w-full text-left text-xs py-1.5 transition-all duration-200
                    hover:text-[#1E3A5F]
                    ${activeId === item.id 
                      ? 'text-[#1E3A5F] font-medium' 
                      : 'text-slate-400'
                    }
                  `}
                >
                  <span className="line-clamp-2">{item.title}</span>
                </button>
              ))}
            </div>

            {/* Active indicator */}
            <motion.div
              className="absolute left-0 w-px h-4 bg-[#1E3A5F]"
              layoutId="activeIndicator"
              initial={false}
              animate={{
                top: items.findIndex(i => i.id === activeId) * 28 + 40,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
