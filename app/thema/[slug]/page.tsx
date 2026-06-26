import {notFound} from 'next/navigation'
import Image from 'next/image'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import NewsCard from '@/app/components/NewsCard'
import BuurtActieCard from '@/app/components/BuurtActieCard'
import TeamSignupForm from '@/app/components/TeamSignupForm'
import {client} from '@/lib/sanity.client'
import imageUrlBuilder from '@sanity/image-url'
import {getTheme, themes} from '@/lib/themes'

const builder = imageUrlBuilder(client)
function urlFor(source: any) {
  return builder.image(source)
}

const actiesQuery = `*[_type == "buurtActie" && isArchived != true && $theme in themes] | order(datumTBD desc, datetime asc) {
  _id, title, slug, datetime, datumTBD, location, description, signupLink, acceptsRegistrations,
  image { asset->, crop, hotspot, alt }
}`

const newsQuery = `*[_type == "post" && isArchived != true && defined(title) && $theme in themes] | order(publishedAt desc) {
  _id, title, slug, publishedAt, "bodyText": pt::text(body),
  mainImage { asset->, crop, hotspot, alt }
}`

function generateExcerpt(bodyText: string | null, maxLength = 160): string {
  if (!bodyText) return ''
  const sentences = bodyText.match(/[^.!?]+[.!?]+/g) || []
  let excerpt = ''
  for (const sentence of sentences.slice(0, 3)) {
    if ((excerpt + sentence).length > maxLength) break
    excerpt += sentence
  }
  if (!excerpt) {
    excerpt = bodyText.slice(0, maxLength)
    if (bodyText.length > maxLength) excerpt += '...'
  }
  return excerpt.trim()
}

export async function generateStaticParams() {
  return themes.map((t) => ({slug: t.value}))
}

export async function generateMetadata({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const theme = getTheme(slug)
  if (!theme) return {title: 'Thema niet gevonden'}
  return {
    title: `${theme.name}: ${theme.tagline} - De Geulstraat`,
    description: theme.tagline,
  }
}

// Render een alinea en maak URLs klikbaar
function renderParagraph(text: string, key: number, linkColor: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g)
  return (
    <p key={key} className="text-lg text-slate-700 leading-relaxed mb-4 last:mb-0">
      {parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium break-words hover:opacity-80"
              style={{color: linkColor}}
            >
              {part.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </a>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </p>
  )
}

export default async function ThemaPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const theme = getTheme(slug)
  if (!theme) notFound()

  const [acties, news] = await Promise.all([
    client.fetch(actiesQuery, {theme: theme.value}).catch(() => []),
    client.fetch(newsQuery, {theme: theme.value}).catch(() => []),
  ])

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <div
        className="pt-24 md:pt-28 pb-16 md:pb-20"
        style={{background: `linear-gradient(135deg, ${theme.color} 0%, ${theme.colorHover} 100%)`}}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              {label: 'Home', href: '/'},
              {label: theme.name, href: `/thema/${theme.value}`},
            ]}
          />
          <div className="flex flex-col md:flex-row items-center gap-8 mt-6">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white/50 flex-shrink-0 shadow-xl">
              <Image src={theme.badge} alt={theme.name} fill className="object-cover" sizes="160px" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">{theme.name}</h1>
              <p className="text-2xl md:text-3xl text-white/90 font-medium">{theme.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* Toelichting */}
        <section>
          <div className="bg-white rounded-xl p-8 md:p-10 shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60 max-w-4xl">
            {theme.description.map((para, i) => renderParagraph(para, i, theme.color))}
          </div>
        </section>

        {/* Acties */}
        <section>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Acties</h2>
          {acties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {acties.map((actie: any) => (
                <BuurtActieCard
                  key={actie._id}
                  title={actie.title}
                  description={actie.description}
                  imageUrl={actie.image?.asset ? urlFor(actie.image).width(800).fit('max').auto('format').url() : undefined}
                  imageAlt={actie.image?.alt || actie.title}
                  datetime={actie.datetime}
                  datumTBD={actie.datumTBD}
                  location={actie.location}
                  signupLink={actie.signupLink}
                  acceptsRegistrations={actie.acceptsRegistrations !== false}
                  slug={actie.slug?.current || actie._id}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-10 text-center shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60">
              <p className="text-slate-500 text-lg">Er zijn nog geen acties voor dit thema. Houd de pagina in de gaten!</p>
            </div>
          )}
        </section>

        {/* Nieuws */}
        <section>
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Nieuws</h2>
          {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((post: any) => (
                <NewsCard
                  key={post._id}
                  title={post.title}
                  excerpt={generateExcerpt(post.bodyText)}
                  imageUrl={post.mainImage?.asset ? urlFor(post.mainImage).width(800).fit('max').auto('format').url() : undefined}
                  imageAlt={post.mainImage?.alt || post.title}
                  publishedAt={post.publishedAt}
                  slug={post.slug?.current || post._id}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-10 text-center shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60">
              <p className="text-slate-500 text-lg">Er is nog geen nieuws voor dit thema.</p>
            </div>
          )}
        </section>

        {/* Team aanmelding */}
        <section>
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-[0_4px_20px_-4px_rgb(30_58_95/0.08)] border border-slate-200/60 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Meld je aan voor het {theme.name}</h2>
            <p className="text-slate-500 mb-8">
              Wil je meedoen? Laat je gegevens achter en we nemen contact met je op.
            </p>
            <TeamSignupForm teamName={theme.name} teamValue={theme.value} color={theme.color} colorHover={theme.colorHover} />
          </div>
        </section>
      </div>
    </div>
  )
}

export const revalidate = 0
