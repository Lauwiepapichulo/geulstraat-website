'use client'

import Image from 'next/image'
import {motion, useInView} from 'framer-motion'
import {useRef} from 'react'

interface QuoteSectionProps {
  quote: string
  author?: string
  authorRole?: string
  imageUrl?: string
  style?: 'simple' | 'decorative' | 'boxed'
  backgroundColor?: string
  textAlign?: 'left' | 'center' | 'right'
  padding?: 'compact' | 'normal' | 'spacious'
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-[#F8F9FA]',
  emerald: 'bg-[#1E3A5F]/5',
  beige: 'bg-gradient-to-br from-slate-50 to-slate-100',
  dark: 'bg-slate-900',
}

const textColorClasses: Record<string, string> = {
  white: 'text-slate-800',
  gray: 'text-slate-800',
  emerald: 'text-slate-800',
  beige: 'text-slate-800',
  dark: 'text-white',
}

const paddingClasses: Record<string, string> = {
  compact: 'py-10 md:py-14',
  normal: 'py-14 md:py-20',
  spacious: 'py-20 md:py-28',
}

export default function QuoteSection({
  quote,
  author,
  authorRole,
  imageUrl,
  style = 'simple',
  backgroundColor = 'white',
  textAlign = 'center',
  padding = 'normal',
}: QuoteSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const bgClass = bgClasses[backgroundColor] || bgClasses.white
  const textColor = textColorClasses[backgroundColor] || textColorClasses.white
  const paddingClass = paddingClasses[padding] || paddingClasses.normal
  const isDark = backgroundColor === 'dark'

  // Simple elegant quote with subtle styling
  if (style === 'simple') {
    return (
      <section ref={ref} className={`${bgClass} ${paddingClass}`}>
        <motion.div 
          className={`max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 text-${textAlign}`}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <blockquote className={`border-l-2 ${isDark ? 'border-[#3B82A0]/40' : 'border-[#1E3A5F]/20'} pl-4`}>
            <p className={`text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {quote}
            </p>
          </blockquote>

          {(author || imageUrl) && (
            <div className={`mt-6 flex items-center ${textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'} gap-3 pl-5`}>
              {imageUrl && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-black/5">
                  <Image
                    src={imageUrl}
                    alt={author || 'Auteur'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className={textAlign === 'center' && !imageUrl ? 'text-center' : ''}>
                {author && (
                  <cite className={`not-italic text-sm font-medium ${textColor}`}>
                    {author}
                  </cite>
                )}
                {authorRole && (
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {authorRole}
                  </p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </section>
    )
  }

  // Decorative quote with elegant left border
  if (style === 'decorative') {
    return (
      <section ref={ref} className={`${bgClass} ${paddingClass}`}>
        <motion.div 
          className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={`border-l-2 ${isDark ? 'border-[#3B82A0]/60' : 'border-[#1E3A5F]/30'} pl-4`}>
            <blockquote className={`text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {quote}
            </blockquote>

            {(author || imageUrl) && (
              <div className="mt-5 flex items-center gap-3">
                {imageUrl && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-black/5">
                    <Image
                      src={imageUrl}
                      alt={author || 'Auteur'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  {author && (
                    <cite className={`not-italic text-sm font-medium ${textColor}`}>
                      {author}
                    </cite>
                  )}
                  {authorRole && (
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {authorRole}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    )
  }

  // Boxed quote with card styling
  return (
    <section ref={ref} className={`${bgClass} ${paddingClass}`}>
      <motion.div 
        className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} rounded-lg p-5 md:p-6 text-${textAlign}`}>
          <blockquote>
            <p className={`text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {quote}
            </p>
          </blockquote>

          {(author || imageUrl) && (
            <div className={`mt-5 flex items-center ${textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'} gap-3`}>
              {imageUrl && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-black/5">
                  <Image
                    src={imageUrl}
                    alt={author || 'Auteur'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className={textAlign === 'center' && !imageUrl ? 'text-center' : ''}>
                {author && (
                  <cite className={`not-italic text-sm font-medium ${textColor}`}>
                    {author}
                  </cite>
                )}
                {authorRole && (
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {authorRole}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  )
}
