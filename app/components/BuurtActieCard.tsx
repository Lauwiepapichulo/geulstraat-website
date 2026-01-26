'use client'

import Link from 'next/link'
import Image from 'next/image'
import {motion} from 'framer-motion'
import {Calendar, MapPin} from 'lucide-react'

interface BuurtActieCardProps {
  title: string
  description?: string
  imageUrl?: string
  imageAlt?: string
  datetime: string
  location?: string
  signupLink?: string
  acceptsRegistrations?: boolean
  slug: string
}

export default function BuurtActieCard({
  title,
  description,
  imageUrl,
  imageAlt = "Buurt actie image",
  datetime,
  location,
  signupLink,
  acceptsRegistrations = true,
  slug
}: BuurtActieCardProps) {
  const formattedDate = new Date(datetime).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <motion.div
      whileHover={{ 
        y: -6, 
        boxShadow: "0 12px 28px -8px rgb(30 58 95 / 0.15), 0 4px 12px -4px rgb(30 58 95 / 0.06)" 
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60 flex flex-col h-full group"
    >
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-[#3B82A0] to-[#5B7C99] overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || title || "Buurt actie afbeelding"}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/90 text-5xl">
            🎉
          </div>
        )}
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Date & Location */}
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="w-4 h-4 mr-2 text-[#1E3A5F]" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          {location && (
            <div className="flex items-center text-sm text-slate-500">
              <MapPin className="w-4 h-4 mr-2 text-[#1E3A5F]" />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <Link href={`/buurt-acties/${slug}`}>
          <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 hover:text-[#1E3A5F] transition-colors duration-300">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-slate-600 text-base line-clamp-3 leading-relaxed flex-grow">
          {description || ''}
        </p>

        {/* Action button - always at bottom */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          {signupLink ? (
            <a
              href={signupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center bg-[#1E3A5F] hover:bg-[#152B47] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg min-h-[44px]"
            >
              Doe mee
            </a>
          ) : (
            <Link
              href={`/buurt-acties/${slug}`}
              className="w-full inline-flex items-center justify-center bg-[#1E3A5F] hover:bg-[#152B47] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg min-h-[44px]"
            >
              {acceptsRegistrations ? 'Doe mee' : 'Meer informatie'}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
