import { beforeAll, describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

const LEGACY_PATHS = ['src/index.html', 'src/styles.css', 'src/scene.js']

function walk(dir: string): string[] {
  const entries: string[] = []
  if (!existsSync(dir)) return entries
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) entries.push(...walk(full))
    else entries.push(full)
  }
  return entries
}

function readText(file: string): string {
  return readFileSync(file, 'utf-8')
}

beforeAll(() => {
  // Build the project so dist is fresh for the assertions below.
  execFileSync('bun', ['run', 'build'], { stdio: 'inherit' })
})

describe('@S20 Old Mario theme stack and Tweaks toolbar are gone', () => {
  it('legacy source paths are deleted', () => {
    for (const p of LEGACY_PATHS) {
      expect(existsSync(p), `expected ${p} to be deleted`).toBe(false)
    }
  })

  it('production dist contains no Tweaks toolbar strings', () => {
    const files = walk('dist').filter((f) => /\.(html|js|css|svg)$/i.test(f))
    expect(files.length).toBeGreaterThan(0)
    for (const file of files) {
      const content = readText(file)
      expect(content).not.toMatch(/tweaks/i)
      expect(content).not.toMatch(/sky palette/i)
      expect(content).not.toMatch(/fall speed/i)
      expect(content).not.toMatch(/twPalette/i)
      expect(content).not.toMatch(/twSpeed/i)
    }
  })

  it('production dist contains no Mario/lagoon scroll-theme strings', () => {
    const files = walk('dist').filter((f) => /\.(html|js|css|svg)$/i.test(f))
    for (const file of files) {
      const content = readText(file)
      expect(content).not.toMatch(/Mario/i)
      expect(content).not.toMatch(/lagoon/i)
      expect(content).not.toMatch(/scroll-driven/i)
      expect(content).not.toMatch(/faller/i)
      expect(content).not.toMatch(/speedlines/i)
    }
  })
})
