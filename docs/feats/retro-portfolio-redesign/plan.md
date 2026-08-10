# Plan: Retro portfolio redesign

## Approaches considered

1. **CSR React SPA only (Vite + React, client render into empty `#root`)** — Reuses `vite.config.ts` `outDir: '../dist'` / `base: './'` (migrated from today’s `vite.config.js`) and `.github/workflows/deploy.yml` Bun → `bun run build` → upload `./dist`, but `dist/index.html` would lack About/Experience/Education/Testimonials body text and would tempt client-only meta injection, failing FR11 / `@S17` (and risking `@S6` if meta is Helmet-only).

2. **Vite + React with build-time prerender of the single page (recommended)** — Same Pages artifact shape as today (`defineConfig` in `vite.config.ts`, deploy path `./dist`), plus a small `renderToString` (or equivalent) step so production `dist/index.html` ships identity, section substance, and FR10 tags in the initial document. Satisfies crawlability without a server runtime (FR12 / `@S9`).

3. **Multi-route SSG framework (e.g. Vike / full meta-framework)** — Heavier than a one-page portfolio; FR7/assumption 1 lock a single-page surface. Extra routing/SEO surface is unused cost versus approved React + Vite static delivery.

**Recommendation:** Approach 2. It meets FR13 (React + Vite), FR12 (static Pages), and FR11/`@S17` without inventing a multi-page framework. Reject 1 because crawlable body + head are acceptance-gated. Reject 3 as overkill for a single-page content site.

## Approach

Replace the plain HTML/CSS/JS Mario/lagoon site (`src/index.html`, `src/styles.css`, `src/scene.js`) with a **Vite 7 + React** static app. Keep Bun scripts and GitHub Pages CI. Author UI as React components driven by a **content/config module** (sections + social URLs). Put FR10 meta + canonical in the HTML shell (not client-only). **Prerender** the page at build so `dist/index.html` contains primary copy. Contact keeps today’s mailto handoff pattern. Redesign `public/preview-image.jpg` for the dark brand. Remove Tweaks and scroll-toy UX entirely.

### AGENTS.md target (workspace file is stale)

Ignore the Deno HTTP `AGENTS.md` for stack truth. After this feature, `AGENTS.md` should describe:

| | |
|---|---|
| install | `bun install` |
| dev | `bun run dev` |
| build | `bun run build` |
| preview | `bun run preview` |
| test | `bun run test` (Vitest) · `bun run test:e2e` (Playwright) |
| lint / typecheck | as introduced (`bun run lint` / `bunx tsc --noEmit` or Vite-aligned equivalents) |

Conventions: React + TypeScript under `src/`, Vite config at repo root, static assets in `public/`, content in a data module, deploy via `.github/workflows/deploy.yml` → `./dist`.

## Affected modules / files

| Path | Change |
|---|---|
| `package.json` | Add `react`, `react-dom`, `@vitejs/plugin-react`, TypeScript types; Vitest + Testing Library; Playwright; scripts `test`, `test:e2e` (and prerender hook on `build` if separate) |
| `bun.lock` | **Regenerate** via Bun after dependency changes (same SL1 pass as `package.json`) |
| `vite.config.ts` (migrate from `vite.config.js`) | React plugin; keep `base: './'`, `publicDir`, `outDir: '../dist'` (or root-based equivalent); Vitest `test` config; prerender integration |
| `tsconfig.json` / `tsconfig.app.json` | **Create** — React TS project references as needed |
| `index.html` (Vite entry at conventional root; replaces `src/index.html`) | FR10 meta + canonical (copied from legacy head); mount `#root`; no Mario markup / Tweaks |
| `src/main.tsx`, `src/App.tsx` | **Create** — bootstrap + page composition |
| `src/content/portfolio.ts` (or `.json` + typed loader) | **Create** — About, Experience, Education, Testimonials, contact copy, social URLs |
| `src/components/*` | **Create** — Hero, About, Experience, Education, Testimonials, Contact, SocialLink |
| `src/styles/*` or `src/index.css` | **Create** — dark retro-futurist tokens; `prefers-reduced-motion` |
| `src/lib/mailto.ts`, `src/lib/url.ts` | **Create** — mailto builder; http(s) URL guard for LinkedIn |
| `scripts/prerender.ts` (or vite plugin) | **Create** — write prerendered HTML into `dist` |
| `public/preview-image.jpg` | **Replace** — dark retro-futurist OG image (1200×630 class); keep recoverable copy at `public/preview-image.legacy.jpg` until human brand gate |
| `public/favicon.ico` | Keep |
| `src/index.html` | **Delete** after copying FR10 head strings into root `index.html` and section meaning into `portfolio` content — entire Mario scroll body/scripts (≈1,897 lines) must not remain as entry or primary UX |
| `src/scene.js`, `src/styles.css`, Mario assets (`src/shot.jpg`, `src/mobile-about.jpg` if unused) | **Delete** — FR14 / `@S20` |
| `.github/workflows/deploy.yml` | Fix cache hash from missing `bun.lockb` → `bun.lock`; keep Bun install + `bun run build` + `./dist` |
| `README.md` | Reflect React + Vite (docs-writer may own; implementer touches if needed for accuracy) |
| `AGENTS.md`, `docs/CONSTITUTION.md` | Stale Deno harness — see Blockers / human decisions (not silent design-around) |

