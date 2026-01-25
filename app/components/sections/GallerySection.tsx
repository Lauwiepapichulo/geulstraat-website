'use client'

import Image from 'next/image'
import {useState, useRef} from 'react'
import {motion, useInView, AnimatePresence} from 'framer-motion'

interface GalleryImage {
  url: string
  alt?: string
  caption?: string
}

interface GallerySectionProps {
  title?: string
  images: GalleryImage[]
  columns?: 2 | 3 | 4
  showCaptions?: boolean
  backgroundColor?: string
  textAlign?: 'left' | 'center' | 'right'
  padding?: 'compact' | 'normal' | 'spacious'
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-[#F8F9FA]',
  emerald: 'bg-[#1E3A5F]/5',
  beige: 'bg-slate-50',
  dark: 'bg-slate-800',
}

const textColorClasses: Record<string, string> = {
  white: 'text-slate-900',
  gray: 'text-slate-900',
  emerald: 'text-slate-900',
  beige: 'text-slate-900',
  dark: 'text-white',
}

const paddingClasses: Record<string, string> = {
  compact: 'py-10 md:py-14',
  normal: 'py-14 md:py-20',
  spacious: 'py-20 md:py-28',
}

const columnClasses: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
}

export default function GallerySection({
  title,
  images,
  columns = 3,
  showCaptions = false,
  backgroundColor = 'white',
  textAlign = 'center',
  padding = 'normal',
}: GallerySectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const bgClass = bgClasses[backgroundColor] || bgClasses.white
  const textColor = textColorClasses[backgroundColor] || textColorClasses.white
  const paddingClass = paddingClasses[padding] || paddingClasses.normal
  const gridClass = columnClasses[columns] || columnClasses[3]
  const isDark = backgroundColor === 'dark'

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const validImages = images.filter(img => img.url && img.url.startsWith('http'))

  return (
    <>
      <section ref={ref} className={`${bgClass} ${paddingClass}`}>
        <motion.div 
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {title && (
            <h2 className={`text-3xl md:text-4xl font-bold mb-10 tracking-tight text-${textAlign} ${textColor}`}>
              {title}
            </h2>
          )}

          {validImages.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
                <span className="text-3xl">📷</span>
              </div>
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Voeg foto's toe in Sanity Studio
              </p>
            </div>
          ) : (
            <div className={`grid ${gridClass} gap-5`}>
              {validImages.map((image, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-square overflow-hidden rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1E3A5F]/30 shadow-[0_4px_20px_-4px_rgba(30,58,95,0.1)] ring-1 ring-black/5"
                >
                  <Image
                    src={image.url}
                    alt={image.alt || 'Afbeelding'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${100 / columns}vw`}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  
                  {showCaptions && image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm">{image.caption}</p>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 text-white/80 hover:text-white text-4xl transition-colors z-10"
              aria-label="Sluiten"
            >
              ×
            </button>
            
            {/* Previous button */}
            {validImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
                }}
                className="absolute left-6 text-white/80 hover:text-white text-5xl transition-colors"
                aria-label="Vorige"
              >
                ‹
              </button>
            )}

            <motion.div 
              className="relative max-w-5xl max-h-[85vh] w-full h-full" 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={validImages[lightboxIndex].url}
                alt={validImages[lightboxIndex].alt || 'Afbeelding'}
                fill
                className="object-contain"
                sizes="100vw"
                unoptimized
              />
            </motion.div>

            {/* Next button */}
            {validImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))
                }}
                className="absolute right-6 text-white/80 hover:text-white text-5xl transition-colors"
                aria-label="Volgende"
              >
                ›
              </button>
            )}

            {/* Caption */}
            {validImages[lightboxIndex].caption && (
              <div className="absolute bottom-6 left-0 right-0 text-center text-white/90">
                <p className="text-lg">{validImages[lightboxIndex].caption}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
