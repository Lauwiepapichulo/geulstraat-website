import {notFound} from 'next/navigation'
import Image from 'next/image'
import {PortableText} from '@portabletext/react'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import {client} from '@/lib/sanity.client'
import {Calendar} from 'lucide-react'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

const postQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishedAt,
  mainImage {
    asset->,
    crop,
    hotspot,
    alt
  },
  body
}`

const portableTextComponents = {
  types: {
    image: ({value}: any) => {
      // Skip rendering if no valid image asset
      if (!value?.asset) {
        return null
      }
      
      const imageUrl = urlFor(value).width(1200).fit('max').auto('format').url()
      
      // Double check we have a valid URL
      if (!imageUrl) {
        return null
      }
      
      return (
        <figure className="my-8">
          <Image
            src={imageUrl}
            alt={value.alt || 'Afbeelding'}
            width={800}
            height={600}
            className="rounded-lg w-full"
            unoptimized
          />
          {value.caption && (
            <figcaption className="text-sm text-slate-500 mt-3 text-center italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({children}: any) => (
      <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>
    ),
    h3: ({children}: any) => (
      <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h3>
    ),
    normal: ({children}: any) => (
      <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
    ),
    blockquote: ({children}: any) => (
      <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 italic text-gray-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({children}: any) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    number: ({children}: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
    ),
  },
  marks: {
    strong: ({children}: any) => <strong className="font-bold">{children}</strong>,
    em: ({children}: any) => <em className="italic">{children}</em>,
  },
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const post = await client.fetch(postQuery, {slug}).catch(() => null)

  if (!post) {
    notFound()
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[{label: 'Nieuws', href: '/nieuws'}, {label: post.title}]}
      />

      <article>
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center text-gray-600 mb-6">
            <Calendar className="h-5 w-5 mr-2" aria-hidden="true" />
            <time dateTime={post.publishedAt}>{formattedDate}</time>
          </div>

        </header>

        {/* Main Image */}
        {post.mainImage?.asset && (
          <div className="relative w-full h-[400px] md:h-[500px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={urlFor(post.mainImage).width(1920).fit('max').auto('format').url()}
              alt={post.mainImage.alt || 'Nieuwsartikel afbeelding'}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        {/* Body Content */}
        <div className="prose prose-lg max-w-none">
          <PortableText value={post.body} components={portableTextComponents} />
        </div>
      </article>
    </div>
  )
}

export async function generateStaticParams() {
  const posts = await client
    .fetch(`*[_type == "post"] { slug }`)
    .catch(() => [])

  return posts.map((post: any) => ({
    slug: post.slug.current,
  }))
}

export const revalidate = 0
