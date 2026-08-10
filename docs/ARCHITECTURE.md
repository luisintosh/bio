# Architecture

Single-page React portfolio built with Vite and Bun, shipped as static files to GitHub Pages. No server runtime; contact is `mailto:` only.

## Runtime flow

```
index.html (SEO head + #root)
    → src/main.tsx (hydrateRoot if prerendered, else createRoot)
        → App (src/App.tsx)
            → Hero, About, Experience, Education, Testimonials, Contact
                ← src/content/portfolio.ts
```

Production build: `vite build` writes `dist/`, then `scripts/prerender.ts` runs `renderToString(App)` and replaces the empty `#root` in `dist/index.html` so crawlers see identity and section copy without JS.

## Module map

| Path | Role |
|---|---|
| `index.html` | Vite entry; FR10 title/description/OG/Twitter/canonical locked to `https://www.luisexpert.dev/` |
| `src/main.tsx` | Client bootstrap; hydrates when `#root` already has prerendered markup |
| `src/App.tsx` | Page composition; optional `portfolio` prop for tests |
| `src/content/portfolio.ts` | Typed content: hero, about, experience, education, testimonials, contact/socials |
| `src/components/*` | Section UI (`Hero`, `AboutSection`, `ExperienceSection`, `EducationSection`, `TestimonialsSection`, `ContactSection`, `SocialLink`) |
| `src/lib/mailto.ts` | `buildContactMailto` → `hello@luisexpert.dev` subject/body from name + message |
| `src/lib/url.ts` | `isSafeHttpUrl` — gates LinkedIn `href` |
| `src/index.css` | Dark retro-futurist tokens; `prefers-reduced-motion` |
| `scripts/prerender.ts` | Post-Vite SSR inject into `dist/index.html` |
| `public/` | `favicon.ico`, `preview-image.jpg` (OG/Twitter); copied into `dist/` |
| `vite.config.ts` | React plugin; `base: './'`; `outDir: 'dist'` |
| `.github/workflows/deploy.yml` | Bun → `bun run build` → upload `./dist` → GitHub Pages |

## Tests

| Layer | Location | Runner |
|---|---|---|
| Unit / component | `src/**/*.test.{ts,tsx}`, `tests/*.test.ts` | `bun run test` (Vitest) |
| Dist SEO / artifact | `src/seo/dist-seo.test.ts` | Vitest against built `dist/` (after `bun run build`) |
| E2E / viewports | `e2e/*.spec.ts` | `bun run test:e2e` (Playwright preview on `:4173`) |

## Out of scope for this surface

Multi-route app, CMS, auth, analytics product work, backend contact API, light theme.
