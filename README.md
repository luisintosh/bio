# luism.dev

Personal site for Luis Mendieta — Vite + React, deployed to GitHub Pages.

## Scripts

```bash
bun install
bun run dev
bun run build
```

Open the local URL Vite prints (often `http://127.0.0.1:5173/`).

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
