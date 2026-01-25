'use client'

import Image from 'next/image'
import {useState} from 'react'

interface Photo {
  url: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  filter?: string // CSS filter string for image adjustments
}

interface PhotoGridProps {
  photos: Photo[]
  onPhotoClick?: (index: number) => void
}

export default function PhotoGrid({photos, onPhotoClick}: PhotoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <button
          key={index}
          onClick={() => onPhotoClick?.(index)}
          className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 group cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/50"
          aria-label={photo.alt || `Foto ${index + 1}`}
        >
          <Image
            src={photo.url}
            alt={photo.alt || 'Foto'}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{
              filter: photo.filter && photo.filter !== 'none' ? photo.filter : undefined,
            }}
            unoptimized
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          
          {/* Caption */}
          {photo.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-medium">{photo.caption}</p>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
