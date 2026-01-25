'use client'

import Link from 'next/link'
import {motion, useInView} from 'framer-motion'
import {useRef} from 'react'

interface CTASectionProps {
  title: string
  subtitle?: string
  buttons: Array<{
    text: string
    url: string
    style: 'primary' | 'secondary'
  }>
  backgroundColor?: string
  textAlign?: 'left' | 'center' | 'right'
  padding?: 'compact' | 'normal' | 'spacious'
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-[#F8F9FA]',
  emerald: 'bg-gradient-to-br from-[#1E3A5F] via-[#2D5A87] to-[#152B47]',
  beige: 'bg-gradient-to-br from-slate-50 to-slate-100',
  dark: 'bg-slate-900',
}

const textColorClasses: Record<string, string> = {
  white: 'text-slate-800',
  gray: 'text-slate-800',
  emerald: 'text-white',
  beige: 'text-slate-800',
  dark: 'text-white',
}

const paddingClasses: Record<string, string> = {
  compact: 'py-12 md:py-16',
  normal: 'py-16 md:py-22',
  spacious: 'py-22 md:py-28',
}

export default function CTASection({
  title,
  subtitle,
  buttons,
  backgroundColor = 'emerald',
  textAlign = 'center',
  padding = 'normal',
}: CTASectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const bgClass = bgClasses[backgroundColor] || bgClasses.emerald
  const textColor = textColorClasses[backgroundColor] || textColorClasses.emerald
  const paddingClass = paddingClasses[padding] || paddingClasses.normal
  const isAccent = backgroundColor === 'emerald'
  const isDark = backgroundColor === 'dark' || backgroundColor === 'emerald'

  const alignClasses: Record<string, string> = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  const getButtonStyle = (style: string) => {
    if (isAccent) {
      return style === 'primary'
        ? 'bg-white text-[#1E3A5F] hover:bg-slate-100 shadow-lg hover:shadow-xl'
        : 'border-2 border-white/40 hover:bg-white/10 text-white'
    }
    if (isDark) {
      return style === 'primary'
        ? 'bg-[#1E3A5F] hover:bg-[#152B47] text-white'
        : 'border-2 border-white/40 hover:bg-white/10 text-white'
    }
    return style === 'primary'
      ? 'bg-[#1E3A5F] hover:bg-[#152B47] text-white'
      : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
  }

  return (
    <section ref={ref} className={`${bgClass} ${paddingClass}`}>
      <motion.div 
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${alignClasses[textAlign]}`}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight ${textColor}`}>
          {title}
        </h2>
        
        {subtitle && (
          <p className={`text-lg md:text-xl mb-12 max-w-2xl leading-relaxed ${isDark ? 'text-white/85' : 'text-slate-600'}`}>
            {subtitle}
          </p>
        )}

        {buttons && buttons.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.map((button, index) => (
              <Link
                key={index}
                href={button.url}
                className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${getButtonStyle(button.style)}`}
              >
                {button.text}
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}
