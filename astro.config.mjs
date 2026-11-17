// @ts-check
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Custom domain on GitHub Pages (public/CNAME), so no `base`.
  site: 'https://www.luism.dev',
  trailingSlash: 'always',
  integrations: [react(), sitemap()],
})
