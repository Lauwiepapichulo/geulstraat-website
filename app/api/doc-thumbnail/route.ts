import {NextRequest} from 'next/server'
import {
  detectExt,
  isSanityCdnUrl,
  renderPdfThumbnail,
  renderDocPlaceholderPng,
  renderDocPlaceholderSvg,
} from '@/lib/doc-preview'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CACHE_HEADERS = {
  'Cache-Control':
    'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800, immutable',
}

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url)
  const url = searchParams.get('url')
  const title = searchParams.get('title') || 'Nieuwsbrief'
  const filename = searchParams.get('filename') || undefined

  if (!url) {
    return new Response('Missing url param', {status: 400})
  }
  if (!isSanityCdnUrl(url)) {
    return new Response('Only cdn.sanity.io urls allowed', {status: 400})
  }

  const ext = detectExt(url, filename)

  if (ext === 'pdf') {
    const png = await renderPdfThumbnail(url, 800)
    if (png) {
      return new Response(new Uint8Array(png), {
        status: 200,
        headers: {
          ...CACHE_HEADERS,
          'Content-Type': 'image/png',
        },
      })
    }
  }

  if (ext === 'docx' || ext === 'doc' || ext === 'pdf') {
    const png = await renderDocPlaceholderPng(title, ext)
    if (png) {
      return new Response(new Uint8Array(png), {
        status: 200,
        headers: {
          ...CACHE_HEADERS,
          'Content-Type': 'image/png',
        },
      })
    }
    const svg = renderDocPlaceholderSvg(title, ext)
    return new Response(svg, {
      status: 200,
      headers: {
        ...CACHE_HEADERS,
        'Content-Type': 'image/svg+xml',
      },
    })
  }

  return new Response('Unsupported file type', {status: 415})
}
