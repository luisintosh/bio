import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))

function mergedDeps(): Record<string, string> {
  return {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
  }
}

describe('@S9 Static React+Vite build deploys to GitHub Pages', () => {
  const deps = mergedDeps()

  it('React app entry exists at src/main.tsx', () => {
    expect(existsSync('src/main.tsx')).toBe(true)
  })

  it('React root component exists at src/App.tsx', () => {
    expect(existsSync('src/App.tsx')).toBe(true)
  })

  it('root index.html exists and mounts the React app', () => {
    expect(existsSync('index.html')).toBe(true)
    const html = readFileSync('index.html', 'utf-8')
    expect(html).toMatch(/id=["']root["']/)
    expect(html).toMatch(/src\/main\.(tsx|jsx)/)
  })

  it('vite.config.ts uses the React plugin and keeps Pages settings', () => {
    expect(existsSync('vite.config.ts')).toBe(true)
    const config = readFileSync('vite.config.ts', 'utf-8')
    expect(config).toContain('@vitejs/plugin-react')
    expect(config).toMatch(/base\s*:/)
    expect(config).toMatch(/outDir\s*:/)
  })

  it('legacy vite.config.js is replaced by vite.config.ts', () => {
    expect(existsSync('vite.config.js')).toBe(false)
  })

  it('package.json includes the approved React+Vite+TypeScript+Vitest+Playwright dependencies', () => {
    expect(deps.react).toBeDefined()
    expect(deps['react-dom']).toBeDefined()
    expect(deps['@vitejs/plugin-react']).toBeDefined()
    expect(deps.typescript).toBeDefined()
    expect(deps.vitest).toBeDefined()
    expect(deps['@playwright/test']).toBeDefined()
  })

  it('package.json has test and test:e2e scripts', () => {
    expect(pkg.scripts.test).toBeDefined()
    expect(pkg.scripts['test:e2e']).toBeDefined()
  })

  it('CI workflow caches the current bun lockfile', () => {
    const workflow = readFileSync('.github/workflows/deploy.yml', 'utf-8')
    expect(workflow).toContain("hashFiles('**/bun.lock')")
    expect(workflow).not.toContain("hashFiles('**/bun.lockb')")
  })
})