## Existing code to reuse

| Reuse | Role |
|---|---|
| `vite.config.js` → `vite.config.ts` `defineConfig` (`root`/`base`/`publicDir`/`build.outDir`) | Preserve relative `base: './'` and `../dist` Pages artifact shape when migrating root layout |
| `package.json` scripts `dev` / `build` / `preview` | Keep Bun entrypoints; extend with test + prerender |
| `.github/workflows/deploy.yml` jobs `build` / `deploy` | Same Bun → build → `upload-pages-artifact` path `./dist` |
| `src/index.html` head lines 7–32 | Exact FR10 title/description/OG/Twitter strings and `https://www.luisexpert.dev/` absolute URLs (add missing `link rel="canonical"`) |
| `src/index.html` About/Experience/Education blocks (~1141–1242) | Canonical section meaning/org labels for `portfolio` content module |
| `src/index.html` Contact markup + `wireForm` (~1295–1317, ~1801–1819) | Name + Message + Send; `mailto:hello@luisexpert.dev` subject `LuisExpert.dev message from ${name}` / body `${message}\n\n— ${name}`; LinkedIn `target="_blank"` `rel="noopener noreferrer"` |
| `public/favicon.ico` | Unchanged static asset |
| Testimonials | **No reuse** — not on origin site; copy from `spec.md` FR15 into content module |

Do **not** reuse: `applyTweaks` / `wireTweaks` / scroll `updateScene` in `src/index.html` or `src/scene.js`; pastel theme CSS; hero-sub `hello, i'm`.

## Data / API changes

- No backend API. Contact = client validation + local thanks + `mailto:` only.
- Content/socials: single typed module (e.g. `src/content/portfolio.ts`) importable by UI and by tests with fixture overrides for `@S16`, `@S23`, `@S12`.
- Production SEO host locked to `https://www.luisexpert.dev/` (not `*.github.io`).

## Risks / trade-offs

| Risk | Mitigation |
|---|---|
| CSR-only build fails `@S17` | Mandatory prerender (or equivalent) on production `build`; SEO tests read `dist/index.html` |
| Client-only meta (react-helmet without SSR) fails crawlers | Static tags in HTML entry; prerender must not strip them |
| `deploy.yml` caches `bun.lockb` but repo has `bun.lock` | Fix hashFiles in same CI touch as React build |
| Mailto cannot be fully asserted in headless browsers | Unit-test mailto URL builder; component tests mock `location`/`assign`; E2E asserts ack + no duplicate success |
| Double-submit / multiple mailto | Submit lock or disable Send until settled; single success node |
| Contrast / brand `@S7` subjective | CSS variables with documented token pairs; automate contrast where practical; QA visual check |
| Preview image brand `@S18` | New asset under `public/preview-image.jpg`; machine checks reachability + image content-type + OG/Twitter URL match; human brand gate confirms “not legacy / dark retro-futurist” |
| Stale `docs/CONSTITUTION.md` (Deno) vs FR13 | Blocker — refresh constitution; do not implement Deno |

## Test strategy

Introduce runners in slice 1 (they do not exist today — only `dev`/`build`/`preview`).

