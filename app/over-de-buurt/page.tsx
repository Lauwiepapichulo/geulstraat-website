import {client} from '@/lib/sanity.client'
import imageUrlBuilder from '@sanity/image-url'
import Breadcrumbs from '../components/Breadcrumbs'
import {
  HeroSection,
  TextSection,
  MediaSection,
  QuoteSection,
  CTASection,
  TimelineSection,
  CardsSection,
  GallerySection,
} from '../components/sections'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

const overDeBuurtQuery = `*[_type == "overDeBuurt"][0] {
  title,
  sections[] {
    _key,
    _type,
    
    // Hero section
    title,
    subtitle,
    backgroundImage {
      asset->,
      crop,
      hotspot,
      alt
    },
    overlay,
    height,
    
    // Text section
    content,
    columns,
    icon,
    
    // Media section + Legacy section
    image {
      asset->,
      crop,
      hotspot,
      alt
    },
    layout,
    imageSize,
    
    // Legacy section fields
    sectionTitle,
    text,
    "legacyStyle": style {
      backgroundColor,
      textColor,
      fontStyle
    },
    
    // Gallery section - fetch full image objects for crop/hotspot
    images[] {
      asset->,
      crop,
      hotspot,
      alt,
      caption
    },
    showCaptions,
    
    // Quote section
    quote,
    author,
    authorRole,
    style,
    
    // CTA section
    buttons[] {
      text,
      url,
      style
    },
    
    // Timeline section
    events[] {
      year,
      title,
      description,
      image {
        asset->,
        crop,
        hotspot
      }
    },
    
    // Cards section
    cards[] {
      icon,
      title,
      description,
      link
    },
    
    // Shared styling
    backgroundColor,
    textAlign,
    padding,
    button {
      text,
      url,
      style
    }
  }
}`

// Divider component
function Divider({ style }: { style: string }) {
  switch (style) {
    case 'line':
      return <hr className="border-t border-slate-200 max-w-6xl mx-auto" />
    case 'thick':
      return <hr className="border-t-4 border-slate-300 max-w-6xl mx-auto" />
    case 'dotted':
      return <hr className="border-t-2 border-dotted border-slate-300 max-w-6xl mx-auto" />
    case 'decorative':
      return (
        <div className="flex items-center justify-center py-8">
          <div className="flex-1 border-t border-slate-200 max-w-xs"></div>
          <div className="px-4 text-emerald-500 text-2xl">✦</div>
          <div className="flex-1 border-t border-slate-200 max-w-xs"></div>
        </div>
      )
    case 'space-small':
      return <div className="h-8" />
    case 'space-large':
      return <div className="h-16" />
    default:
      return <hr className="border-t border-slate-200 max-w-6xl mx-auto" />
  }
}

