import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '../..')
const DIST_HTML = resolve(ROOT, 'dist/index.html')
const ENTRY_HTML = resolve(ROOT, 'index.html')
const DIST_PREVIEW = resolve(ROOT, 'dist/preview-image.jpg')

const PRODUCTION_ORIGIN = 'https://www.luisexpert.dev/'
const PREVIEW_IMAGE_URL = 'https://www.luisexpert.dev/preview-image.jpg'

const FR10_FIELDS = [
  'title',
  'description',
  'canonical',
  'og:title',
  'og:description',
  'og:type',
  'og:url',
  'og:image',
  'twitter:card',
  'twitter:title',
  'twitter:description',
  'twitter:image',
  'twitter:creator',
] as const

type Fr10Field = (typeof FR10_FIELDS)[number]
type Fr10Snapshot = Partial<Record<Fr10Field, string>>

function parseMetaTags(html: string): Record<string, string> {
  const meta: Record<string, string> = {}
  for (const match of html.matchAll(/<meta\s+([^>]+)>/gi)) {
    const attrs = match[1]
    const name =
      attrs.match(/name="([^"]+)"/i)?.[1] ||
      attrs.match(/property="([^"]+)"/i)?.[1]
    const content = attrs.match(/content="([^"]+)"/i)?.[1]
    if (name && content) meta[name] = content
  }
  return meta
}

function getTitle(html: string): string {
  return html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? ''
}

function getCanonical(html: string): string {
  return (
    html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1] ??
    html.match(/<link[^>]*href="([^"]+)"[^>]*rel="canonical"/i)?.[1] ??
    ''
  )
}

function extractFr10(html: string): Fr10Snapshot {
  const meta = parseMetaTags(html)
  return {
    title: getTitle(html) || undefined,
    description: meta.description,
    canonical: getCanonical(html) || undefined,
    'og:title': meta['og:title'],
    'og:description': meta['og:description'],
    'og:type': meta['og:type'],
    'og:url': meta['og:url'],
    'og:image': meta['og:image'],
    'twitter:card': meta['twitter:card'],
    'twitter:title': meta['twitter:title'],
    'twitter:description': meta['twitter:description'],
    'twitter:image': meta['twitter:image'],
    'twitter:creator': meta['twitter:creator'],
  }
}

/** Returns FR10 field names that are absent or empty — identifiable for @S13. */
function missingFr10Fields(html: string): Fr10Field[] {
  const snap = extractFr10(html)
  return FR10_FIELDS.filter((field) => !snap[field]?.trim())
}

