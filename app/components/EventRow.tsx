import Image from 'next/image'
import Link from 'next/link'
import {Calendar, MapPin, Users, ExternalLink} from 'lucide-react'

interface EventRowProps {
  title: string
  datetime: string
  location?: string
  description?: string
  imageUrl?: string
  imageAlt?: string
  signupLink?: string
  maxParticipants?: number
  slug: string
}

export default function EventRow({
  title,
  datetime,
  location,
  description,
  imageUrl,
  imageAlt = '',
  signupLink,
  maxParticipants,
  slug,
}: EventRowProps) {
  const eventDate = new Date(datetime)
  const formattedDate = eventDate.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = eventDate.toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const day = eventDate.getDate()
  const month = eventDate.toLocaleDateString('nl-NL', {month: 'short'})

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Date Block */}
        <div className="bg-accent text-white p-6 flex flex-col items-center justify-center min-w-[120px] md:min-w-[140px]">
          <div className="text-5xl font-bold leading-none">{day}</div>
          <div className="text-xl uppercase mt-1">{month}</div>
          <div className="text-sm mt-2">{formattedTime}</div>
        </div>

        {/* Image (optional) */}
        {imageUrl && (
          <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 256px"
              unoptimized
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>

          <div className="space-y-2 mb-4">
            {/* Date & Time */}
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2 flex-shrink-0" aria-hidden="true" />
              <span>{formattedDate} om {formattedTime}</span>
            </div>

            {/* Location */}
            {location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0" aria-hidden="true" />
                <span>{location}</span>
              </div>
            )}

            {/* Max Participants */}
            {maxParticipants && (
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-2 flex-shrink-0" aria-hidden="true" />
                <span>Maximum {maxParticipants} deelnemers</span>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-700 mb-4 line-clamp-3">{description}</p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href={`/agenda/${slug}`}
              className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-3 rounded-md transition-colors min-h-[44px]"
            >
              Meer info
            </Link>

            {signupLink && (
              <a
                href={signupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-md transition-all shadow-md hover:shadow-lg hover:scale-105 min-h-[44px]"
              >
                Schrijf je in
                <ExternalLink className="ml-2 h-5 w-5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
