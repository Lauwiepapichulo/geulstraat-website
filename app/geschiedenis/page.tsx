import Breadcrumbs from '../components/Breadcrumbs'
import {PortableText} from '@portabletext/react'
import Image from 'next/image'
import {client} from '@/lib/sanity.client'

const pageQuery = `*[_type == "page" && slug.current == "geschiedenis"][0] {
  _id,
  title,
  content
}`

const portableTextComponents = {
  types: {
    image: ({value}: any) => (
      <div className="my-8">
        <Image
          src={value.asset.url}
          alt={value.alt || 'Afbeelding'}
          width={800}
          height={600}
          className="rounded-lg"
          unoptimized
        />
        {value.caption && (
          <p className="text-sm text-gray-600 mt-2 text-center">{value.caption}</p>
        )}
      </div>
    ),
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

export const metadata = {
  title: 'Geschiedenis - Buurtplatform',
  description: 'De geschiedenis van onze buurt',
}

export default async function GeschiedenisPage() {
  const page = await client.fetch(pageQuery).catch(() => null)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{label: 'Geschiedenis'}]} />

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
        {page?.title || 'Geschiedenis'}
      </h1>

      {page?.content ? (
        <div className="prose prose-lg max-w-none">
          <PortableText value={page.content} components={portableTextComponents} />
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-12">
          <p className="text-gray-700 text-lg leading-relaxed">
            Deze pagina wordt binnenkort gevuld met de rijke geschiedenis van onze buurt.
            Van de eerste bewoners tot de ontwikkelingen van vandaag de dag.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mt-4">
            Heb je oude foto's of verhalen over de buurt? Neem contact op met het bestuur!
          </p>
        </div>
      )}
    </div>
  )
}