export default async function OverDeBuurtPage() {
  const pageData = await client.fetch(overDeBuurtQuery).catch(() => null)

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Pagina niet gevonden
          </h1>
          <p className="text-slate-600">
            Deze pagina moet nog worden aangemaakt in Sanity Studio.
          </p>
        </div>
      </div>
    )
  }

  // Check if there's a hero section as the first section
  const hasHeroFirst = pageData.sections?.[0]?._type === 'heroSection'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - only show if no hero section first */}
      {!hasHeroFirst && (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[
              {label: 'Home', href: '/'},
              {label: pageData.title || 'Over de buurt', href: '/over-de-buurt'},
            ]} />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-6 text-balance">
              {pageData.title || 'Over de buurt'}
            </h1>
          </div>
        </div>
      )}

      {/* Sections */}
      {pageData.sections && pageData.sections.length > 0 ? (
        <div>
          {pageData.sections.map((section: any, index: number) => {
            const key = section._key || index

            switch (section._type) {
              case 'heroSection':
                // Use urlFor to generate URL with crop/hotspot applied
                // Use fit('max') to respect the user's crop aspect ratio
                const heroImageUrl = section.backgroundImage?.asset 
                  ? urlFor(section.backgroundImage).width(1920).fit('max').auto('format').url()
                  : undefined
                return (
                  <HeroSection
                    key={key}
                    title={section.title}
                    subtitle={section.subtitle}
                    imageUrl={heroImageUrl}
                    overlay={section.overlay}
                    height={section.height}
                    button={section.button}
                  />
                )

              case 'textSection':
                return (
                  <TextSection
                    key={key}
                    title={section.title}
                    content={section.content || []}
                    columns={section.columns}
                    icon={section.icon}
                    backgroundColor={section.backgroundColor}
                    textAlign={section.textAlign}
                    padding={section.padding}
                    button={section.button}
                  />
                )

              case 'mediaSection':
                // Use urlFor to generate URL with crop/hotspot applied
                // Use fit('max') to respect the user's crop aspect ratio
                const mediaImageUrl = section.image?.asset 
                  ? urlFor(section.image).width(1200).fit('max').auto('format').url()
                  : undefined
                return (
                  <MediaSection
                    key={key}
                    title={section.title}
                    content={section.content || []}
                    imageUrl={mediaImageUrl}
                    imageAlt={section.image?.alt || section.title || 'Afbeelding'}
                    layout={section.layout}
                    imageSize={section.imageSize}
                    backgroundColor={section.backgroundColor}
                    textAlign={section.textAlign}
                    padding={section.padding}
                    button={section.button}
                  />
                )

              case 'gallerySection':
                return (
                  <GallerySection
                    key={key}
                    title={section.title}
                    images={(section.images || []).map((img: any, i: number) => ({
                      // Use urlFor to generate URL with crop/hotspot applied
                      // Use fit('max') to respect the user's crop aspect ratio
                      url: img.asset ? urlFor(img).width(800).fit('max').auto('format').url() : '',
                      alt: img.alt || `Foto ${i + 1}`,
                      caption: img.caption,
                    })).filter((img: any) => img.url)}
                    columns={section.columns}
                    showCaptions={section.showCaptions}
                    backgroundColor={section.backgroundColor}
                    textAlign={section.textAlign}
                    padding={section.padding}
                  />
                )

              case 'quoteSection':
                const quoteImageUrl = section.image?.asset 
                  ? urlFor(section.image).width(200).fit('max').auto('format').url()
                  : undefined
                return (
                  <QuoteSection
                    key={key}
                    quote={section.quote}
                    author={section.author}
                    authorRole={section.authorRole}
                    imageUrl={quoteImageUrl}
                    style={section.style}
                    backgroundColor={section.backgroundColor}
                    textAlign={section.textAlign}
                    padding={section.padding}
                  />
                )

              case 'ctaSection':
                return (
                  <CTASection
                    key={key}
                    title={section.title}
                    subtitle={section.subtitle}
                    buttons={section.buttons || []}
                    backgroundColor={section.backgroundColor}
                    textAlign={section.textAlign}
                    padding={section.padding}
                  />
                )

              case 'timelineSection':
                return (
                  <TimelineSection
                    key={key}
                    title={section.title}
                    events={(section.events || []).map((event: any) => ({
                      year: event.year,
                      title: event.title,
                      description: event.description,
                      // Use urlFor to generate URL with crop/hotspot applied
                      imageUrl: event.image?.asset ? urlFor(event.image).width(600).fit('max').auto('format').url() : undefined,
                    }))}
                    backgroundColor={section.backgroundColor}
                    textAlign={section.textAlign}
                    padding={section.padding}
                  />
                )

              case 'cardsSection':
                return (
                  <CardsSection
                    key={key}
                    title={section.title}
                    subtitle={section.subtitle}
                    cards={section.cards || []}
                    columns={section.columns}
                    backgroundColor={section.backgroundColor}
                    textAlign={section.textAlign}
                    padding={section.padding}
                  />
                )

              case 'divider':
                return <Divider key={key} style={section.style} />

              // Legacy section type (backwards compatibility)
              case 'section':
                const legacyImageUrl = section.image?.asset 
                  ? urlFor(section.image).width(1200).fit('max').auto('format').url()
                  : undefined
                return (
                  <MediaSection
                    key={key}
                    title={section.sectionTitle}
                    content={section.text || []}
                    imageUrl={legacyImageUrl}
                    imageAlt={section.image?.alt || section.sectionTitle || 'Afbeelding'}
                    layout={section.layout || 'text-left'}
                    backgroundColor={section.legacyStyle?.backgroundColor}
                    padding="normal"
                  />
                )

              default:
                return null
            }
          })}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-md text-center">
            <p className="text-slate-600 text-lg">
              Deze pagina heeft nog geen secties. Voeg secties toe in Sanity Studio.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export const revalidate = 60
