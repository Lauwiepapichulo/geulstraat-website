'use client'

import Image from 'next/image'
import {motion, useInView} from 'framer-motion'
import {useRef} from 'react'

interface TimelineEvent {
  year: string
  title: string
  description?: string
  imageUrl?: string
}

interface TimelineSectionProps {
  title?: string
  events: TimelineEvent[]
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

export default function TimelineSection({
  title,
  events,
  backgroundColor = 'white',
  textAlign = 'left',
  padding = 'normal',
}: TimelineSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const bgClass = bgClasses[backgroundColor] || bgClasses.white
  const textColor = textColorClasses[backgroundColor] || textColorClasses.white
  const paddingClass = paddingClasses[padding] || paddingClasses.normal
  const isDark = backgroundColor === 'dark'

  return (
    <section ref={ref} className={`${bgClass} ${paddingClass}`}>
      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {title && (
          <h2 className={`text-3xl md:text-4xl font-bold mb-14 tracking-tight text-${textAlign} ${textColor}`}>
            {title}
          </h2>
        )}

        <div className="relative">
          {/* Vertical line */}
          <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-px ${isDark ? 'bg-[#3B82A0]/40' : 'bg-[#1E3A5F]/20'} transform md:-translate-x-1/2`} />

          {/* Events */}
          <div className="space-y-16">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-start md:items-center gap-8`}
              >
                {/* Dot */}
                <div className={`absolute left-4 md:left-1/2 w-3 h-3 rounded-full ${isDark ? 'bg-[#3B82A0]' : 'bg-[#1E3A5F]'} transform -translate-x-1/2 ring-4 ${isDark ? 'ring-slate-800' : 'ring-white'} z-10`} />

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-14 md:text-right' : 'md:pl-14 md:text-left'}`}>
                  <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-3 ${isDark ? 'bg-[#1E3A5F] text-[#3B82A0]' : 'bg-[#1E3A5F]/10 text-[#1E3A5F]'}`}>
                    {event.year}
                  </div>
                  <h3 className={`text-xl md:text-2xl font-bold mb-3 tracking-tight ${textColor}`}>
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {event.description}
                    </p>
                  )}
                </div>

                {/* Image (if provided) */}
                {event.imageUrl && (
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-14' : 'md:pr-14'}`}>
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-[0_8px_30px_-8px_rgba(30,58,95,0.15)] ring-1 ring-black/5">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
