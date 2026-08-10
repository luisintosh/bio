# AGENTS.md

React + Vite personal portfolio (TypeScript). Package manager: Bun. Static build to `./dist` for GitHub Pages.

## Commands

| | |
|---|---|
| install | `bun install` |
| dev | `bun run dev` |
| build | `bun run build` (Vite + `scripts/prerender.ts`) |
| preview | `bun run preview` |
| test | `bun run test` (Vitest) |
| test:e2e | `bun run test:e2e` (Playwright; needs `bunx playwright install chromium` once) |
| typecheck | `bunx tsc --noEmit` |

## Conventions

- React + TypeScript under [`src/`](src/). Vite entry: root [`index.html`](index.html); config: [`vite.config.ts`](vite.config.ts).
- Portfolio copy and social URLs: [`src/content/portfolio.ts`](src/content/portfolio.ts). Static assets: [`public/`](public/).
- Unit/component tests: Vitest + Testing Library. E2E: Playwright under [`e2e/`](e2e/).
- Prefer extending the single-page `App` composition over adding routes or frameworks.
- Deploy: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) → `./dist`.

## Docs

- System map: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- Governing principles: [`docs/CONSTITUTION.md`](docs/CONSTITUTION.md)
- Feature artifacts: `docs/feats/<slug>/`
- Human setup (Pages domain, Playwright): [`README.md`](README.md) `## Configuration`