| Layer | Tool | Command | Scenarios |
|---|---|---|---|
| Unit | Vitest | `bun run test` | Mailto builder, URL guard, empty-section selectors, SEO fixture rejection helpers |
| Component | Vitest + Testing Library | `bun run test` | `@S1`–`@S5`, `@S10`–`@S12`, `@S15`, `@S16`, `@S22`, `@S23` (fixtures for empty/invalid content) |
| Build / artifact (SL4 only) | Vitest or node assert on `dist` after build | `bun run build && bun run test -- src/seo/` (or `bun run test:seo`) — run only after SL4 prerender + preview-image replacement | `@S6`, `@S9`, `@S13`, `@S17`, `@S18` (file exists + image content-type; brand “not legacy” is human gate), `@S20` (no Tweaks/Mario strings in `dist/`) |
| E2E / viewport (SL4) | Playwright | `bun run test:e2e` | `@S7` (dark theme + contrast smoke), `@S8`, `@S14`, `@S19`, `@S21` |

Map every `@S<n>` → layer above; no scenario left unclaimed (see Slices).

## Slices

### SL1 — React+Vite scaffold, runners, SEO shell, kill Mario stack

- **risk:** `standard` — introduces the React+Vite production path and removes old primary UX (`@S9`, `@S20`); static FR10 head is behavior under `@S6`.
- **scenarios:** `@S9`, `@S20`, `@S6` (head tags present in entry HTML; full dist acceptance completed in SL4 after prerender)
- **reading:**
  - `package.json` — current Bun scripts to extend
  - `vite.config.js` — `base` / `outDir` / `publicDir` to preserve into `vite.config.ts`
  - `.github/workflows/deploy.yml` — Bun + `./dist` Pages pattern; fix `bun.lockb` → `bun.lock`
  - `src/index.html` (head ~7–32) — SEO strings to copy into new root entry **before deleting** this file
  - `README.md` — documents plain HTML stack being replaced
- **implementation targets:**
  - `package.json` — add React/Vite plugin/TS/Vitest/Playwright deps; scripts `test`, `test:e2e`; regenerate `bun.lock` via Bun
  - `vite.config.ts` `defineConfig` — `@vitejs/plugin-react`; Vitest config; keep Pages-compatible `base`/`outDir` (replace `vite.config.js`)
  - new `src/main.tsx` / `src/App.tsx` — minimal mount (placeholder shell OK until SL2; body identity asserted in SL2/SL4)
  - new root `index.html` — FR10 meta + `link rel="canonical" href="https://www.luisexpert.dev/"`; `#root` (copy title/description/OG/Twitter strings from legacy head)
  - `.github/workflows/deploy.yml` — cache `hashFiles('**/bun.lock')`
  - delete Mario primary UX: `src/index.html` (full file after head/content copied), `src/scene.js`, `src/styles.css`, Tweaks/`#tweaksPanel` paths, Mario assets if unused
- **targeted test command:** `bun run test && bun run build`
- **done when:** `bun run build` emits `./dist` containing a React-built bundle; **authored entry and `dist/index.html` head** include FR10 title equivalent to `Luis Mendieta — Software Engineer`, meta description, OG/Twitter tags, and canonical `https://www.luisexpert.dev/` (body “Luis Mendieta” / section substance deferred to SL2 content + SL4 prerender); `rg`/`grep` over **`dist/` only** shows no Tweaks toolbar / “scroll to dive” / Mario faller strings; `src/index.html` and `src/scene.js` are absent from the tree; `bun.lock` exists and is consistent with `package.json`; `bun run test` executes at least one passing Vitest smoke; Playwright installed and `test:e2e` script exists (may no-op or smoke until SL4).
- **rollback:** Revert scaffold commit(s); restore `src/index.html` + `src/scene.js` + prior `package.json` / `bun.lock` / deploy cache key / `vite.config.js`.

### SL2 — Content module + Link Board sections + dark brand

- **risk:** `standard` — all section/`@S1`–`@S4`/`@S22` behavior and empty-content counterparts.
- **scenarios:** `@S1`, `@S2`, `@S3`, `@S4`, `@S16`, `@S22`, `@S23`
- **reading:**
  - `src/index.html` About/Experience/Education (~1141–1242) — meaning to preserve (read before SL1 delete, or from git history / content already extracted)
  - `docs/feats/retro-portfolio-redesign/spec.md` FR15 — five testimonials
  - `docs/feats/retro-portfolio-redesign/contracts/portfolio-content.feature` — acceptance wording
  - `vite.config.ts` — alias/root once scaffolded (pattern for importing content)
