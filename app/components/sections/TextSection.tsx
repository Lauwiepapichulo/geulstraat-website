'use client'

import {PortableText} from '@portabletext/react'
import Link from 'next/link'
import {motion} from 'framer-motion'
import {useRef} from 'react'
import {useInView} from 'framer-motion'

interface TextSectionProps {
  title?: string
  content: any[]
  columns?: 1 | 2 | 3
  icon?: string
  backgroundColor?: string
  textAlign?: 'left' | 'center' | 'right'
  padding?: 'compact' | 'normal' | 'spacious'
  button?: {
    text: string
    url: string
    style: 'primary' | 'secondary' | 'outline'
  }
  id?: string
  variant?: 'default' | 'article' | 'highlight'
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-[#FAFBFC]',
  emerald: 'bg-gradient-to-br from-[#1E3A5F]/[0.02] to-[#3B82A0]/[0.04]',
  beige: 'bg-gradient-to-br from-amber-50/40 to-orange-50/30',
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
  compact: 'py-12 md:py-16',
  normal: 'py-16 md:py-24',
  spacious: 'py-24 md:py-32',
}

const alignClasses: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const buttonStyles: Record<string, string> = {
  primary: 'bg-[#1E3A5F] hover:bg-[#152B47] text-white shadow-md hover:shadow-lg',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
  outline: 'border-2 border-[#1E3A5F] hover:bg-[#1E3A5F]/5 text-[#1E3A5F]',
}

export default function TextSection({
  title,
  content,
  columns = 1,
  icon,
  backgroundColor = 'white',
  textAlign = 'left',
  padding = 'normal',
  button,
  id,
  variant = 'default',
}: TextSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  const bgClass = bgClasses[backgroundColor] || bgClasses.white
  const textColor = textColorClasses[backgroundColor] || textColorClasses.white
  const paddingClass = paddingClasses[padding] || paddingClasses.normal
  const alignClass = alignClasses[textAlign] || alignClasses.left
  const isDark = backgroundColor === 'dark'

  // Enhanced typography for article variant
  const isArticle = variant === 'article'
  const isHighlight = variant === 'highlight'

  const columnClasses: Record<number, string> = {
    1: isArticle ? 'max-w-2xl mx-auto' : 'max-w-3xl mx-auto',
    2: 'md:columns-2 gap-x-16',
    3: 'md:columns-3 gap-x-12',
  }

  // Enhanced Portable Text components for better reading experience
  const portableTextComponents = {
    block: {
      h2: ({children}: any) => (
        <h2 className={`
          text-2xl md:text-3xl font-semibold mb-6 mt-12 first:mt-0 tracking-tight leading-tight
          ${textColor}
        `}>
          {children}
        </h2>
      ),
      h3: ({children}: any) => (
        <h3 className={`
          text-xl md:text-2xl font-semibold mb-4 mt-10 first:mt-0 tracking-tight leading-tight
          ${textColor}
        `}>
          {children}
        </h3>
      ),
      h4: ({children}: any) => (
        <h4 className={`
          text-lg font-semibold mb-3 mt-8 first:mt-0 tracking-tight
          ${textColor}
        `}>
          {children}
        </h4>
      ),
      normal: ({children}: any) => (
        <p className={`
          mb-6 last:mb-0
          ${isArticle 
            ? 'text-lg leading-[1.85] tracking-[-0.01em] font-serif' 
            : 'text-base leading-relaxed'
          }
          ${isDark ? 'text-slate-300' : 'text-slate-600'}
        `}>
          {children}
        </p>
      ),
      blockquote: ({children}: any) => (
        <blockquote className={`
          my-8 pl-6 border-l-2 
          ${isDark ? 'border-[#3B82A0]/40' : 'border-[#1E3A5F]/20'}
          ${isArticle ? 'text-lg italic font-serif' : 'text-base'}
          ${isDark ? 'text-slate-400' : 'text-slate-500'}
        `}>
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({children}: any) => (
        <strong className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {children}
        </strong>
      ),
      em: ({children}: any) => <em className="italic">{children}</em>,
      link: ({value, children}: any) => (
        <a 
          href={value?.href} 
          className={`
            underline decoration-[#3B82A0]/30 underline-offset-2 
            hover:decoration-[#3B82A0] transition-colors
            ${isDark ? 'text-[#7CB8D4]' : 'text-[#1E3A5F]'}
          `}
          target={value?.href?.startsWith('http') ? '_blank' : undefined}
          rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      ),
    },
    list: {
      bullet: ({children}: any) => (
        <ul className={`
          list-none ml-0 mb-6 space-y-3
          ${isArticle ? 'text-lg font-serif' : 'text-base'}
          ${isDark ? 'text-slate-300' : 'text-slate-600'}
        `}>
          {children}
        </ul>
      ),
      number: ({children}: any) => (
        <ol className={`
          list-decimal list-outside ml-6 mb-6 space-y-3
          ${isArticle ? 'text-lg font-serif' : 'text-base'}
          ${isDark ? 'text-slate-300' : 'text-slate-600'}
        `}>
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({children}: any) => (
        <li className="flex items-start gap-3">
          <span className={`
            mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0
            ${isDark ? 'bg-[#3B82A0]' : 'bg-[#1E3A5F]/40'}
          `} />
          <span className="leading-relaxed">{children}</span>
        </li>
      ),
    },
  }

  // Highlight variant with special styling
  if (isHighlight) {
    return (
      <section 
        ref={ref} 
        id={id}
        className={`${paddingClass} relative overflow-hidden`}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/[0.03] via-transparent to-[#3B82A0]/[0.03]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
        
        <motion.div 
          className={`relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 ${alignClass}`}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-[0_4px_40px_-12px_rgba(30,58,95,0.1)] border border-slate-100">
            {icon && (
              <div className="text-3xl mb-4">{icon}</div>
            )}
            
            {title && (
              <h2 className={`text-2xl md:text-3xl font-bold mb-6 tracking-tight ${textColor}`}>
                {title}
              </h2>
            )}

            <div className={columns === 1 ? 'max-w-2xl mx-auto' : columnClasses[columns]}>
              <PortableText value={content} components={portableTextComponents} />
            </div>

            {button?.text && button?.url && (
              <div className={`mt-10 ${textAlign === 'center' ? 'text-center' : ''}`}>
                <Link
                  href={button.url}
                  className={`inline-block px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${buttonStyles[button.style || 'primary']}`}
                >
                  {button.text}
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    )
  }

  return (
    <section ref={ref} id={id} className={`${bgClass} ${paddingClass}`}>
      <motion.div 
        className={`max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 ${alignClass}`}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Icon */}
        {icon && (
          <div className={`text-3xl mb-4 ${textAlign === 'center' ? 'text-center' : ''}`}>
            {icon}
          </div>
        )}
        
        {/* Title with decorative element */}
        {title && (
          <div className={`mb-8 ${textAlign === 'center' ? 'text-center' : ''}`}>
            {isArticle && textAlign === 'center' && (
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="w-8 h-px bg-[#1E3A5F]/20" />
                <span className="text-[#3B82A0] text-xs uppercase tracking-[0.2em] font-medium">Sectie</span>
                <span className="w-8 h-px bg-[#1E3A5F]/20" />
              </div>
            )}
            <h2 className={`
              text-2xl md:text-3xl font-bold tracking-tight
              ${textColor}
            `}>
              {title}
            </h2>
          </div>
        )}

        {/* Content with proper spacing */}
        <div className={`${columns === 1 ? columnClasses[1] : columnClasses[columns]} ${columns > 1 ? '[column-rule:1px_solid_theme(colors.slate.200)]' : ''}`}>
          <PortableText value={content} components={portableTextComponents} />
        </div>

        {/* Button */}
        {button?.text && button?.url && (
          <div className={`mt-10 ${textAlign === 'center' ? 'text-center' : ''}`}>
            <Link
              href={button.url}
              className={`inline-block px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${buttonStyles[button.style || 'primary']}`}
            >
              {button.text}
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  )
}
