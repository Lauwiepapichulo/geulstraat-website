import {client} from '@/lib/sanity.client'
import imageUrlBuilder from '@sanity/image-url'
import Breadcrumbs from '../components/Breadcrumbs'
import ReadingProgress from '../components/ReadingProgress'
import TableOfContents from '../components/TableOfContents'
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

// Elegant divider with multiple styles
function Divider({ style }: { style: string }) {
  switch (style) {
    case 'line':
      return (
        <div className="py-8">
          <hr className="border-t border-slate-200/60 max-w-2xl mx-auto" />
        </div>
      )
    case 'thick':
      return (
        <div className="py-8">
          <hr className="border-t-2 border-slate-200 max-w-xl mx-auto" />
        </div>
      )
    case 'dotted':
      return (
        <div className="py-10 flex items-center justify-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        </div>
      )
    case 'decorative':
      return (
        <div className="flex items-center justify-center py-12">
          <div className="flex-1 border-t border-slate-200/50 max-w-[120px]"></div>
          <div className="px-6 text-[#3B82A0]/60 text-lg">✦</div>
          <div className="flex-1 border-t border-slate-200/50 max-w-[120px]"></div>
        </div>
      )
    case 'space-small':
      return <div className="h-8 md:h-12" />
    case 'space-large':
      return <div className="h-16 md:h-24" />
    default:
      return (
        <div className="py-8">
          <hr className="border-t border-slate-200/60 max-w-2xl mx-auto" />
        </div>
      )
  }
}

// Alternating background colors for visual rhythm
const backgroundColors = ['white', 'gray', 'white', 'emerald', 'white', 'beige']

// Helper to generate section IDs for navigation
function generateSectionId(section: any, index: number): string {
  if (section.title) {
    return section.title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 40)
  }
  return `sectie-${index + 1}`
}

// Helper to get section title for TOC
function getSectionTitle(section: any): string | null {
  if (section._type === 'divider') return null
  return section.title || section.sectionTitle || null
}

export default async function OverDeBuurtPage() {
  const pageData = await client.fetch(overDeBuurtQuery).catch(() => null)

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
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

  // Build TOC items from sections with titles
  const tocItems = (pageData.sections || [])
    .map((section: any, index: number) => {
      const title = getSectionTitle(section)
      if (!title) return null
      return {
        id: generateSectionId(section, index),
        title,
        type: section._type,
      }
    })
    .filter(Boolean)

  // Track non-divider section index for alternating backgrounds
  let contentSectionIndex = 0

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Reading Progress Indicator */}
      <ReadingProgress />
      
      {/* Table of Contents for navigation */}
      <TableOfContents items={tocItems} />

      {/* Header - only show if no hero section first */}
      {!hasHeroFirst && (
        <div className="relative bg-gradient-to-br from-[#1E3A5F] via-[#2D5A87] to-[#152B47] pt-24 md:pt-32 pb-20 md:pb-28 overflow-hidden">
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
          
          <div className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
            <Breadcrumbs items={[
              {label: 'Home', href: '/'},
              {label: pageData.title || 'Over de buurt', href: '/over-de-buurt'},
            ]} />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-8 text-balance tracking-tight">
              {pageData.title || 'Over de buurt'}
            </h1>
            
            {/* Decorative element */}
            <div className="mt-8 flex items-center gap-4">
              <span className="w-12 h-1 bg-gradient-to-r from-white/60 to-transparent rounded-full" />
              <span className="text-white/60 text-sm font-medium tracking-wide">
                {tocItems.length} secties
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sections */}
      {pageData.sections && pageData.sections.length > 0 ? (
        <div className="relative">
          {pageData.sections.map((section: any, index: number) => {
            const key = section._key || index
            const sectionId = generateSectionId(section, index)
            
            // Skip dividers for background alternation
            const isContentSection = section._type !== 'divider'
            const bgColorKey = isContentSection 
              ? backgroundColors[contentSectionIndex % backgroundColors.length]
              : undefined
            
            if (isContentSection) {
              contentSectionIndex++
            }

            // Determine if this section should use article variant (for better typography)
            const useArticleVariant = section._type === 'textSection' || section._type === 'mediaSection'

            switch (section._type) {
              case 'heroSection':
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
                    id={sectionId}
                    title={section.title}
                    content={section.content || []}
                    columns={section.columns}
                    icon={section.icon}
                    backgroundColor={section.backgroundColor || bgColorKey}
                    textAlign={section.textAlign}
                    padding={section.padding || 'normal'}
                    button={section.button}
                    variant="article"
                  />
                )

              case 'mediaSection':
                const mediaImageUrl = section.image?.asset 
                  ? urlFor(section.image).width(1200).fit('max').auto('format').url()
                  : undefined
                return (
                  <MediaSection
                    key={key}
                    id={sectionId}
                    title={section.title}
                    content={section.content || []}
                    imageUrl={mediaImageUrl}
                    imageAlt={section.image?.alt || section.title || 'Afbeelding'}
                    layout={section.layout}
                    imageSize={section.imageSize}
                    backgroundColor={section.backgroundColor || bgColorKey}
                    textAlign={section.textAlign}
                    padding={section.padding || 'normal'}
                    button={section.button}
                    variant="article"
                  />
                )

              case 'gallerySection':
                return (
                  <GallerySection
                    key={key}
                    title={section.title}
                    images={(section.images || []).map((img: any, i: number) => ({
                      url: img.asset ? urlFor(img).width(800).fit('max').auto('format').url() : '',
                      alt: img.alt || `Foto ${i + 1}`,
                      caption: img.caption,
                    })).filter((img: any) => img.url)}
                    columns={section.columns}
                    showCaptions={section.showCaptions}
                    backgroundColor={section.backgroundColor || bgColorKey}
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
                    backgroundColor={section.backgroundColor || bgColorKey}
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
                      imageUrl: event.image?.asset ? urlFor(event.image).width(600).fit('max').auto('format').url() : undefined,
                    }))}
                    backgroundColor={section.backgroundColor || bgColorKey}
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
                    backgroundColor={section.backgroundColor || bgColorKey}
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
                    id={sectionId}
                    title={section.sectionTitle}
                    content={section.text || []}
                    imageUrl={legacyImageUrl}
                    imageAlt={section.image?.alt || section.sectionTitle || 'Afbeelding'}
                    layout={section.layout || 'text-left'}
                    backgroundColor={section.legacyStyle?.backgroundColor || bgColorKey}
                    padding="normal"
                    variant="article"
                  />
                )

              default:
                return null
            }
          })}

          {/* Elegant page end decoration */}
          <div className="py-16 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="w-8 h-px bg-slate-200" />
              <span className="w-2 h-2 rounded-full bg-slate-200" />
              <span className="w-8 h-px bg-slate-200" />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="bg-white rounded-2xl p-10 md:p-14 shadow-[0_4px_24px_-8px_rgb(30_58_95/0.08)] border border-slate-100 text-center">
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
