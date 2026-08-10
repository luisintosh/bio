import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'

const html = existsSync('index.html') ? readFileSync('index.html', 'utf-8') : ''

function parseMetaTags(html: string): Record<string, string> {
  const meta: Record<string, string> = {}
  for (const match of html.matchAll(/<meta\s+([^>]+)>/gi)) {
    const attrs = match[1]
    const name = attrs.match(/name="([^"]+)"/i)?.[1] || attrs.match(/property="([^"]+)"/i)?.[1]
    const content = attrs.match(/content="([^"]+)"/i)?.[1]
    if (name && content) meta[name] = content
  }
  return meta
}

function getTitle(html: string): string {
  return html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? ''
}

function getCanonical(html: string): string {
  return html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1] ?? ''
}

describe('@S6 Document head includes title, description, social, and canonical tags', () => {
  const meta = parseMetaTags(html)

  it('title reads "Luis Mendieta — Software Engineer"', () => {
    expect(getTitle(html)).toMatch(/Luis Mendieta\s*[-—]\s*Software Engineer/)
  })

  it('meta description reads as the senior/AI full-stack tagline', () => {
    expect(meta.description).toBeDefined()
    expect(meta.description).toMatch(/Lead Full-Stack AI Engineer.*React.*Node\.js.*NestJS/)
  })

  it('Open Graph tags are present and locked to the production domain', () => {
    expect(meta['og:title']).toBeDefined()
    expect(meta['og:title']).toMatch(/Luis Mendieta/i)
    expect(meta['og:description']).toBeDefined()
    expect(meta['og:description']).toMatch(/Lead Full-Stack AI Engineer/i)
    expect(meta['og:type']).toBe('website')
    expect(meta['og:url']).toBe('https://www.luisexpert.dev/')
    expect(meta['og:image']).toBe('https://www.luisexpert.dev/preview-image.jpg')
  })

  it('Twitter Card tags are present and correct', () => {
    expect(meta['twitter:card']).toBe('summary_large_image')
    expect(meta['twitter:title']).toBeDefined()
    expect(meta['twitter:title']).toMatch(/Luis Mendieta/i)
    expect(meta['twitter:description']).toBeDefined()
    expect(meta['twitter:description']).toMatch(/Lead Full-Stack AI Engineer/i)
    expect(meta['twitter:image']).toBe('https://www.luisexpert.dev/preview-image.jpg')
    expect(meta['twitter:creator']).toBe('@luisintosh')
  })

  it('canonical URL is locked to the custom domain', () => {
    expect(getCanonical(html)).toBe('https://www.luisexpert.dev/')
  })
})
