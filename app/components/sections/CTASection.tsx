import Link from 'next/link'

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
  gray: 'bg-slate-100',
  emerald: 'bg-gradient-to-br from-emerald-500 to-teal-600',
  beige: 'bg-amber-50',
  dark: 'bg-slate-900',
}

const textColorClasses: Record<string, string> = {
  white: 'text-slate-900',
  gray: 'text-slate-900',
  emerald: 'text-white',
  beige: 'text-slate-900',
  dark: 'text-white',
}

const paddingClasses: Record<string, string> = {
  compact: 'py-12 md:py-16',
  normal: 'py-16 md:py-20',
  spacious: 'py-20 md:py-28',
}

export default function CTASection({
  title,
  subtitle,
  buttons,
  backgroundColor = 'emerald',
  textAlign = 'center',
  padding = 'normal',
}: CTASectionProps) {
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
        ? 'bg-white hover:bg-slate-100 text-emerald-700'
        : 'border-2 border-white hover:bg-white/10 text-white'
    }
    if (isDark) {
      return style === 'primary'
        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
        : 'border-2 border-white hover:bg-white/10 text-white'
    }
    return style === 'primary'
      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
      : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
  }

  return (
    <section className={`${bgClass} ${paddingClass}`}>
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${alignClasses[textAlign]}`}>
        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${textColor}`}>
          {title}
        </h2>
        
        {subtitle && (
          <p className={`text-lg md:text-xl mb-8 max-w-2xl ${isDark ? 'text-white/90' : 'text-slate-600'}`}>
            {subtitle}
          </p>
        )}

        {buttons && buttons.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.map((button, index) => (
              <Link
                key={index}
                href={button.url}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${getButtonStyle(button.style)}`}
              >
                {button.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
