'use client'

import Image from 'next/image'
import Link from 'next/link'
import {PortableText} from '@portabletext/react'
import {motion, useInView} from 'framer-motion'
import {useRef} from 'react'

interface MediaSectionProps {
  title?: string
  content: any[]
  imageUrl?: string
  imageAlt?: string
  layout?: 'text-left' | 'text-right' | 'photo-top' | 'text-top' | 'overlay'
  imageSize?: 'small' | 'medium' | 'large'
  backgroundColor?: string
  textAlign?: 'left' | 'center' | 'right'
  padding?: 'compact' | 'normal' | 'spacious'
  button?: {
    text: string
    url: string
    style: 'primary' | 'secondary' | 'outline'
  }
  id?: string
  variant?: 'default' | 'article'
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

const imageSizeClasses: Record<string, string> = {
  small: 'md:w-2/5',
  medium: 'md:w-1/2',
  large: 'md:w-3/5',
}

const buttonStyles: Record<string, string> = {
  primary: 'bg-[#1E3A5F] hover:bg-[#152B47] text-white shadow-md hover:shadow-lg',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
  outline: 'border-2 border-[#1E3A5F] hover:bg-[#1E3A5F]/5 text-[#1E3A5F]',
}

export default function MediaSection({
  title,
  content,
  imageUrl,
  imageAlt = '',
  layout = 'text-left',
  imageSize = 'medium',
  backgroundColor = 'white',
  textAlign = 'left',
  padding = 'normal',
  button,
  id,
  variant = 'default',
}: MediaSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  const bgClass = bgClasses[backgroundColor] || bgClasses.white
  const textColor = textColorClasses[backgroundColor] || textColorClasses.white
  const paddingClass = paddingClasses[padding] || paddingClasses.normal
  const isDark = backgroundColor === 'dark'
  const hasImage = !!imageUrl && typeof imageUrl === 'string' && imageUrl.length > 0 && imageUrl.startsWith('http')
  const isArticle = variant === 'article'

  const portableTextComponents = {
    block: {
      h3: ({children}: any) => (
        <h3 className={`text-xl md:text-2xl font-semibold mb-4 tracking-tight ${textColor}`}>
          {children}
        </h3>
      ),
      normal: ({children}: any) => (
        <p className={`
          mb-5 last:mb-0
          ${isArticle ? 'text-lg leading-[1.8] font-serif' : 'text-base leading-relaxed'}
          ${isDark ? 'text-slate-300' : 'text-slate-600'}
        `}>
          {children}
        </p>
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
        >
          {children}
        </a>
      ),
    },
    list: {
      bullet: ({children}: any) => (
        <ul className={`
          list-none ml-0 mb-5 space-y-2.5
          ${isArticle ? 'text-lg font-serif' : 'text-base'}
          ${isDark ? 'text-slate-300' : 'text-slate-600'}
        `}>
          {children}
        </ul>
      ),
      number: ({children}: any) => (
        <ol className={`
          list-decimal list-outside ml-6 mb-5 space-y-2.5
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

  // If no image and overlay layout, fall back to text section style
  if (layout === 'overlay' && !hasImage) {
    return (
      <section ref={ref} id={id} className={`${bgClass} ${paddingClass}`}>
        <motion.div 
          className={`max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 text-${textAlign}`}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {title && (
            <h2 className={`text-2xl md:text-3xl font-bold mb-6 tracking-tight ${textColor}`}>
              {title}
            </h2>
          )}
          <PortableText value={content} components={portableTextComponents} />
          {button?.text && button?.url && (
            <Link href={button.url} className={`inline-block mt-10 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${buttonStyles[button.style || 'primary']}`}>
              {button.text}
            </Link>
          )}
        </motion.div>
      </section>
    )
  }

  // Overlay layout with image
  if (layout === 'overlay' && hasImage) {
    return (
      <section ref={ref} id={id} className="relative min-h-[400px] md:min-h-[500px] flex items-center">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/50 to-slate-900/30" />
        <motion.div 
          className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 text-center text-white py-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold mb-6 tracking-tight">{title}</h2>
          )}
          <div className={isArticle ? 'text-lg leading-relaxed font-serif' : ''}>
            <PortableText value={content} components={{
              block: {
                normal: ({children}: any) => <p className="text-lg leading-relaxed mb-5 text-white/90">{children}</p>,
              },
            }} />
          </div>
          {button?.text && button?.url && (
            <Link
              href={button.url}
              className={`inline-block mt-10 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                button.style === 'secondary' ? 'bg-white text-[#1E3A5F] hover:bg-slate-100' :
                button.style === 'outline' ? 'border-2 border-white/60 hover:bg-white/10 text-white' :
                'bg-[#1E3A5F] hover:bg-[#152B47] text-white'
              }`}
            >
              {button.text}
            </Link>
          )}
        </motion.div>
      </section>
    )
  }

  // Vertical layouts (photo-top, text-top) - work with or without image
  if (layout === 'photo-top' || layout === 'text-top') {
    return (
      <section ref={ref} id={id} className={`${bgClass} ${paddingClass}`}>
        <motion.div 
          className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {layout === 'photo-top' ? (
            <>
              {hasImage && (
                <motion.div 
                  className="mb-10 flex justify-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5 max-w-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt={imageAlt} className="w-full h-auto max-h-[320px] object-contain" />
                  </div>
                </motion.div>
              )}
              {!hasImage && (
                <div className="h-[180px] md:h-[220px] rounded-xl bg-slate-100 mb-10 flex items-center justify-center max-w-lg mx-auto">
                  <span className="text-slate-400 text-sm">Afbeelding toevoegen in Sanity</span>
                </div>
              )}
              <div className={`text-${textAlign} max-w-2xl mx-auto`}>
                {title && (
                  <h2 className={`text-2xl md:text-3xl font-bold mb-6 tracking-tight ${textColor}`}>
                    {title}
                  </h2>
                )}
                <PortableText value={content} components={portableTextComponents} />
                {button?.text && button?.url && (
                  <Link href={button.url} className={`inline-block mt-8 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${buttonStyles[button.style || 'primary']}`}>
                    {button.text}
                  </Link>
                )}
              </div>
            </>
          ) : (
            <>
              <div className={`text-${textAlign} mb-12 max-w-2xl mx-auto`}>
                {title && (
                  <h2 className={`text-2xl md:text-3xl font-bold mb-6 tracking-tight ${textColor}`}>
                    {title}
                  </h2>
                )}
                <PortableText value={content} components={portableTextComponents} />
                {button?.text && button?.url && (
                  <Link href={button.url} className={`inline-block mt-8 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${buttonStyles[button.style || 'primary']}`}>
                    {button.text}
                  </Link>
                )}
              </div>
              {hasImage && (
                <motion.div 
                  className="flex justify-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5 max-w-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt={imageAlt} className="w-full h-auto max-h-[320px] object-contain" />
                  </div>
                </motion.div>
              )}
              {!hasImage && (
                <div className="h-[180px] md:h-[220px] rounded-xl bg-slate-100 flex items-center justify-center max-w-lg mx-auto">
                  <span className="text-slate-400 text-sm">Afbeelding toevoegen in Sanity</span>
                </div>
              )}
            </>
          )}
        </motion.div>
      </section>
    )
  }

  // Horizontal layouts (text-left, text-right) - work with or without image
  const textSizeClass = hasImage ? (imageSize === 'small' ? 'md:w-3/5' : imageSize === 'large' ? 'md:w-2/5' : 'md:w-1/2') : 'w-full max-w-3xl'
  const imgSizeClass = imageSizeClasses[imageSize] || imageSizeClasses.medium

  return (
    <section ref={ref} id={id} className={`${bgClass} ${paddingClass}`}>
      <motion.div 
        className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={`flex flex-col ${layout === 'text-right' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-16 items-center`}>
          {/* Text */}
          <div className={`${textSizeClass} text-${textAlign}`}>
            {title && (
              <h2 className={`text-2xl md:text-3xl font-bold mb-6 tracking-tight ${textColor}`}>
                {title}
              </h2>
            )}
            <PortableText value={content} components={portableTextComponents} />
            {button?.text && button?.url && (
              <Link href={button.url} className={`inline-block mt-8 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${buttonStyles[button.style || 'primary']}`}>
                {button.text}
              </Link>
            )}
          </div>

          {/* Image */}
          {hasImage && (
            <motion.div 
              className={`${imgSizeClass} w-full`}
              initial={{ opacity: 0, x: layout === 'text-right' ? -20 : 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: layout === 'text-right' ? -20 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={imageAlt} className="w-full h-auto" />
              </div>
            </motion.div>
          )}
          {!hasImage && (
            <div className={`${imgSizeClass} w-full`}>
              <div className="aspect-[4/3] rounded-xl bg-slate-100 flex items-center justify-center">
                <span className="text-slate-400 text-sm">Afbeelding toevoegen</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  )
}
