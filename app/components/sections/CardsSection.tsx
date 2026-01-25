import Link from 'next/link'

interface Card {
  icon?: string
  title: string
  description?: string
  link?: string
}

interface CardsSectionProps {
  title?: string
  subtitle?: string
  cards: Card[]
  columns?: 2 | 3 | 4
  backgroundColor?: string
  textAlign?: 'left' | 'center' | 'right'
  padding?: 'compact' | 'normal' | 'spacious'
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-slate-100',
  emerald: 'bg-emerald-50',
  beige: 'bg-amber-50',
  dark: 'bg-slate-800',
}

const textColorClasses: Record<string, string> = {
  white: 'text-slate-900',
  gray: 'text-slate-900',
  emerald: 'text-slate-900',
  beige: 'text-slate-900',
  dark: 'text-white',
}

const paddingClasses: Record<string, string> = {
  compact: 'py-8 md:py-12',
  normal: 'py-12 md:py-16',
  spacious: 'py-16 md:py-24',
}

const columnClasses: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export default function CardsSection({
  title,
  subtitle,
  cards,
  columns = 3,
  backgroundColor = 'white',
  textAlign = 'center',
  padding = 'normal',
}: CardsSectionProps) {
  const bgClass = bgClasses[backgroundColor] || bgClasses.white
  const textColor = textColorClasses[backgroundColor] || textColorClasses.white
  const paddingClass = paddingClasses[padding] || paddingClasses.normal
  const gridClass = columnClasses[columns] || columnClasses[3]
  const isDark = backgroundColor === 'dark'

  const CardWrapper = ({ card, children }: { card: Card; children: React.ReactNode }) => {
    if (card.link) {
      return (
        <Link href={card.link} className="block group">
          {children}
        </Link>
      )
    }
    return <div>{children}</div>
  }

  return (
    <section className={`${bgClass} ${paddingClass}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className={`mb-12 text-${textAlign}`}>
            {title && (
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`text-lg max-w-2xl ${textAlign === 'center' ? 'mx-auto' : ''} ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${gridClass} gap-6 md:gap-8`}>
          {cards.map((card, index) => (
            <CardWrapper key={index} card={card}>
              <div className={`
                h-full p-6 md:p-8 rounded-xl transition-all
                ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:shadow-lg shadow-md'}
                ${card.link ? 'cursor-pointer' : ''}
                text-${textAlign}
              `}>
                {card.icon && (
                  <div className="text-4xl md:text-5xl mb-4">
                    {card.icon}
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-600'} transition-colors`}>
                  {card.title}
                </h3>
                {card.description && (
                  <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {card.description}
                  </p>
                )}
                {card.link && (
                  <div className={`mt-4 text-sm font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    Lees meer →
                  </div>
                )}
              </div>
            </CardWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
