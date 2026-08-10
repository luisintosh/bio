import { expect, test, type Page } from '@playwright/test'

function parseRgb(color: string): [number, number, number] | null {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (!m) return null
  return [Number(m[1]), Number(m[2]), Number(m[3])]
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const channel = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrastRatio(fg: string, bg: string): number {
  const a = parseRgb(fg)
  const b = parseRgb(bg)
  if (!a || !b) return 0
  const L1 = relativeLuminance(a)
  const L2 = relativeLuminance(b)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

async function isDarkBackground(page: Page): Promise<boolean> {
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  const rgb = parseRgb(bg)
  if (!rgb) return false
  const [r, g, b] = rgb
  // Dark theme smoke: average channel well below mid-gray.
  return (r + g + b) / 3 < 80
}

test.describe('@S7 Dark theme + contrast smoke', () => {
  test('first viewport presents a dark background with readable body contrast', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    expect(await isDarkBackground(page), 'expected dark-mode page background').toBe(true)

    // Primary body copy (About), not hero accent (.hero-role) — @S7 requires ≥4.5:1.
    const { color, backgroundColor } = await page.evaluate(() => {
      const el =
        document.querySelector('main .section p') ?? document.body
      const style = getComputedStyle(el)
      let bgEl: Element | null = el
      let backgroundColor = style.backgroundColor
      while (bgEl && (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent')) {
        bgEl = bgEl.parentElement
        if (!bgEl) break
        backgroundColor = getComputedStyle(bgEl).backgroundColor
      }
      return {
        color: style.color,
        backgroundColor,
      }
    })

    const ratio = contrastRatio(color, backgroundColor)
    expect(
      ratio,
      `contrast ${ratio.toFixed(2)}:1 below 4.5:1 for ${color} on ${backgroundColor}`,
    ).toBeGreaterThanOrEqual(4.5)
  })
})
