'use client'

import {useEffect, useState} from 'react'
import {notFound, useParams} from 'next/navigation'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import PhotoGrid from '@/app/components/PhotoGrid'
import {client} from '@/lib/sanity.client'
import {Calendar} from 'lucide-react'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

// Query supports bulk uploaded images with inline adjustments
const galleryQuery = `*[_type == "gallery" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  date,
  description,
  coverImage {
    asset-> {
      _id,
      url
    },
    alt
  },
  images[] {
    _key,
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    hotspot,
    crop,
    alt,
    caption,
    brightness,
    contrast,
    saturation,
    grayscale,
    sepia
  }
}`

// Helper to generate CSS filter string from image adjustments
function getImageFilter(img: any): string {
  const filters: string[] = []
  
  if (img.brightness && img.brightness !== 100) {
    filters.push(`brightness(${img.brightness / 100})`)
  }
  if (img.contrast && img.contrast !== 100) {
    filters.push(`contrast(${img.contrast / 100})`)
  }
  if (img.saturation && img.saturation !== 100) {
    filters.push(`saturate(${img.saturation / 100})`)
  }
  if (img.grayscale) {
    filters.push('grayscale(1)')
  }
  if (img.sepia) {
    filters.push('sepia(0.8)')
  }
  
  return filters.length > 0 ? filters.join(' ') : 'none'
}

export default function GalleryDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [gallery, setGallery] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    if (!slug) return

    client
      .fetch(galleryQuery, {slug})
      .then((data) => {
        if (!data) {
          notFound()
        }
        setGallery(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!gallery) {
    notFound()
  }

  const formattedDate = new Date(gallery.date).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Process images with their adjustments - use urlFor to apply crop/hotspot
  const photos = gallery.images?.map((img: any) => ({
    url: img.asset ? urlFor(img).width(800).fit('max').auto('format').url() : null,
    alt: img.alt || '',
    caption: img.caption,
    width: img.asset?.metadata?.dimensions?.width,
    height: img.asset?.metadata?.dimensions?.height,
    filter: getImageFilter(img),
  })).filter((p: any) => p.url) || []

  // Use full-size images for lightbox
  const lightboxSlides = gallery.images?.map((img: any) => ({
    src: img.asset ? urlFor(img).width(1920).fit('max').auto('format').url() : '',
    alt: img.alt || '',
    width: img.asset?.metadata?.dimensions?.width,
    height: img.asset?.metadata?.dimensions?.height,
  })).filter((s: any) => s.src) || []

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs
          items={[
            {label: "Foto's", href: '/fotos'},
            {label: gallery.title},
          ]}
        />

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {gallery.title}
          </h1>

          <div className="flex items-center text-gray-600 mb-4">
            <Calendar className="h-5 w-5 mr-2" aria-hidden="true" />
            <time dateTime={gallery.date}>{formattedDate}</time>
            <span className="mx-3">•</span>
            <span>{photos.length} foto{photos.length !== 1 ? "'s" : ''}</span>
          </div>

          {gallery.description && (
            <p className="text-lg text-gray-700">{gallery.description}</p>
          )}
        </header>

        {/* Photo Grid */}
        {photos.length > 0 ? (
          <PhotoGrid photos={photos} onPhotoClick={handlePhotoClick} />
        ) : (
          <div className="bg-gray-100 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">
              Dit album bevat nog geen foto's.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
      />
    </>
  )
}
