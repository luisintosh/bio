#!/usr/bin/env python3
"""
Turns a short clip of Luis into the hero's face atlas: one small tile per frame, holding
what the particles need (brightness, depth, and where the person is), plus a still
halftone poster for browsers without WebGL2.

Setup (once):
    python3 -m venv .venv
    .venv/bin/pip install -r scripts/face-atlas/requirements.txt

Run:
    .venv/bin/python scripts/face-atlas/build.py clip.mov --loop 0:4.4 --poster 4.2 --pingpong

    --loop START:END   seconds of the clip the hero plays on repeat. Its end should flow
                       into its start; if it doesn't, add --pingpong.
    --pingpong         play forward then backward, for a stretch whose ends don't match.
    --fps N            frames per second kept from it (default 15; the hero blends between
                       neighbouring frames, so the motion stays smooth).
    --cols N           tiles per atlas row (default 10). Keep the atlas within 4096 px a
                       side, which many phones can't exceed: at 256 px tiles that's 16x16,
                       so lower --fps for long clips.
    --poster SECONDS   the frame used for the still poster and for reduced motion: ideally
                       facing the camera, eyes open.

Film against a plain backdrop: the person is cut out by its colour, sampled from the
frame's top corners (keep them clear of hair and hands), with depth as a backstop.

The depth model (Depth Anything V2 Small, ONNX, ~100 MB) downloads on first run to
~/.cache/luism/. Everything runs locally.

Writes (commit all four):
    public/assets/hero/face-luma.webp    brightness, contrast-boosted, 0 = dark
    public/assets/hero/face-depth.webp   0 outside the person; inside, 0.25 (far) to 1 (near)
    public/assets/hero/face-poster.webp  halftone still of the front-facing frame
    src/sky/face-atlas.json              tile size, grid, frame count, fps, poster frame
"""

from __future__ import annotations

import argparse
import json
import math
import urllib.request
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
MODEL_URL = 'https://huggingface.co/onnx-community/depth-anything-v2-small/resolve/main/onnx/model.onnx'
MODEL_PATH = Path.home() / '.cache' / 'luism' / 'depth-anything-v2-small.onnx'
MEAN = np.array([0.485, 0.456, 0.406], np.float32)
STD = np.array([0.229, 0.224, 0.225], np.float32)
INK = (28, 28, 28)

# Below this fraction of the crop's height there is only shirt (the neck ends above it).
# Clamping it to the shirt's own darkness removes the printed logo.
SHIRT_FROM = 0.74


def parse_range(text: str) -> tuple[float, float]:
    start, end = text.split(':')
    return float(start), float(end)


def load_model(path: Path) -> ort.InferenceSession:
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        print(f'Downloading depth model to {path}')
        urllib.request.urlretrieve(MODEL_URL, path)
    return ort.InferenceSession(str(path), providers=['CPUExecutionProvider'])


def read_frames(video: Path, indices: list[int]) -> dict[int, np.ndarray]:
    cap = cv2.VideoCapture(str(video))
    wanted = set(indices)
    frames: dict[int, np.ndarray] = {}
    i = 0
    while wanted - frames.keys():
        ok, frame = cap.read()
        if not ok:
            break
        if i in wanted:
            frames[i] = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        i += 1
    cap.release()
    missing = wanted - frames.keys()
    if missing:
        raise SystemExit(f'Clip ended before frames {sorted(missing)[:5]}')
    return frames


def sample_indices(start_s: float, end_s: float, count: int, fps: float, total: int) -> list[int]:
    a, b = round(start_s * fps), round(end_s * fps)
    out = [round(a + (b - a) * i / (count - 1)) for i in range(count)]
    return [min(max(i, 0), total - 1) for i in out]