- **implementation targets:**
  - `src/content/portfolio.ts` (create) — `portfolio` export: hero, about, experience[], education[], testimonials[], contact copy defaults
  - `src/App.tsx` `App` — compose Hero → About → Experience → Education → Testimonials → Contact regions
  - `src/components/Hero.tsx` `Hero` — name-first + senior/AI full-stack role; **no** `hello, i'm Luis Mendieta`
  - `src/components/AboutSection.tsx`, `ExperienceSection.tsx`, `EducationSection.tsx`, `TestimonialsSection.tsx` — render from content; omit empty sections without fabricating rows
  - `src/index.css` (or tokens module) — dark retro-futurist palette; body text contrast ≥ 4.5:1 against immediate background (theme/viewport acceptance evidenced in SL4 via `@S7`/`@S19`)
- **targeted test command:** `bun run test -- src/components src/content`
- **done when:** Vitest/Testing Library shows “Luis Mendieta” + Lead Full-Stack / Software Engineer role in hero; About asserts 8+ years, LangGraph/LangChain, “No vibe coding.”, skill chips; Experience shows both roles with 2025—Now and 2020—2025; Education lists five credentials/years; Testimonials shows all five names with role + quote; fixture with empty About/Experience/Education/Testimonials still renders identity and non-empty sections with zero fabricated jobs/edu/quotes.
- **rollback:** Revert content/components CSS commit; leave SL1 shell.

### SL3 — Contact form, mailto handoff, LinkedIn URL guard

- **risk:** `standard` — interactive contact and social counterpart scenarios.
- **scenarios:** `@S5`, `@S10`, `@S11`, `@S12`, `@S15`
- **reading:**
  - `src/index.html` `wireForm` (~1801–1819) — mailto subject/body pattern to preserve (from git / pre-delete extract)
  - `src/index.html` contact markup (~1295–1317) — fields + LinkedIn rel
  - `docs/feats/retro-portfolio-redesign/contracts/contact.feature` — success/empty/rapid/invalid LinkedIn
  - `src/content/portfolio.ts` — social URL field shape from SL2
- **implementation targets:**
  - `src/lib/mailto.ts` `buildContactMailto` — `hello@luisexpert.dev` + subject/body from name/message
  - `src/lib/url.ts` `isSafeHttpUrl` — gate LinkedIn href
  - `src/components/ContactSection.tsx` `ContactSection` — prompt “say hi” / drop-a-note copy; Name; Message; Send; single success acknowledgment; submit locking for rapid double-send
  - `src/components/SocialLink.tsx` `SocialLink` — render LinkedIn only when URL passes guard; `target="_blank"` + `rel` including `noopener` (and `noreferrer`)
- **targeted test command:** `bun run test -- src/components/ContactSection src/lib`
- **done when:** Valid submit shows one thanks acknowledgment and initiates mailto to `hello@luisexpert.dev` with derived subject/body (assert via mocked navigation); empty Name or Message shows required-field feedback and does not mailto; rapid double Send leaves ≤1 success message and ≤1 mailto invocation; missing/invalid LinkedIn URL yields no clickable empty/invalid LinkedIn control while form remains usable.
- **rollback:** Revert contact/lib files; page keeps sections without interactive contact.

### SL4 — Prerender, SEO acceptance, preview image, responsive + motion E2E

- **risk:** `standard` — crawlability, SEO rejection, OG asset, viewport/motion/theme behavior.
- **scenarios:** `@S6`, `@S7`, `@S8`, `@S13`, `@S14`, `@S17`, `@S18`, `@S19`, `@S21`
- **reading:**
  - `docs/feats/retro-portfolio-redesign/contracts/seo-and-delivery.feature` — head/canonical/image/build
  - `docs/feats/retro-portfolio-redesign/contracts/responsive.feature` — 390 / 320 / 1280 / reduced motion
  - entry `index.html` FR10 tags from SL1
  - `public/preview-image.jpg` — legacy asset to replace (currently Canva OG JPEG)
  - `.github/workflows/deploy.yml` — confirm `bun run build` still uploads prerendered `./dist`