function normalizeSeoText(value: string): string {
  return value
    .replace(/&mdash;|&#8212;|—/g, '-')
    .replace(/&ndash;|&#8211;|–/g, '-')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function titlesEquivalent(a: string, b: string): boolean {
  return normalizeSeoText(a).toLowerCase() === normalizeSeoText(b).toLowerCase()
}

function bodyHtmlWithoutScripts(html: string): string {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? ''
  return body.replace(/<script\b[\s\S]*?<\/script>/gi, '')
}

function isImageMagic(bytes: Uint8Array): boolean {
  const jpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  const png =
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  return jpeg || png
}

function readDistHtml(): string {
  expect(existsSync(DIST_HTML), 'dist/index.html missing — run bun run build first').toBe(true)
  return readFileSync(DIST_HTML, 'utf-8')
}

describe('@S6 Document head includes title, description, social, and canonical tags', () => {
  it('dist/index.html head has FR10 tags locked to production URLs', () => {
    const html = readDistHtml()
    const meta = parseMetaTags(html)
    const missing = missingFr10Fields(html)

    expect(missing, `FR10 missing fields: ${missing.join(', ') || '(none)'}`).toEqual([])
    expect(getTitle(html)).toMatch(/Luis Mendieta\s*[-—]\s*Software Engineer/)
    expect(meta.description).toMatch(/Lead Full-Stack AI Engineer.*React.*Node\.js.*NestJS/)
    expect(meta['og:type']).toBe('website')
    expect(meta['og:url']).toBe(PRODUCTION_ORIGIN)
    expect(meta['og:image']).toBe(PREVIEW_IMAGE_URL)
    expect(meta['twitter:card']).toBe('summary_large_image')
    expect(meta['twitter:image']).toBe(PREVIEW_IMAGE_URL)
    expect(meta['twitter:creator']).toBe('@luisintosh')
    expect(getCanonical(html)).toBe(PRODUCTION_ORIGIN)
  })

  it('dist head is tag-equivalent to authored entry index.html head', () => {
    const dist = extractFr10(readDistHtml())
    const entry = extractFr10(readFileSync(ENTRY_HTML, 'utf-8'))

    for (const field of FR10_FIELDS) {
      expect(dist[field], `dist missing FR10 field: ${field}`).toBeTruthy()
      expect(entry[field], `entry missing FR10 field: ${field}`).toBeTruthy()
      if (field === 'title' || field === 'description' || field === 'og:title' || field === 'og:description' || field === 'twitter:title' || field === 'twitter:description') {
        expect(
          titlesEquivalent(dist[field]!, entry[field]!),
          `${field} not tag-equivalent between dist and entry`,
        ).toBe(true)
      } else {
        expect(dist[field], `${field} differs between dist and entry`).toBe(entry[field])
      }
    }
  })
})

describe('@S13 Absent SEO essentials fail acceptance', () => {
  it('identifies each missing FR10 field when tags are stripped', () => {
    const complete = readDistHtml()
    const cases: Array<{ field: Fr10Field; mutilate: (html: string) => string }> = [
      { field: 'title', mutilate: (h) => h.replace(/<title>[^<]*<\/title>/i, '') },
      {
        field: 'description',
        mutilate: (h) => h.replace(/<meta\s+name="description"[^>]*>/i, ''),
      },
      {
        field: 'canonical',
        mutilate: (h) => h.replace(/<link[^>]*rel="canonical"[^>]*>/i, ''),
      },
      {
        field: 'og:image',
        mutilate: (h) => h.replace(/<meta\s+property="og:image"[^>]*>/i, ''),
      },
      {
        field: 'twitter:card',
        mutilate: (h) => h.replace(/<meta\s+name="twitter:card"[^>]*>/i, ''),
      },
    ]

    for (const { field, mutilate } of cases) {
      const missing = missingFr10Fields(mutilate(complete))
      expect(missing, `expected identifiable missing field ${field}`).toContain(field)
    }
  })

  it('rejects an empty head as not meeting FR10 with identifiable fields', () => {
    const missing = missingFr10Fields('<html><head></head><body></body></html>')
    expect(missing.length).toBeGreaterThan(0)
    expect(missing).toEqual(expect.arrayContaining([...FR10_FIELDS]))
  })
})

describe('@S17 Primary content is available without interaction gates', () => {
  it('dist body contains Luis Mendieta and section substance without JS', () => {
    const html = readDistHtml()
    const body = bodyHtmlWithoutScripts(html)

    expect(body, 'identity missing from prerendered body').toMatch(/Luis Mendieta/)
    expect(body, 'About substance missing from prerendered body').toMatch(/About/i)
    expect(body, 'Experience substance missing from prerendered body').toMatch(/Experience/i)
    expect(body, 'Education substance missing from prerendered body').toMatch(/Education/i)
    expect(body, 'Testimonials substance missing from prerendered body').toMatch(/Testimonials/i)
    expect(
      body,
      'populated testimonial substance missing from prerendered body',
    ).toMatch(/Lance Blackstone|Paulo Lima|Oleg Statnii/)
    expect(body, 'Contact substance missing from prerendered body').toMatch(/Contact|say hi/i)

    // Head FR10 must not depend solely on client injection (present in static HTML).
    expect(missingFr10Fields(html), `FR10 missing in static head: ${missingFr10Fields(html).join(', ')}`).toEqual([])
  })
})

describe('@S18 Redesigned social preview image URL is reachable', () => {
  it('dist/preview-image.jpg exists as image bytes and matches og/twitter image URLs', () => {
    expect(existsSync(DIST_PREVIEW), 'dist/preview-image.jpg missing from build output').toBe(true)

    const bytes = new Uint8Array(readFileSync(DIST_PREVIEW))
    expect(bytes.byteLength, 'preview-image.jpg is empty').toBeGreaterThan(0)
    expect(isImageMagic(bytes), 'preview-image.jpg is not a JPEG/PNG image payload').toBe(true)

    const meta = parseMetaTags(readDistHtml())
    expect(meta['og:image']).toBe(PREVIEW_IMAGE_URL)
    expect(meta['twitter:image']).toBe(PREVIEW_IMAGE_URL)
  })
})