def backdrop(rgb: np.ndarray) -> np.ndarray:
    """Pixels close to the backdrop's colour, sampled from the frame's top corners."""
    s = max(8, rgb.shape[0] // 25)
    corners = np.concatenate([rgb[:s, :s].reshape(-1, 3), rgb[:s, -s:].reshape(-1, 3)])
    colour = np.median(corners, axis=0)
    return np.abs(rgb.astype(np.int16) - colour.astype(np.int16)).max(axis=2) < 16


def crop_box(frames: list[np.ndarray]) -> tuple[int, int, int]:
    """A fixed square crop, centred on the head across all frames."""
    h, w = frames[0].shape[:2]
    centres = []
    for f in frames:
        head = ~backdrop(f[: int(h * 0.4)])
        cols = np.where(head.any(axis=0))[0]
        if cols.size:
            centres.append((cols[0] + cols[-1]) / 2)
    cx = float(np.median(centres)) if centres else w / 2
    side = min(h, w)
    x0 = int(min(max(cx - side / 2, 0), w - side))
    return x0, 0, side


def depth_of(sess: ort.InferenceSession, rgb: np.ndarray) -> np.ndarray:
    """Relative inverse depth (larger is nearer), same size as the input."""
    h, w = rgb.shape[:2]
    x = cv2.resize(rgb.astype(np.float32) / 255, (518, 518), interpolation=cv2.INTER_CUBIC)
    x = ((x - MEAN) / STD).transpose(2, 0, 1)[None].astype(np.float32)
    out = sess.run(None, {sess.get_inputs()[0].name: x})[0].reshape(518, 518)
    return cv2.resize(out, (w, h), interpolation=cv2.INTER_CUBIC)


def person_mask(depth: np.ndarray, rgb: np.ndarray) -> np.ndarray:
    """Soft 0..1 mask of the person: near in depth, and not the backdrop's colour."""
    # The backdrop's colour does most of the work. Depth only drops what is clearly far, with
    # a loose threshold: a hand raised close to the camera stretches the depth range, and a
    # tighter cut (Otsu's, say) would then keep the hand and lose the face behind it.
    lo, hi = np.percentile(depth, [1, 99])
    near = depth > lo + 0.12 * (hi - lo)
    m = (near & ~backdrop(rgb)).astype(np.uint8)

    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, k)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, k, iterations=2)

    # Keep the big pieces (a raised hand the crop cuts off from the body is its own piece),
    # drop specks, and fill any holes (bright skin can look like backdrop).
    n, labels, stats, _ = cv2.connectedComponentsWithStats(m)
    if n > 1:
        areas = stats[1:, cv2.CC_STAT_AREA]
        m = np.isin(labels, 1 + np.flatnonzero(areas >= areas.max() * 0.04)).astype(np.uint8)
    flood = m.copy()
    cv2.floodFill(flood, np.zeros((m.shape[0] + 2, m.shape[1] + 2), np.uint8), (0, 0), 1)
    m = m | (1 - flood)

    return cv2.GaussianBlur(m.astype(np.float32), (0, 0), 2.5)


