import Image from 'next/image'

interface TimelineEvent {
  year: string
  title: string
  description?: string
  imageUrl?: string
}

interface TimelineSectionProps {
  title?: string
  events: TimelineEvent[]
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

export default function TimelineSection({
  title,
  events,
  backgroundColor = 'white',
  textAlign = 'left',
  padding = 'normal',
}: TimelineSectionProps) {
  const bgClass = bgClasses[backgroundColor] || bgClasses.white
  const textColor = textColorClasses[backgroundColor] || textColorClasses.white
  const paddingClass = paddingClasses[padding] || paddingClasses.normal
  const isDark = backgroundColor === 'dark'

  return (
    <section className={`${bgClass} ${paddingClass}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className={`text-3xl md:text-4xl font-bold mb-12 text-${textAlign} ${textColor}`}>
            {title}
          </h2>
        )}

        <div className="relative">
          {/* Vertical line */}
          <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 ${isDark ? 'bg-emerald-500' : 'bg-emerald-400'} transform md:-translate-x-1/2`} />

          {/* Events */}
          <div className="space-y-12">
            {events.map((event, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-start md:items-center gap-8`}
              >
                {/* Dot */}
                <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'} transform -translate-x-1/2 border-4 ${isDark ? 'border-slate-800' : 'border-white'} z-10`} />

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-2 ${isDark ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                    {event.year}
                  </div>
                  <h3 className={`text-xl md:text-2xl font-bold mb-2 ${textColor}`}>
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {event.description}
                    </p>
                  )}
                </div>

                {/* Image (if provided) */}
                {event.imageUrl && (
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
