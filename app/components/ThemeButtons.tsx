'use client'

import Link from 'next/link'
import Image from 'next/image'
import {motion} from 'framer-motion'
import {themes} from '@/lib/themes'

export default function ThemeButtons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
      {themes.map((theme, index) => (
        <motion.div
          key={theme.value}
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.4, delay: index * 0.1}}
        >
          <Link
            href={`/thema/${theme.value}`}
            className="group block h-full rounded-2xl bg-white border border-slate-200/70 shadow-[0_4px_20px_-4px_rgb(30_58_95/0.1)] p-6 md:p-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_-12px_rgb(30_58_95/0.28)] focus:outline-none focus-visible:ring-4"
            style={{['--tw-ring-color' as any]: `${theme.color}55`, borderTopColor: theme.color, borderTopWidth: '4px'}}
          >
            <div className="flex flex-col items-center h-full">
              {/* Badge */}
              <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-white shadow-md transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={theme.badge}
                  alt={theme.name}
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              </div>

              {/* Naam */}
              <h3 className="mt-5 text-xl font-bold" style={{color: theme.color}}>
                {theme.name}
              </h3>

              {/* Tagline */}
              <p className="mt-2 text-slate-600 text-base flex-grow">
                {theme.tagline}
              </p>

              {/* Echte knop */}
              <span
                className="mt-6 inline-flex items-center justify-center gap-2 w-full text-white font-semibold px-6 py-3 rounded-full shadow-sm transition-all duration-300 group-hover:shadow-md min-h-[48px]"
                style={{backgroundColor: theme.color}}
              >
                Bekijk &amp; doe mee
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
