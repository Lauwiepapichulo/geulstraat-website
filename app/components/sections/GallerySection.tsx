'use client'

import Image from 'next/image'
import {useState} from 'react'

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
  gray: 'bg-slate-100',
  emerald: 'bg-emerald-50',
  beige: 'bg-amber-50',
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
  compact: 'py-8 md:py-12',
  normal: 'py-12 md:py-16',
  spacious: 'py-16 md:py-24',
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

  const bgClass = bgClasses[backgroundColor] || bgClasses.white
  const textColor = textColorClasses[backgroundColor] || textColorClasses.white
  const paddingClass = paddingClasses[padding] || paddingClasses.normal
  const gridClass = columnClasses[columns] || columnClasses[3]
  const isDark = backgroundColor === 'dark'

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <section className={`${bgClass} ${paddingClass}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {title && (
            <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-${textAlign} ${textColor}`}>
              {title}
            </h2>
          )}

          {images.filter(img => img.url && img.url.startsWith('http')).length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 mb-4">
                <span className="text-2xl">📷</span>
              </div>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Voeg foto's toe in Sanity Studio
              </p>
            </div>
          ) : (
            <div className={`grid ${gridClass} gap-4`}>
              {images.filter(img => img.url && img.url.startsWith('http')).map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
              >
                <Image
                  src={image.url}
                  alt={image.alt || 'Afbeelding'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${100 / columns}vw`}
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                
                {showCaptions && image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
              </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Simple Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
            aria-label="Sluiten"
          >
            ×
          </button>
          
          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
              }}
              className="absolute left-4 text-white text-4xl hover:text-gray-300 transition-colors"
              aria-label="Vorige"
            >
              ‹
            </button>
          )}

          <div className="relative max-w-5xl max-h-[80vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt || 'Afbeelding'}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized
            />
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
              }}
              className="absolute right-4 text-white text-4xl hover:text-gray-300 transition-colors"
              aria-label="Volgende"
            >
              ›
            </button>
          )}

          {/* Caption */}
          {images[lightboxIndex].caption && (
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <p>{images[lightboxIndex].caption}</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