- **implementation targets:**
  - `scripts/prerender.ts` (or vite plugin) — prerender `App` into `dist/index.html` `#root` (or replace placeholder) so identity + section text exist without JS
  - `package.json` `build` — runs Vite build + prerender
  - `public/preview-image.jpg` — redesigned dark retro-futurist image; copy legacy bytes to `public/preview-image.legacy.jpg` first; referenced as `https://www.luisexpert.dev/preview-image.jpg`
  - `src/index.css` — `@media (prefers-reduced-motion: reduce)` disables non-essential motion; dark tokens/contrast for `@S7`
  - `e2e/*.spec.ts` — Playwright viewports 390×844, 320-wide, 1280×800; computed dark background + contrast smoke (`@S7`); first-viewport composition (`@S19`); reduced-motion Contact/LinkedIn
  - `src/seo/*.test.ts` (or equivalent) — parse `dist/index.html` head for FR10 tags and assert tag-equivalent to authored entry `index.html` head; fail clearly when title/description/canonical/OG/Twitter missing (`@S13`); assert primary copy present in HTML body (`@S17`); assert `dist/preview-image.jpg` exists and is a successful image payload (content-type / magic bytes) matching `og:image`/`twitter:image` URLs — **do not** machine-assert “differs from legacy hash”; brand “not legacy / dark retro-futurist” is the human gate
- **targeted test command:** Replace `public/preview-image.jpg` (after saving legacy to `public/preview-image.legacy.jpg`), then `bun run build && bun run test -- src/seo && bun run test:e2e`
- **done when:** Built `dist/index.html` contains FR10 title/description/OG/Twitter/canonical/`og:url`/`og:image`/`twitter:image` locked to `https://www.luisexpert.dev/` and `…/preview-image.jpg` without relying on client-only injection; prerendered `dist` head is tag-equivalent to the authored entry head; stripping or omitting a required tag fails `@S13` with identifiable field; HTML body includes “Luis Mendieta” and section substance (incl. testimonials when populated) pre-JS; `dist/preview-image.jpg` is a reachable image asset whose URL matches head `og:image`/`twitter:image`; Playwright passes dark-theme/contrast smoke (`@S7`), mobile/narrow/desktop composition (`@S19`), and reduced-motion Contact/LinkedIn without motion gating content. Brand match for `@S18` is confirmed at the human gate (not a mid-slice hash diff).
- **rollback:** Drop prerender step from `build`; restore `public/preview-image.jpg` from `public/preview-image.legacy.jpg` (or from git); leave CSR shell (site would regress `@S17`/`@S18` until fixed). Remove `preview-image.legacy.jpg` only after human brand gate passes.

## Scenario coverage checklist

| Scenario | Slice |
|---|---|
| @S1 | SL2 |
| @S2 | SL2 |
| @S3 | SL2 |
| @S4 | SL2 |
| @S5 | SL3 |
| @S6 | SL1 (shell) + SL4 (dist acceptance) |
| @S7 | SL4 |
| @S8 | SL4 |
| @S9 | SL1 |
| @S10 | SL3 |
| @S11 | SL3 |
| @S12 | SL3 |
| @S13 | SL4 |
| @S14 | SL4 |
| @S15 | SL3 |
| @S16 | SL2 |
| @S17 | SL4 |
| @S18 | SL4 |
| @S19 | SL4 |
| @S20 | SL1 |
| @S21 | SL4 |
| @S22 | SL2 |
| @S23 | SL2 |

## Human decisions

1. **Hero microcopy** — Exact recruiter-facing headline/subline beyond locked name + Software Engineer / Lead Full-Stack AI Engineer role signal (must not use legacy `hello, i'm Luis Mendieta`).
2. **OG preview art** — Approve the redesigned `public/preview-image.jpg` (dark retro-futurist) for `@S18`.
3. **Governance docs** — Refresh stale Deno `AGENTS.md` / `docs/CONSTITUTION.md` to Bun + Vite + React static-site rules (see Blockers).

## Blockers

1. **`docs/CONSTITUTION.md` conflicts with approved FR13** — Constitution requires Deno `handler`, JSR-only, and `Deno.test`; this feature’s locked stack is React + Vite + Bun/GitHub Pages. Do not design a Deno server. Human must update or waive constitution before treating it as governing this repo’s mainline.
2. **Workspace `AGENTS.md` is stale** — Same harness drift; plan above defines the target command table. Conductor/docs-writer should replace Deno instructions so later stages do not reintroduce wrong runners.
