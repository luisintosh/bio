import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import App from '../src/App'

const distHtmlPath = resolve(import.meta.dirname, '../dist/index.html')
const html = readFileSync(distHtmlPath, 'utf-8')
const markup = renderToString(createElement(App))

if (!html.includes('<div id="root"></div>')) {
  throw new Error('prerender: expected empty <div id="root"></div> in dist/index.html')
}

const out = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
writeFileSync(distHtmlPath, out)
console.log('prerender: wrote App markup into dist/index.html #root')
