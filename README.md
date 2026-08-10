# luis-website

Personal portfolio for [Luis Mendieta](https://www.luisexpert.dev/) — a React + Vite static site with a dark retro-futurist brand, deployed to GitHub Pages.

## Develop

```sh
bun install
bun run dev
```

Open the URL shown in the terminal. Changes hot-reload.

First-time Playwright browsers (for `bun run test:e2e`):

```sh
bunx playwright install chromium
```

## Build

```sh
bun run build
```

Runs Vite, then `scripts/prerender.ts`, which injects server-rendered `App` markup into `dist/index.html` so crawlers see portfolio copy without executing JS. Preview locally with `bun run preview`.

## Deploy

Pushes to `main` trigger [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): Bun install → `bun run build` → publish `./dist` to GitHub Pages.

Production SEO (canonical, Open Graph, Twitter) is locked to `https://www.luisexpert.dev/` in [`index.html`](index.html). Correct meta on the default `*.github.io` host is not required.

## Configuration

No application environment variables.

| Variable | Required | Purpose | Where the value comes from |
| -------- | -------- | ------- | -------------------------- |
| `CI` | no | Playwright: stricter retries/reporter; do not reuse an existing preview server | Set automatically by GitHub Actions; local runs omit it |

### External setup

1. **GitHub Pages** — repo Settings → Pages: source **GitHub Actions** (workflow above).
2. **Custom domain** — point `luisexpert.dev` / `www.luisexpert.dev` DNS at GitHub Pages and set the custom domain in the Pages settings so `https://www.luisexpert.dev/` serves this build.
3. **Playwright** — after `bun install`, run `bunx playwright install chromium` once per machine before `bun run test:e2e`.

Contact uses client-side `mailto:hello@luisexpert.dev` (no email API key or backend).

## Gotchas

- Copy and social URLs live in `src/content/portfolio.ts`; empty sections are omitted rather than fabricated.
- `bun run build` must include prerender — a Vite-only CSR `dist/index.html` lacks crawlable section body text.
- OG/Twitter image is `public/preview-image.jpg`, referenced as `https://www.luisexpert.dev/preview-image.jpg`.
