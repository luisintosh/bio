# luis-website

A static site built with plain HTML, CSS, and JavaScript. Vite is used only as a bundler to minify and optimize the output for production; deployment is handled by GitHub Actions to GitHub Pages.

## Layout

```
src/
  index.html   — entry page
  style.css    — plain CSS
  script.js    — plain JS module
public/        — static assets copied as-is (favicon, images, etc.)
vite.config.js — Vite config (root: 'src', outDir: '../dist', base: './')
```

Edit the three files in `src/`. Drop any unprocessed static assets into `public/`.

## Develop

```sh
bun install
bun run dev
```

Open the URL shown in the terminal. Changes hot-reload.

## Build

```sh
bun run build
```

Outputs a minified, hashed bundle into `./dist`. Preview the built site locally with `bun run preview`.

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds and publishes `./dist` to GitHub Pages.
