# luism.dev

Personal site for Luis Mendieta — Astro (static) with React islands, deployed to GitHub Pages.

## Scripts

```bash
pnpm install
pnpm dev
pnpm build     # type-checks, then writes the static site to dist/
pnpm preview
```

Open the local URL Astro prints (often `http://localhost:4321/`).

Pages live in `src/pages/` (`work/[slug].astro` builds one page per case study in
`src/data/content.ts`). Components render to static HTML at build time; only the ones
marked `client:*` (the sky, the hero and intro animations, SoloDev's team) load JS.
Pushing to `main` deploys via `.github/workflows/deploy.yml`.

## Hero face

The home page's particle face plays a short clip on a loop, drawn from an atlas of its
frames built once by `scripts/face-atlas/build.py` (docs at the top of that file). To use
a new clip:

```bash
python3 -m venv .venv
.venv/bin/pip install -r scripts/face-atlas/requirements.txt
.venv/bin/python scripts/face-atlas/build.py clip.mov --loop 0:4.4 --poster 4.2 --pingpong
```

`--loop` is the stretch that repeats (add `--pingpong` if its end doesn't flow into its start);
`--poster` is the frame used for the still fallback and for reduced motion. Commit the
files it writes to `public/assets/hero/` and `src/sky/face-atlas.json`.