def tone(rgb: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """Brightness with local contrast, stretched within the person, logo removed."""
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    gray = cv2.createCLAHE(clipLimit=2.4, tileGridSize=(8, 8)).apply(gray).astype(np.float32) / 255
    inside = mask > 0.5
    lo, hi = np.percentile(gray[inside], [2, 98])
    lum = np.clip((gray - lo) / max(hi - lo, 1e-3), 0, 1) ** 1.1

    shirt = np.zeros_like(inside)
    shirt[int(lum.shape[0] * SHIRT_FROM) :] = True
    shirt &= inside
    if shirt.any():
        lum[shirt] = np.minimum(lum[shirt], np.median(lum[shirt]))
    return np.where(mask > 0.02, lum, 1.0)


def encode_depth(depth: np.ndarray, mask: np.ndarray) -> np.ndarray:
    inside = mask > 0.5
    lo, hi = np.percentile(depth[inside], [2, 98])
    d = np.clip((depth - lo) / max(hi - lo, 1e-6), 0, 1)
    d = cv2.GaussianBlur(d, (0, 0), 3)
    return mask * (0.25 + 0.75 * d)


def process(sess, rgb: np.ndarray, box: tuple[int, int, int], tile: int):
    x0, y0, side = box
    crop = rgb[y0 : y0 + side, x0 : x0 + side]
    depth = depth_of(sess, crop)
    mask = person_mask(depth, crop)
    lum = tone(crop, mask)
    enc = encode_depth(depth, mask)
    small = lambda a: cv2.resize(a.astype(np.float32), (tile, tile), interpolation=cv2.INTER_AREA)
    return small(lum), small(enc), lum, mask


def halftone_poster(lum: np.ndarray, mask: np.ndarray, size: int = 1100, step: int = 8) -> Image.Image:
    lum = cv2.resize(lum, (size, size), interpolation=cv2.INTER_AREA)
    mask = cv2.resize(mask, (size, size), interpolation=cv2.INTER_AREA)
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for row, y in enumerate(range(step // 2, size, int(step * 0.9))):
        for x in range(step // 2 + (row % 2) * step // 2, size, step):
            m = float(mask[y, x])
            if m < 0.3:
                continue
            dark = float(np.clip((1 - lum[y, x] - 0.1) / 0.82, 0, 1))
            half = step * (0.12 + 0.36 * dark)
            alpha = int(230 * min(1.0, m * 1.4))
            draw.rectangle([x - half, y - half, x + half, y + half], fill=(*INK, alpha))
    return img


def to_webp(a: np.ndarray, path: Path, quality: int) -> None:
    Image.fromarray(np.clip(a * 255 + 0.5, 0, 255).astype(np.uint8), 'L').save(path, 'WEBP', quality=quality, method=6)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('video', type=Path)
    ap.add_argument('--loop', type=parse_range, required=True)
    ap.add_argument('--fps', type=float, default=15)
    ap.add_argument('--poster', type=float, required=True)
    ap.add_argument('--pingpong', action='store_true')
    ap.add_argument('--tile', type=int, default=256)
    ap.add_argument('--cols', type=int, default=10)
    ap.add_argument('--model', type=Path, default=MODEL_PATH)
    args = ap.parse_args()

    cap = cv2.VideoCapture(str(args.video))
    fps = cap.get(cv2.CAP_PROP_FPS)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    cap.release()

    start, end = args.loop
    count = max(2, round((end - start) * args.fps))
    order = sample_indices(start, end - 1 / args.fps, count, fps, total)
    poster_at = min(range(count), key=lambda n: abs(order[n] - args.poster * fps))
    frames = read_frames(args.video, order)
    box = crop_box([frames[i] for i in order])
    sess = load_model(args.model)

    rows = math.ceil(count / args.cols)
    if max(rows, args.cols) * args.tile > 4096:
        raise SystemExit(f'{count} frames make a {args.cols}x{rows} atlas, over 4096 px a side; lower --fps or raise --cols')
    luma_atlas = np.ones((rows * args.tile, args.cols * args.tile), np.float32)
    depth_atlas = np.zeros_like(luma_atlas)
    poster = None
    for n, idx in enumerate(order):
        lum_t, dep_t, lum_full, mask_full = process(sess, frames[idx], box, args.tile)
        r, c = divmod(n, args.cols)
        ys, xs = slice(r * args.tile, (r + 1) * args.tile), slice(c * args.tile, (c + 1) * args.tile)
        luma_atlas[ys, xs], depth_atlas[ys, xs] = lum_t, dep_t
        if n == poster_at:
            poster = halftone_poster(lum_full, mask_full)
        print(f'  tile {n + 1}/{count} (frame {idx})')

    out = ROOT / 'public' / 'assets' / 'hero'
    out.mkdir(parents=True, exist_ok=True)
    to_webp(luma_atlas, out / 'face-luma.webp', 84)
    to_webp(depth_atlas, out / 'face-depth.webp', 90)
    poster.save(out / 'face-poster.webp', 'WEBP', quality=85, method=6)

    manifest = {
        'tile': args.tile,
        'cols': args.cols,
        'rows': rows,
        'frames': count,
        'fps': args.fps,
        'poster': poster_at,
        'pingpong': args.pingpong,
    }
    (ROOT / 'src' / 'sky').mkdir(parents=True, exist_ok=True)
    (ROOT / 'src' / 'sky' / 'face-atlas.json').write_text(json.dumps(manifest, indent=2) + '\n')
    for f in ('face-luma.webp', 'face-depth.webp', 'face-poster.webp'):
        print(f'{f}: {(out / f).stat().st_size / 1024:.0f} KB')


if __name__ == '__main__':
    main()
