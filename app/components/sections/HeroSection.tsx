import Image from 'next/image'
import Link from 'next/link'

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
  const heightClasses = {
    medium: 'min-h-[400px]',
    large: 'min-h-[500px] md:min-h-[600px]',
    full: 'min-h-screen',
  }

  const hasImage = !!imageUrl && typeof imageUrl === 'string' && imageUrl.length > 0 && imageUrl.startsWith('http')

  const buttonStyles = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    secondary: 'bg-white hover:bg-slate-100 text-slate-900',
    outline: 'border-2 border-white hover:bg-white/10 text-white',
  }

  return (
    <section className={`relative ${heightClasses[height]} flex items-center justify-center overflow-hidden ${!hasImage ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700' : ''}`}>
      {/* Background Image */}
      {hasImage && (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          unoptimized
        />
      )}

      {/* Overlay - only show if there's an image */}
      {hasImage && overlay !== 'none' && (
        <div className={`absolute inset-0 ${overlay === 'dark' ? 'bg-black/50' : 'bg-white/50'}`} />
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xl md:text-2xl mb-8 opacity-90 text-balance">
            {subtitle}
          </p>
        )}

        {button?.text && button?.url && (
          <Link
            href={button.url}
            className={`inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${buttonStyles[button.style || 'primary']}`}
          >
            {button.text}
          </Link>
        )}
      </div>
    </section>
  )
}
