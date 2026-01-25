'use client'

import Link from 'next/link'
import Image from 'next/image'
import {useRef, useEffect, useState} from 'react'
import {motion, useScroll, useTransform, AnimatePresence} from 'framer-motion'

interface SlideImage {
  url: string
  alt?: string
}

interface HeroProps {
  title?: string
  subtitle?: string
  imageUrl?: string
  imageAlt?: string
  slides?: SlideImage[]
  enableSlideshow?: boolean
  slideshowInterval?: number
  slideshowTransition?: 'fade' | 'slide' | 'zoom'
}

// Scramble/shuffle number animation
function ScrambleNumber({ 
  target, 
  prefix = '',
  delay = 0
}: { 
  target: string
  prefix?: string
  delay?: number
}) {
  const chars = '0123456789'
  // Start with the final value to avoid hydration mismatch
  const [display, setDisplay] = useState(prefix + target)
  const [hasMounted, setHasMounted] = useState(false)
  
  useEffect(() => {
    setHasMounted(true)
  }, [])
  
  useEffect(() => {
    if (!hasMounted) return
    
    const getRandomString = () => prefix + target.split('').map(() => chars[Math.floor(Math.random() * 10)]).join('')
    
    // Start scrambling immediately after mount
    const preScramble = setInterval(() => {
      setDisplay(getRandomString())
    }, 80)
    
    // After delay, start the reveal animation
    const startTimer = setTimeout(() => {
      clearInterval(preScramble)
      
      let iteration = 0
      const totalIterations = 20
      const finalValue = prefix + target
      
      const interval = setInterval(() => {
        const newDisplay = finalValue
          .split('')
          .map((char, index) => {
            if (index < prefix.length) return char
            const charIndex = index - prefix.length
            const revealProgress = iteration / totalIterations
            const charsToReveal = Math.floor(revealProgress * target.length)
            if (charIndex < charsToReveal) {
              return finalValue[index]
            }
            return chars[Math.floor(Math.random() * 10)]
          })
          .join('')
        
        setDisplay(newDisplay)
        iteration++
        
        if (iteration > totalIterations) {
          setDisplay(finalValue)
          clearInterval(interval)
        }
      }, 40)
      
      return () => clearInterval(interval)
    }, delay)
    
    return () => {
      clearTimeout(startTimer)
      clearInterval(preScramble)
    }
  }, [hasMounted, target, prefix, delay])

  return <span className="tabular-nums">{display}</span>
}

// Infinity symbol with bounce animation
function AnimatedInfinity({ delay = 0 }: { delay?: number }) {
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={show ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -180 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 150, damping: 12 }}
      className="inline-block origin-center scale-125"
    >
      ∞
    </motion.span>
  )
}

export default function Hero({
  title = "Bij ons in de Geulstraat",
  subtitle = "De fijnste straat van Amsterdam",
  imageUrl,
  imageAlt = "Hero image",
  slides = [],
  enableSlideshow = false,
  slideshowInterval = 5,
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Filter valid slides
  const validSlides = slides.filter(slide => slide?.url && slide.url.length > 0)
  const showSlideshow = enableSlideshow && validSlides.length >= 2

  // Auto-advance slideshow
  useEffect(() => {
    if (!showSlideshow) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % validSlides.length)
    }, slideshowInterval * 1000)
    return () => clearInterval(interval)
  }, [showSlideshow, slideshowInterval, validSlides.length])

  // Get current image URL
  const currentImageUrl = showSlideshow && validSlides[currentSlide]?.url 
    ? validSlides[currentSlide].url 
    : imageUrl

  const currentImageAlt = showSlideshow && validSlides[currentSlide]?.alt
    ? validSlides[currentSlide].alt
    : imageAlt

  return (
    <section 
      ref={containerRef}
      className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Background with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 bg-gradient-to-br from-[#1E3A5F] via-[#2D5A87] to-[#152B47]"
        style={{ y }}
      >
        {/* Image - either slideshow or single */}
        <AnimatePresence mode="wait">
          {currentImageUrl && (
            <motion.div
              key={showSlideshow ? currentSlide : 'single'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImageUrl}
                alt={currentImageAlt || 'Hero image'}
                className="absolute inset-0 w-full h-full object-cover scale-110"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60 z-10" />
      </motion.div>

      {/* Slideshow Indicators */}
      {showSlideshow && (
        <div className="absolute bottom-32 md:bottom-36 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {validSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Ga naar slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ opacity }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance drop-shadow-lg"
        >
          {title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-10 font-medium text-pretty drop-shadow-md"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/nieuws"
            className="inline-flex items-center justify-center bg-white text-[#1E3A5F] font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:bg-white/90 hover:shadow-lg min-h-[56px] text-lg"
          >
            Nieuws
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 border-2 border-white/40 hover:bg-white/20 hover:border-white/60 min-h-[56px] text-lg"
          >
            Raak betrokken
          </Link>
        </motion.div>
      </motion.div>

      {/* Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex items-center gap-4 md:gap-7 text-white/80">
          <motion.div 
            className="flex items-baseline gap-1.5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          >
            <span className="text-xl md:text-2xl font-semibold text-white">
              <ScrambleNumber target="100" prefix="+" delay={1000} />
            </span>
            <span className="text-xs md:text-sm text-white/50">
              jaar geschiedenis
            </span>
          </motion.div>

          <span className="text-white/30 text-xl">·</span>

          <motion.div 
            className="flex items-baseline gap-1.5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.1 }}
          >
            <span className="text-xl md:text-2xl font-semibold text-white">
              <ScrambleNumber target="3" delay={1100} />
            </span>
            <span className="text-xs md:text-sm text-white/50">
              scholen
            </span>
          </motion.div>

          <span className="text-white/30 text-xl">·</span>

          <motion.div 
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.2 }}
          >
            <span className="text-xl md:text-2xl font-semibold text-white leading-none">
              <AnimatedInfinity delay={1200} />
            </span>
            <span className="text-xs md:text-sm text-white/50">
              gezelligheid
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border border-white/25 rounded-full flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-0.5 h-1.5 bg-white/50 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
