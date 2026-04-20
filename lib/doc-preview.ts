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

export async function extractDocxFirstImage(url: string): Promise<Buffer | null> {
  try {
    if (!isSanityCdnUrl(url)) return null
    const bytes = await fetchBytes(url)
    const mammoth = await import('mammoth')
    let firstImage: {buffer: Buffer; contentType: string} | null = null
    await mammoth.convertToHtml(
      {buffer: Buffer.from(bytes)},
      {
        convertImage: (mammoth as any).images.imgElement(async (image: any) => {
          if (!firstImage) {
            const buf = await image.read()
            firstImage = {
              buffer: Buffer.isBuffer(buf) ? buf : Buffer.from(buf),
              contentType: image.contentType || 'image/png',
            }
          }
          return {src: ''}
        }),
      },
    )
    return firstImage ? (firstImage as any).buffer : null
  } catch (err) {
    console.error('extractDocxFirstImage failed:', err)
    return null
  }
}

function wrapText(
  ctx: any,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const test = current ? current + ' ' + word : word
    const measured = ctx.measureText(test).width
    if (measured > maxWidth && current) {
      lines.push(current)
      current = word
      if (lines.length === maxLines - 1) {
        while (ctx.measureText(current + '...').width > maxWidth && current.length > 0) {
          current = current.slice(0, -1)
        }
        lines.push(current + '...')
        return lines
      }
    } else {
      current = test
    }
  }
  if (current && lines.length < maxLines) lines.push(current)
  return lines
}

function paragraphsFrom(text: string): string[] {
  return text
    .split(/\n+/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 0)
}

export async function renderDocPagePreviewPng(
  title: string,
  bodyText: string,
  ext: AttachmentExt,
): Promise<Buffer | null> {
  try {
    const canvasMod = await import('@napi-rs/canvas')
    const {createCanvas} = canvasMod as any

    const width = 1200
    const height = 800
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const bg = ctx.createLinearGradient(0, 0, 0, height)
    bg.addColorStop(0, '#1E3A5F')
    bg.addColorStop(1, '#152B47')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)

    const paperMargin = 60
    const paperX = paperMargin
    const paperY = paperMargin
    const paperW = width - paperMargin * 2
    const paperH = height - paperMargin * 2

    ctx.fillStyle = 'rgba(0,0,0,0.25)'
    ctx.beginPath()
    ctx.roundRect(paperX + 8, paperY + 10, paperW, paperH, 12)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(paperX, paperY, paperW, paperH, 12)
    ctx.fill()

    ctx.fillStyle = '#1E3A5F'
    ctx.beginPath()
    ctx.roundRect(paperX, paperY, paperW, 70, [12, 12, 0, 0] as any)
    ctx.fill()

    const label = ext === 'docx' || ext === 'doc' ? 'WORD' : ext === 'pdf' ? 'PDF' : 'DOCUMENT'
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.beginPath()
    ctx.roundRect(paperX + paperW - 100, paperY + 18, 80, 34, 6)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, paperX + paperW - 60, paperY + 35)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 22px sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('De Geulstraat', paperX + 30, paperY + 35)

    const contentX = paperX + 50
    const contentY = paperY + 110
    const contentW = paperW - 100

    const safeTitle = (title || 'Nieuwsbrief').trim()
    ctx.fillStyle = '#1E3A5F'
    ctx.font = 'bold 44px sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    const titleLines = wrapText(ctx, safeTitle, contentW, 2)
    let y = contentY
    for (const line of titleLines) {
      ctx.fillText(line, contentX, y)
      y += 52
    }

    ctx.strokeStyle = '#3B82A0'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(contentX, y + 14)
    ctx.lineTo(contentX + 80, y + 14)
    ctx.stroke()
    y += 46

    const paragraphs = paragraphsFrom(bodyText)
    ctx.fillStyle = '#334155'
    ctx.font = '22px sans-serif'
    const lineHeight = 32
    const bottomLimit = paperY + paperH - 60
    let linesLeftBudget = Math.floor((bottomLimit - y) / lineHeight)

    for (const para of paragraphs) {
      if (linesLeftBudget <= 0) break
      const paraLines = wrapText(ctx, para, contentW, Math.min(linesLeftBudget, 6))
      for (const line of paraLines) {
        if (y + lineHeight > bottomLimit) break
        ctx.fillText(line, contentX, y)
        y += lineHeight
        linesLeftBudget--
      }
      y += 10
      linesLeftBudget--
    }

    if (paragraphs.length === 0 || y === contentY + titleLines.length * 52 + 46) {
      ctx.fillStyle = '#94a3b8'
      ctx.font = 'italic 22px sans-serif'
      ctx.fillText('Lees de volledige nieuwsbrief door erop te klikken.', contentX, y)
    }

    return canvas.toBuffer('image/png')
  } catch (err) {
    console.error('renderDocPagePreviewPng failed:', err)
    return null
  }
}
