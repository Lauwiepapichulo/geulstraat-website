import 'server-only'

export type AttachmentExt = 'pdf' | 'docx' | 'doc' | 'other'

export function detectExt(url: string, filename?: string, mime?: string): AttachmentExt {
  const lower = (filename || url || '').toLowerCase()
  if (mime?.includes('pdf') || lower.endsWith('.pdf')) return 'pdf'
  if (mime?.includes('wordprocessingml') || lower.endsWith('.docx')) return 'docx'
  if (mime?.includes('msword') || lower.endsWith('.doc')) return 'doc'
  return 'other'
}

export function isSanityCdnUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.hostname === 'cdn.sanity.io'
  } catch {
    return false
  }
}

async function fetchBytes(url: string): Promise<Uint8Array> {
  const res = await fetch(url, {
    next: {revalidate: 3600},
  })
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
  const buf = await res.arrayBuffer()
  return new Uint8Array(buf)
}

function clean(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
}

function firstSentences(text: string, maxLength = 220): string {
  const cleaned = clean(text)
  if (!cleaned) return ''
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned]
  let out = ''
  for (const s of sentences) {
    if ((out + s).length > maxLength) break
    out += s + ' '
  }
  out = out.trim()
  if (!out) out = cleaned.slice(0, maxLength).trim() + (cleaned.length > maxLength ? '...' : '')
  return out
}

async function extractPdfText(bytes: Uint8Array): Promise<string> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const loadingTask = (pdfjs as any).getDocument({
    data: bytes,
    useSystemFonts: true,
    isEvalSupported: false,
    disableFontFace: true,
  })
  const doc = await loadingTask.promise
  let text = ''
  const maxPages = Math.min(doc.numPages, 3)
  for (let i = 1; i <= maxPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map((it: any) => ('str' in it ? it.str : '')).join(' ')
    text += pageText + ' '
    if (text.length > 600) break
  }
  await doc.cleanup?.()
  return text
}

async function extractDocxText(bytes: Uint8Array): Promise<string> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({buffer: Buffer.from(bytes)})
  return result.value || ''
}

export async function extractExcerpt(url: string, ext: AttachmentExt, maxLength = 220): Promise<string> {
  try {
    if (ext === 'other') return ''
    if (!isSanityCdnUrl(url)) return ''
    const bytes = await fetchBytes(url)
    let raw = ''
    if (ext === 'pdf') raw = await extractPdfText(bytes)
    else if (ext === 'docx') raw = await extractDocxText(bytes)
    else if (ext === 'doc') return ''
    return firstSentences(raw, maxLength)
  } catch (err) {
    console.error('extractExcerpt failed:', err)
    return ''
  }
}

export async function renderPdfThumbnail(url: string, width = 800): Promise<Buffer | null> {
  try {
    if (!isSanityCdnUrl(url)) return null
    const bytes = await fetchBytes(url)
    const [pdfjs, canvasMod] = await Promise.all([
      import('pdfjs-dist/legacy/build/pdf.mjs'),
      import('@napi-rs/canvas'),
    ])
    const loadingTask = (pdfjs as any).getDocument({
      data: bytes,
      useSystemFonts: true,
      isEvalSupported: false,
      disableFontFace: true,
    })
    const doc = await loadingTask.promise
    const page = await doc.getPage(1)
    const viewport = page.getViewport({scale: 1})
    const scale = width / viewport.width
    const scaled = page.getViewport({scale})

    const {createCanvas} = canvasMod as any
    const canvas = createCanvas(Math.ceil(scaled.width), Math.ceil(scaled.height))
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    await page.render({
      canvasContext: ctx as any,
      viewport: scaled,
      canvas: canvas as any,
    }).promise

    const png = canvas.toBuffer('image/png')
    await doc.cleanup?.()
    return png
  } catch (err) {
    console.error('renderPdfThumbnail failed:', err)
    return null
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function renderDocPlaceholderSvg(title: string, ext: AttachmentExt): string {
  const label = ext === 'docx' || ext === 'doc' ? 'WORD' : ext === 'pdf' ? 'PDF' : 'DOCUMENT'
  const safeTitle = escapeXml((title || 'Nieuwsbrief').slice(0, 60))
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1E3A5F"/>
      <stop offset="100%" stop-color="#152B47"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <g transform="translate(400,220)">
    <rect x="-80" y="-100" width="160" height="200" rx="10" fill="#ffffff" opacity="0.95"/>
    <rect x="-80" y="-100" width="160" height="40" rx="10" fill="#3B82A0"/>
    <rect x="-60" y="-30" width="120" height="8" rx="4" fill="#cbd5e1"/>
    <rect x="-60" y="-10" width="100" height="8" rx="4" fill="#cbd5e1"/>
    <rect x="-60" y="10" width="120" height="8" rx="4" fill="#cbd5e1"/>
    <rect x="-60" y="30" width="80" height="8" rx="4" fill="#cbd5e1"/>
    <rect x="-60" y="50" width="110" height="8" rx="4" fill="#cbd5e1"/>
    <text x="0" y="-68" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#ffffff">${label}</text>
  </g>
  <text x="400" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#ffffff">${safeTitle}</text>
  <text x="400" y="480" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#ffffff" opacity="0.8">De Geulstraat</text>
</svg>`
}

export async function renderDocPlaceholderPng(title: string, ext: AttachmentExt): Promise<Buffer | null> {
  try {
    const canvasMod = await import('@napi-rs/canvas')
    const {createCanvas, GlobalFonts} = canvasMod as any

    const width = 800
    const height = 600
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const grad = ctx.createLinearGradient(0, 0, 0, height)
    grad.addColorStop(0, '#1E3A5F')
    grad.addColorStop(1, '#152B47')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    const cardX = width / 2 - 80
    const cardY = 120
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.beginPath()
    ctx.roundRect(cardX, cardY, 160, 200, 10)
    ctx.fill()

    ctx.fillStyle = '#3B82A0'
    ctx.beginPath()
    ctx.roundRect(cardX, cardY, 160, 40, [10, 10, 0, 0] as any)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 22px sans-serif'
    ctx.textAlign = 'center'
    const label = ext === 'docx' || ext === 'doc' ? 'WORD' : ext === 'pdf' ? 'PDF' : 'DOCUMENT'
    ctx.fillText(label, width / 2, cardY + 28)

    ctx.fillStyle = '#cbd5e1'
    const lines = [
      {x: cardX + 20, y: cardY + 90, w: 120},
      {x: cardX + 20, y: cardY + 110, w: 100},
      {x: cardX + 20, y: cardY + 130, w: 120},
      {x: cardX + 20, y: cardY + 150, w: 80},
      {x: cardX + 20, y: cardY + 170, w: 110},
    ]
    for (const l of lines) {
      ctx.beginPath()
      ctx.roundRect(l.x, l.y, l.w, 8, 4)
      ctx.fill()
    }

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 32px sans-serif'
    ctx.textAlign = 'center'
    const safeTitle = (title || 'Nieuwsbrief').slice(0, 60)
    ctx.fillText(safeTitle, width / 2, 430)

    ctx.font = '20px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.fillText('De Geulstraat', width / 2, 470)

    return canvas.toBuffer('image/png')
  } catch (err) {
    console.error('renderDocPlaceholderPng failed:', err)
    return null
  }
}
