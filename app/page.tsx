import Hero from './components/Hero'
import NewsCard from './components/NewsCard'
import BuurtActieCard from './components/BuurtActieCard'
import FadeIn, {StaggerContainer, StaggerItem} from './components/FadeIn'
import Link from 'next/link'
import {client} from '@/lib/sanity.client'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

// Query for homepage content
const homepageQuery = `*[_type == "homepage"][0] {
  heroTitle,
  heroSubtitle,
  heroImage {
    asset->,
    crop,
    hotspot,
    alt
  },
  enableSlideshow,
  heroSlides[] {
    image {
      asset->,
      crop,
      hotspot
    },
    alt
  },
  slideshowInterval,
  slideshowTransition
}`

// Query for Over de Buurt page (for preview)
const overDeBuurtQuery = `*[_type == "overDeBuurt" && _id == "over-de-buurt-singleton"][0] {
  content[0...2]
}`

// Query for latest 3 news posts
const latestNewsQuery = `*[_type == "post"] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage {
    asset->,
    crop,
    hotspot,
    alt
  }
}`

// Query for upcoming 3 buurt acties
const upcomingActiesQuery = `*[_type == "buurtActie" && datetime > now()] | order(datetime asc)[0...3] {
  _id,
  title,
  slug,
  datetime,
  location,
  description,
  signupLink,
  image {
    asset->,
    crop,
    hotspot,
    alt
  }
}`

function extractTextPreview(content: any[]): string {
  if (!content || content.length === 0) return ''
  
  const textBlocks = content
    .filter((block: any) => block._type === 'block')
    .flatMap((block: any) => block.children || [])
    .filter((child: any) => child._type === 'span' && child.text)
    .map((child: any) => child.text)
  
  return textBlocks.join(' ').slice(0, 280) + (textBlocks.join(' ').length > 280 ? '...' : '')
}

export default async function Home() {
  // Fetch all data
  const homepage = await client.fetch(homepageQuery).catch(() => null)
  const overDeBuurt = await client.fetch(overDeBuurtQuery).catch(() => null)
  const latestNews = await client.fetch(latestNewsQuery).catch(() => [])
  const upcomingActies = await client.fetch(upcomingActiesQuery).catch(() => [])

  const previewText = overDeBuurt?.content 
    ? extractTextPreview(overDeBuurt.content)
    : 'De Geulstraat is een bruisende straat in de Rivierenbuurt met betrokken bewoners en een duidelijk eigen karakter. In de twintigste eeuw ontwikkelde de straat zich als woon- en schoolstraat binnen Plan Zuid, met drie scholen die het straatbeeld en het dagelijks leven lange tijd bepaalden.'

  return (
    <div className="bg-[#FAFBFC]">
      {/* Hero Section */}
      <Hero
        title={homepage?.heroTitle}
        subtitle={homepage?.heroSubtitle}
        imageUrl={homepage?.heroImage?.asset ? urlFor(homepage.heroImage).width(1600).quality(80).fit('max').auto('format').url() : undefined}
        imageAlt={homepage?.heroImage?.alt || "De Geulstraat"}
        enableSlideshow={homepage?.enableSlideshow === true}
        slides={
          homepage?.heroSlides
            ?.filter((slide: any) => slide?.image?.asset)
            ?.map((slide: any) => ({
              url: urlFor(slide.image).width(1600).quality(80).fit('max').auto('format').url(),
              alt: slide.alt || 'Banner foto'
            })) || []
        }
        slideshowInterval={homepage?.slideshowInterval || 5}
        slideshowTransition={homepage?.slideshowTransition || 'fade'}
      />

      {/* Over de Geulstraat Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn>
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Over de Geulstraat
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-4xl">
              {previewText}
            </p>
            <Link
              href="/over-de-buurt"
              className="inline-flex items-center justify-center bg-[#1E3A5F] hover:bg-[#152B47] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg min-h-[56px]"
            >
              Lees meer over de Geulstraat
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-gradient-to-b from-[#FAFBFC] to-[#F3F4F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Het laatste nieuws
              </h2>
              <p className="text-lg text-slate-500">
                Blijf op de hoogte van wat er speelt in de Geulstraat
              </p>
            </div>
          </FadeIn>

          {latestNews.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestNews.map((post: any) => (
                <StaggerItem key={post._id}>
                  <NewsCard
                    title={post.title}
                    excerpt={post.excerpt}
                    imageUrl={post.mainImage?.asset ? urlFor(post.mainImage).width(800).fit('max').auto('format').url() : undefined}
                    imageAlt={post.mainImage?.alt || post.title}
                    publishedAt={post.publishedAt}
                    slug={post.slug.current}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <FadeIn>
              <div className="bg-white rounded-xl p-12 text-center shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60">
                <p className="text-slate-500 text-lg">
                  Er zijn nog geen nieuwsberichten. Check later terug!
                </p>
              </div>
            </FadeIn>
          )}

          <FadeIn delay={0.3}>
            <div className="text-center mt-12">
              <Link
                href="/nieuws"
                className="inline-flex items-center text-[#1E3A5F] hover:text-[#152B47] font-semibold text-lg group"
              >
                Bekijk alle nieuwsberichten
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Buurt Acties Section */}
      <section className="py-20 bg-[#FAFBFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Buurt acties
              </h2>
              <p className="text-lg text-slate-500">
                Doe mee aan activiteiten in de buurt
              </p>
            </div>
          </FadeIn>

          {upcomingActies.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingActies.map((actie: any) => (
                <StaggerItem key={actie._id}>
                  <BuurtActieCard
                    title={actie.title}
                    description={actie.description}
                    imageUrl={actie.image?.asset ? urlFor(actie.image).width(800).fit('max').auto('format').url() : undefined}
                    imageAlt={actie.image?.alt || actie.title}
                    datetime={actie.datetime}
                    location={actie.location}
                    signupLink={actie.signupLink}
                    slug={actie.slug.current}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <FadeIn>
              <div className="bg-white rounded-xl p-12 text-center shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60">
                <p className="text-slate-500 text-lg">
                  Er zijn momenteel geen geplande buurt acties. Check later terug!
                </p>
              </div>
            </FadeIn>
          )}

          <FadeIn delay={0.3}>
            <div className="text-center mt-12">
              <Link
                href="/buurt-acties"
                className="inline-flex items-center text-[#1E3A5F] hover:text-[#152B47] font-semibold text-lg group"
              >
                Bekijk alle buurt acties
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
