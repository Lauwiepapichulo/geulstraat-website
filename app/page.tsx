import Hero from './components/Hero'
import NewsCard from './components/NewsCard'
import BuurtActieCard from './components/BuurtActieCard'
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
  }
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
    <div>
      {/* Hero Section */}
      <Hero
        title={homepage?.heroTitle}
        subtitle={homepage?.heroSubtitle}
        imageUrl={homepage?.heroImage?.asset ? urlFor(homepage.heroImage).width(1920).fit('max').auto('format').url() : undefined}
        imageAlt={homepage?.heroImage?.alt}
      />

      {/* Over de Geulstraat Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-md">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Over de Geulstraat
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-8 max-w-4xl">
            {previewText}
          </p>
          <Link
            href="/over-de-buurt"
            className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:scale-105 min-h-[56px]"
          >
            Lees meer over de Geulstraat
          </Link>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Het laatste nieuws
          </h2>
          <p className="text-lg text-slate-600">
            Blijf op de hoogte van wat er speelt in de Geulstraat
          </p>
        </div>

        {latestNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((post: any) => (
              <NewsCard
                key={post._id}
                title={post.title}
                excerpt={post.excerpt}
                imageUrl={post.mainImage?.asset ? urlFor(post.mainImage).width(800).height(600).fit('crop').auto('format').url() : undefined}
                imageAlt={post.mainImage?.alt}
                publishedAt={post.publishedAt}
                slug={post.slug.current}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <p className="text-slate-600 text-lg">
              Er zijn nog geen nieuwsberichten. Check later terug!
            </p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/nieuws"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold text-lg"
          >
            Bekijk alle nieuwsberichten
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Buurt Acties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Buurt acties
          </h2>
          <p className="text-lg text-slate-600">
            Doe mee aan activiteiten in de buurt
          </p>
        </div>

        {upcomingActies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingActies.map((actie: any) => (
              <BuurtActieCard
                key={actie._id}
                title={actie.title}
                description={actie.description}
                imageUrl={actie.image?.asset ? urlFor(actie.image).width(800).height(600).fit('crop').auto('format').url() : undefined}
                imageAlt={actie.image?.alt}
                datetime={actie.datetime}
                location={actie.location}
                signupLink={actie.signupLink}
                slug={actie.slug.current}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <p className="text-slate-600 text-lg">
              Er zijn momenteel geen geplande buurt acties. Check later terug!
            </p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/buurt-acties"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold text-lg"
          >
            Bekijk alle buurt acties
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
