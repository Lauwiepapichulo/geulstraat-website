import Image from 'next/image'
import Link from 'next/link'
import {PortableText} from '@portabletext/react'

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

const imageSizeClasses: Record<string, string> = {
  small: 'md:w-2/5',
  medium: 'md:w-1/2',
  large: 'md:w-3/5',
}

const buttonStyles: Record<string, string> = {
  primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
  outline: 'border border-emerald-600 hover:bg-emerald-50 text-emerald-600',
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
}: MediaSectionProps) {
  const bgClass = bgClasses[backgroundColor] || bgClasses.white
  const textColor = textColorClasses[backgroundColor] || textColorClasses.white
  const paddingClass = paddingClasses[padding] || paddingClasses.normal
  const isDark = backgroundColor === 'dark'
  const hasImage = !!imageUrl && typeof imageUrl === 'string' && imageUrl.length > 0 && imageUrl.startsWith('http')

  const portableTextComponents = {
    block: {
      h3: ({children}: any) => (
        <h3 className={`text-xl md:text-2xl font-semibold mb-4 ${textColor}`}>
          {children}
        </h3>
      ),
      normal: ({children}: any) => (
        <p className={`text-base md:text-lg leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
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
        <ul className={`list-disc list-outside ml-5 mb-4 space-y-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {children}
        </ul>
      ),
      number: ({children}: any) => (
        <ol className={`list-decimal list-outside ml-5 mb-4 space-y-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {children}
        </ol>
      ),
    },
  }

  // If no image and overlay layout, fall back to text section style
  if (layout === 'overlay' && !hasImage) {
    return (
      <section className={`${bgClass} ${paddingClass}`}>
        <div className={`max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 text-${textAlign}`}>
          {title && <h2 className={`text-2xl md:text-3xl font-semibold mb-5 ${textColor}`}>{title}</h2>}
          <PortableText value={content} components={portableTextComponents} />
          {button?.text && button?.url && (
            <Link href={button.url} className={`inline-block mt-6 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${buttonStyles[button.style || 'primary']}`}>
              {button.text}
            </Link>
          )}
        </div>
      </section>
    )
  }

  // Overlay layout with image
  if (layout === 'overlay' && hasImage) {
    return (
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 text-center text-white py-16">
          {title && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-5">{title}</h2>
          )}
          <PortableText value={content} components={{
            block: {
              normal: ({children}: any) => <p className="text-base md:text-lg leading-relaxed mb-4 text-white/90">{children}</p>,
            },
          }} />
          {button?.text && button?.url && (
            <Link
              href={button.url}
              className={`inline-block mt-6 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                button.style === 'secondary' ? 'bg-white hover:bg-slate-100 text-slate-800' :
                button.style === 'outline' ? 'border border-white/80 hover:bg-white/10 text-white' :
                'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {button.text}
            </Link>
          )}
        </div>
      </section>
    )
  }

  // Vertical layouts (photo-top, text-top) - work with or without image
  if (layout === 'photo-top' || layout === 'text-top') {
    return (
      <section className={`${bgClass} ${paddingClass}`}>
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          {layout === 'photo-top' ? (
            <>
              {hasImage && (
                <div className="mb-8 rounded-lg overflow-hidden shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt={imageAlt} className="w-full h-auto" />
                </div>
              )}
              {!hasImage && (
                <div className="h-[200px] md:h-[280px] rounded-lg bg-slate-100 mb-8 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Afbeelding toevoegen in Sanity</span>
                </div>
              )}
              <div className={`text-${textAlign}`}>
                {title && <h2 className={`text-2xl md:text-3xl font-semibold mb-5 ${textColor}`}>{title}</h2>}
                <PortableText value={content} components={portableTextComponents} />
                {button?.text && button?.url && (
                  <Link href={button.url} className={`inline-block mt-6 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${buttonStyles[button.style || 'primary']}`}>
                    {button.text}
                  </Link>
                )}
              </div>
            </>
          ) : (
            <>
              <div className={`text-${textAlign} mb-8`}>
                {title && <h2 className={`text-2xl md:text-3xl font-semibold mb-5 ${textColor}`}>{title}</h2>}
                <PortableText value={content} components={portableTextComponents} />
                {button?.text && button?.url && (
                  <Link href={button.url} className={`inline-block mt-6 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${buttonStyles[button.style || 'primary']}`}>
                    {button.text}
                  </Link>
                )}
              </div>
              {hasImage && (
                <div className="rounded-lg overflow-hidden shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt={imageAlt} className="w-full h-auto" />
                </div>
              )}
              {!hasImage && (
                <div className="h-[200px] md:h-[280px] rounded-lg bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">Afbeelding toevoegen in Sanity</span>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    )
  }

  // Horizontal layouts (text-left, text-right) - work with or without image
  const textSizeClass = hasImage ? (imageSize === 'small' ? 'md:w-3/5' : imageSize === 'large' ? 'md:w-2/5' : 'md:w-1/2') : 'w-full max-w-3xl'
  const imgSizeClass = imageSizeClasses[imageSize] || imageSizeClasses.medium

  return (
    <section className={`${bgClass} ${paddingClass}`}>
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className={`flex flex-col ${layout === 'text-right' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-12 items-center`}>
          {/* Text */}
          <div className={`${textSizeClass} text-${textAlign}`}>
            {title && <h2 className={`text-2xl md:text-3xl font-semibold mb-5 ${textColor}`}>{title}</h2>}
            <PortableText value={content} components={portableTextComponents} />
            {button?.text && button?.url && (
              <Link href={button.url} className={`inline-block mt-6 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${buttonStyles[button.style || 'primary']}`}>
                {button.text}
              </Link>
            )}
          </div>

          {/* Image */}
          {hasImage && (
            <div className={`${imgSizeClass} w-full`}>
              <div className="rounded-lg overflow-hidden shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={imageAlt} className="w-full h-auto" />
              </div>
            </div>
          )}
          {!hasImage && (
            <div className={`${imgSizeClass} w-full`}>
              <div className="aspect-[4/3] rounded-lg bg-slate-100 flex items-center justify-center">
                <span className="text-slate-400 text-sm">Afbeelding toevoegen</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
