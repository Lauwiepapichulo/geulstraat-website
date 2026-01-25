'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useRef} from 'react'
import {motion, useScroll, useTransform} from 'framer-motion'

interface HeroSectionProps {
  title: string
  subtitle?: string
  backgroundImage?: {
    asset: { url: string }
    alt?: string
  }
  overlay?: 'dark' | 'light' | 'none'
  height?: 'medium' | 'large' | 'full'
  button?: {
    text: string
    url: string
    style: 'primary' | 'secondary' | 'outline'
  }
  imageUrl?: string
}

export default function HeroSection({
  title,
  subtitle,
  overlay = 'dark',
  height = 'large',
  button,
  imageUrl,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  // Parallax effect - image moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const heightClasses = {
    medium: 'min-h-[420px]',
    large: 'min-h-[520px] md:min-h-[620px]',
    full: 'min-h-screen',
  }

  const hasImage = !!imageUrl && typeof imageUrl === 'string' && imageUrl.length > 0 && imageUrl.startsWith('http')

  const buttonStyles = {
    primary: 'bg-[#1E3A5F] text-white hover:bg-[#152B47] shadow-lg hover:shadow-xl',
    secondary: 'bg-[#3B82A0] hover:bg-[#2D6A8F] text-white',
    outline: 'border-2 border-white/50 hover:bg-white/10 text-white',
  }

  return (
    <section 
      ref={containerRef}
      className={`relative ${heightClasses[height]} flex items-center justify-center overflow-hidden ${!hasImage ? 'bg-gradient-to-br from-[#1E3A5F] via-[#2D5A87] to-[#152B47]' : ''}`}
    >
      {/* Background Image with Parallax */}
      {hasImage && (
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y }}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover scale-110"
            priority
            sizes="100vw"
            unoptimized
          />
          
          {/* Overlay */}
          {overlay !== 'none' && (
            <div className={`absolute inset-0 ${overlay === 'dark' ? 'bg-gradient-to-b from-black/40 via-black/30 to-black/50' : 'bg-white/50'}`} />
          )}
        </motion.div>
      )}

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-white"
        style={{ opacity }}
      >
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-7 text-balance drop-shadow-lg"
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl mb-10 opacity-95 text-balance drop-shadow-md"
          >
            {subtitle}
          </motion.p>
        )}

        {button?.text && button?.url && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={button.url}
              className={`inline-block px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${buttonStyles[button.style || 'primary']}`}
            >
              {button.text}
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
