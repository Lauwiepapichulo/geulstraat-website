'use client'

import Link from 'next/link'
import {motion, useInView} from 'framer-motion'
import {useRef} from 'react'

interface Card {
  icon?: string
  title: string
  description?: string
  link?: string
}

interface CardsSectionProps {
  title?: string
  subtitle?: string
  cards: Card[]
  columns?: 2 | 3 | 4
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
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export default function CardsSection({
  title,
  subtitle,
  cards,
  columns = 3,
  backgroundColor = 'white',
  textAlign = 'center',
  padding = 'normal',
}: CardsSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const bgClass = bgClasses[backgroundColor] || bgClasses.white
  const textColor = textColorClasses[backgroundColor] || textColorClasses.white
  const paddingClass = paddingClasses[padding] || paddingClasses.normal
  const gridClass = columnClasses[columns] || columnClasses[3]
  const isDark = backgroundColor === 'dark'

  const CardWrapper = ({ card, children }: { card: Card; children: React.ReactNode }) => {
    if (card.link) {
      return (
        <Link href={card.link} className="block group">
          {children}
        </Link>
      )
    }
    return <div>{children}</div>
  }

  return (
    <section ref={ref} className={`${bgClass} ${paddingClass}`}>
      <motion.div 
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {(title || subtitle) && (
          <div className={`mb-14 text-${textAlign}`}>
            {title && (
              <h2 className={`text-3xl md:text-4xl font-bold mb-5 tracking-tight ${textColor}`}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`text-lg md:text-xl max-w-2xl ${textAlign === 'center' ? 'mx-auto' : ''} ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${gridClass} gap-6 md:gap-8`}>
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <CardWrapper card={card}>
                <div className={`
                  h-full p-8 md:p-10 rounded-2xl transition-all duration-300
                  ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:shadow-xl shadow-[0_4px_20px_-4px_rgba(30,58,95,0.08)] ring-1 ring-black/5'}
                  ${card.link ? 'cursor-pointer' : ''}
                  text-${textAlign}
                `}>
                  {card.icon && (
                    <div className="text-4xl md:text-5xl mb-5">
                      {card.icon}
                    </div>
                  )}
                  <h3 className={`text-xl font-bold mb-3 tracking-tight ${isDark ? 'text-white group-hover:text-[#3B82A0]' : 'text-slate-900 group-hover:text-[#1E3A5F]'} transition-colors`}>
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className={`text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {card.description}
                    </p>
                  )}
                  {card.link && (
                    <div className={`mt-5 text-sm font-semibold ${isDark ? 'text-[#3B82A0]' : 'text-[#1E3A5F]'}`}>
                      Lees meer →
                    </div>
                  )}
                </div>
              </CardWrapper>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
