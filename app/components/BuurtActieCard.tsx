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
  slug
}: BuurtActieCardProps) {
  const formattedDate = new Date(datetime).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const formattedTime = new Date(datetime).toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative h-56 bg-gradient-to-br from-violet-500 to-purple-500 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-6xl">
            🎉
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date & Location */}
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex items-center text-sm text-slate-600">
            <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
            <span className="font-medium">{formattedDate} • {formattedTime}</span>
          </div>
          {location && (
            <div className="flex items-center text-sm text-slate-600">
              <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <Link href={`/buurt-acties/${slug}`}>
          <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 hover:text-emerald-600 transition-colors">
            {title}
          </h3>
        </Link>

        {/* Description */}
        {description && (
          <p className="text-slate-600 text-base line-clamp-3 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {signupLink ? (
            <>
              <a
                href={signupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105 min-h-[44px]"
              >
                Doe mee
              </a>
              <Link
                href={`/buurt-acties/${slug}`}
                className="flex-1 inline-flex items-center justify-center border-2 border-slate-200 hover:border-emerald-600 text-slate-700 hover:text-emerald-600 font-semibold px-6 py-3 rounded-lg transition-colors min-h-[44px]"
              >
                Meer info
              </Link>
            </>
          ) : (
            <Link
              href={`/buurt-acties/${slug}`}
              className="w-full inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all hover:scale-105 min-h-[44px]"
            >
              Meer informatie
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
