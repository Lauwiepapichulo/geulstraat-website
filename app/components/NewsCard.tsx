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
      whileHover={{ 
        y: -6, 
        boxShadow: "0 12px 28px -8px rgb(30 58 95 / 0.15), 0 4px 12px -4px rgb(30 58 95 / 0.06)" 
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60 h-full flex flex-col group"
    >
      <Link href={`/nieuws/${slug}`} className="block flex-grow flex flex-col">
        {/* Image */}
        <div className="relative h-52 bg-gradient-to-br from-[#1E3A5F] to-[#3B82A0] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt || title || "Nieuws afbeelding"}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/90 text-5xl">
              📰
            </div>
          )}
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Date */}
          <time className="text-sm text-slate-500 font-medium tracking-wide">
            {formattedDate}
          </time>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-800 mt-2 mb-3 line-clamp-2 group-hover:text-[#1E3A5F] transition-colors duration-300">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-slate-600 text-base line-clamp-3 leading-relaxed flex-grow">
            {excerpt || ''}
          </p>

          {/* Read more button */}
          <div className="flex items-center text-[#1E3A5F] font-semibold mt-4 pt-4 border-t border-slate-100">
            <span>Lees meer</span>
            <svg
              className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
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
