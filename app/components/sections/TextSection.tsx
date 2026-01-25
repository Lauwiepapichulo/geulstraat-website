import {PortableText} from '@portabletext/react'
import Link from 'next/link'

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
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-slate-50',
  emerald: 'bg-emerald-50/50',
  beige: 'bg-amber-50/50',
  dark: 'bg-slate-800',
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

const alignClasses: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const buttonStyles: Record<string, string> = {
  primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
  outline: 'border border-emerald-600 hover:bg-emerald-50 text-emerald-600',
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
}: TextSectionProps) {
  const bgClass = bgClasses[backgroundColor] || bgClasses.white
  const textColor = textColorClasses[backgroundColor] || textColorClasses.white
  const paddingClass = paddingClasses[padding] || paddingClasses.normal
  const alignClass = alignClasses[textAlign] || alignClasses.left
  const isDark = backgroundColor === 'dark'

  const columnClasses: Record<number, string> = {
    1: 'max-w-3xl mx-auto',
    2: 'md:columns-2 gap-x-12',
    3: 'md:columns-3 gap-x-8',
  }

  const portableTextComponents = {
    block: {
      h3: ({children}: any) => (
        <h3 className={`text-xl md:text-2xl font-semibold mb-4 ${textColor}`}>
          {children}
        </h3>
      ),
      normal: ({children}: any) => (
        <p className={`text-base md:text-lg leading-relaxed mb-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {children}
        </p>
      ),
    },
    marks: {
      strong: ({children}: any) => <strong className="font-semibold">{children}</strong>,
      em: ({children}: any) => <em className="italic">{children}</em>,
    },
    list: {
      bullet: ({children}: any) => (
        <ul className={`list-disc list-outside ml-5 mb-5 space-y-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {children}
        </ul>
      ),
      number: ({children}: any) => (
        <ol className={`list-decimal list-outside ml-5 mb-5 space-y-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {children}
        </ol>
      ),
    },
  }

  return (
    <section className={`${bgClass} ${paddingClass}`}>
      <div className={`max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 ${alignClass}`}>
        {icon && (
          <div className="text-3xl md:text-4xl mb-3 opacity-80">{icon}</div>
        )}
        
        {title && (
          <h2 className={`text-2xl md:text-3xl font-semibold mb-6 ${textColor}`}>
            {title}
          </h2>
        )}

        <div className={columns === 1 ? columnClasses[1] : columnClasses[columns]}>
          <PortableText value={content} components={portableTextComponents} />
        </div>

        {button?.text && button?.url && (
          <div className={`mt-8 ${textAlign === 'center' ? 'text-center' : ''}`}>
            <Link
              href={button.url}
              className={`inline-block px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${buttonStyles[button.style || 'primary']}`}
            >
              {button.text}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
