'use client'

import Link from 'next/link'
import Image from 'next/image'
import {motion} from 'framer-motion'

interface NewsCardProps {
  title: string
  excerpt?: string
  imageUrl?: string
  imageAlt?: string
  publishedAt: string
  slug: string
}

export default function NewsCard({
  title,
  excerpt,
  imageUrl,
  imageAlt = "News image",
  publishedAt,
  slug
}: NewsCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
    >
      <Link href={`/nieuws/${slug}`} className="block">
        {/* Image */}
        <div className="relative h-56 bg-gradient-to-br from-blue-500 to-indigo-500 overflow-hidden">
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
              📰
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Date */}
          <time className="text-sm text-slate-500 font-medium">
            {formattedDate}
          </time>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-slate-600 text-base line-clamp-3 mb-4 leading-relaxed">
              {excerpt}
            </p>
          )}

          {/* Read more button */}
          <div className="flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
            <span>Lees meer</span>
            <svg
              className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
