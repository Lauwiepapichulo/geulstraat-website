import Image from 'next/image'

interface QuoteSectionProps {
  quote: string
  author?: string
  authorRole?: string
  imageUrl?: string
  style?: 'simple' | 'decorative' | 'boxed'
  backgroundColor?: string
  textAlign?: 'left' | 'center' | 'right'
  padding?: 'compact' | 'normal' | 'spacious'
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

export default function QuoteSection({
  quote,
  author,
  authorRole,
  imageUrl,
  style = 'simple',
  backgroundColor = 'white',
  textAlign = 'center',
  padding = 'normal',
}: QuoteSectionProps) {
  const bgClass = bgClasses[backgroundColor] || bgClasses.white
  const textColor = textColorClasses[backgroundColor] || textColorClasses.white
  const paddingClass = paddingClasses[padding] || paddingClasses.normal
  const isDark = backgroundColor === 'dark'

  // Simple elegant quote with subtle styling
  if (style === 'simple') {
    return (
      <section className={`${bgClass} ${paddingClass}`}>
        <div className={`max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 text-${textAlign}`}>
          <blockquote className={`text-xl md:text-2xl font-light leading-relaxed ${textColor} italic`}>
            <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>"</span>
            {quote}
            <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>"</span>
          </blockquote>

          {(author || imageUrl) && (
            <div className={`mt-6 flex items-center ${textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'} gap-3`}>
              {imageUrl && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm">
                  <Image
                    src={imageUrl}
                    alt={author || 'Auteur'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className={textAlign === 'center' && !imageUrl ? 'text-center' : ''}>
                {author && (
                  <cite className={`not-italic text-sm font-medium ${textColor}`}>
                    — {author}
                  </cite>
                )}
                {authorRole && (
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    , {authorRole}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }

  // Decorative quote with elegant left border
  if (style === 'decorative') {
    return (
      <section className={`${bgClass} ${paddingClass}`}>
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className={`border-l-2 ${isDark ? 'border-emerald-400' : 'border-emerald-500'} pl-6 md:pl-8`}>
            <blockquote className={`text-xl md:text-2xl font-light leading-relaxed ${textColor}`}>
              {quote}
            </blockquote>

            {(author || imageUrl) && (
              <div className="mt-6 flex items-center gap-3">
                {imageUrl && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm">
                    <Image
                      src={imageUrl}
                      alt={author || 'Auteur'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  {author && (
                    <cite className={`not-italic text-sm font-medium ${textColor}`}>
                      {author}
                    </cite>
                  )}
                  {authorRole && (
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {authorRole}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Boxed quote with card styling
  return (
    <section className={`${bgClass} ${paddingClass}`}>
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className={`${isDark ? 'bg-slate-700/50' : 'bg-white'} rounded-xl shadow-sm p-8 md:p-10 text-${textAlign} ${!isDark ? 'border border-slate-100' : ''}`}>
          <blockquote className={`text-lg md:text-xl font-light leading-relaxed ${textColor}`}>
            <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>"</span>
            {quote}
            <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>"</span>
          </blockquote>

          {(author || imageUrl) && (
            <div className={`mt-6 flex items-center ${textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'} gap-3`}>
              {imageUrl && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm">
                  <Image
                    src={imageUrl}
                    alt={author || 'Auteur'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className={textAlign === 'center' && !imageUrl ? 'text-center' : ''}>
                {author && (
                  <cite className={`not-italic text-sm font-medium ${textColor}`}>
                    — {author}
                  </cite>
                )}
                {authorRole && (
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    , {authorRole}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
