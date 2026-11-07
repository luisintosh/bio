import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const page = (path: string) => resolve(import.meta.dirname, path)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so GitHub Pages (custom domain or /bio/) resolves assets.
  base: './',
  build: {
    rolldownOptions: {
      input: {
        main: page('index.html'),
        act: page('work/act/index.html'),
        solodev: page('work/solodev/index.html'),
        ultra: page('work/ultra/index.html'),
      },
    },
  },
})
