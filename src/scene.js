/* ============================================================
   Scroll-driven animation controller
   Scenes, by scroll progress p ∈ [0, 1]:
   0.00 - 0.20  HERO   : sunset + name, scroll cue
   0.20 - 0.40  FALL A : character appears, About card
   0.40 - 0.60  FALL B : Experience card
   0.60 - 0.80  FALL C : Education card
   0.80 - 1.00  LANDING: splash, lagoon reveal, contact form
   ============================================================ */

// ---------- State persistence ----------
const SAVE_KEY = 'luis-scroll-pos';

// ---------- Tweaks defaults (kept editable via host) ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "sunset",
  "fallSpeed": 1,
  "effects": true,
  "lagoonMode": "day"
}/*EDITMODE-END*/;

let tweaks = { ...TWEAK_DEFAULTS };

// ---------- Build dynamic elements ----------
function makeCloudSVG(w, h, color) {
  // rounded bubbly cloud, chunky black outline
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 300 140');
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.innerHTML = `
    <g>
      <path d="M30 95
               C10 95, 10 65, 40 62
               C38 35, 80 25, 95 50
               C105 28, 150 28, 160 55
               C175 32, 225 35, 225 65
               C260 58, 285 85, 265 105
               C285 130, 230 135, 210 120
               C195 135, 150 135, 135 115
               C115 135, 65 130, 55 115
               C30 125, 10 112, 30 95 Z"
            fill="${color}"
            stroke="#1a1530" stroke-width="5" stroke-linejoin="round"/>
      <ellipse cx="70" cy="75" rx="18" ry="10" fill="rgba(255,255,255,0.45)"/>
      <ellipse cx="160" cy="65" rx="22" ry="12" fill="rgba(255,255,255,0.35)"/>
    </g>`;
  return svg;
}

function makeCloud(parent, { left, top, w, color, drift }) {
  const el = document.createElement('div');
  el.className = 'cloud';
  el.style.left = left + '%';
  el.style.top = top + '%';
  el.style.width = w + 'px';
  el.appendChild(makeCloudSVG('100%', 'auto', color));
  el.dataset.baseTop = top;
  el.dataset.drift = drift;
  parent.appendChild(el);
  return el;
}

// Seagull SVG
function makeSeagull(parent, { left, top, dur, delay, size }) {
  const g = document.createElement('div');
  g.className = 'seagull';
  g.style.left = left + '%';
  g.style.top = top + '%';
  g.style.animationDuration = dur + 's';
  g.style.animationDelay = delay + 's';
  g.innerHTML = `
    <svg viewBox="0 0 100 40" style="width:${size}px;height:${size*0.4}px">
      <path class="wing" d="M10 25 Q30 5 50 25 Q70 5 90 25" fill="none" stroke="#1a1530" stroke-width="4" stroke-linecap="round"/>
    </svg>`;
  parent.appendChild(g);
}

// Pine tree SVG (chunky outlined)
function makePineSVG(h, color1, color2) {
  return `
    <svg class="pine" viewBox="0 0 60 120" style="height:${h}px;width:${h*0.5}px">
      <rect x="26" y="90" width="8" height="28" fill="#6b3a1f" stroke="#1a1530" stroke-width="3"/>
      <polygon points="30,5 52,45 38,45 56,80 34,80 34,95 26,95 26,80 4,80 22,45 8,45"
        fill="${color1}" stroke="#1a1530" stroke-width="3.5" stroke-linejoin="round"/>
      <polygon points="30,12 46,42 36,42 48,68 34,68 34,80 26,80 26,68 12,68 24,42 14,42"
        fill="${color2}" stroke="#1a1530" stroke-width="2" stroke-linejoin="round" opacity="0.55"/>
    </svg>`;
}

// ---------- Populate scene ----------
function buildScene() {
  // Clouds — 3 parallax layers
  const far = document.getElementById('cloudFar');
  const mid = document.getElementById('cloudMid');
  const near = document.getElementById('cloudNear');

  const farSet = [
    { left: 5,  top: 15, w: 180, color: '#ffe9c4', drift: 0.15 },
    { left: 65, top: 10, w: 220, color: '#fff0d2', drift: 0.2 },
    { left: 30, top: 28, w: 160, color: '#ffe6d2', drift: 0.18 },
    { left: 82, top: 40, w: 180, color: '#ffe0cc', drift: 0.16 },
    { left: 12, top: 60, w: 200, color: '#fed4c0', drift: 0.2 },
  ];
  const midSet = [
    { left: 70, top: 22, w: 260, color: '#fff7e2', drift: 0.35 },
    { left: 8,  top: 35, w: 300, color: '#fff3d0', drift: 0.38 },
    { left: 48, top: 50, w: 280, color: '#ffe9c4', drift: 0.4 },
    { left: 78, top: 65, w: 240, color: '#ffd9b0', drift: 0.36 },
  ];
  const nearSet = [
    { left: -5, top: 55, w: 380, color: '#ffffff', drift: 0.7 },
    { left: 62, top: 72, w: 360, color: '#fff7e2', drift: 0.75 },
    { left: 20, top: 82, w: 340, color: '#ffe9c4', drift: 0.8 },
    { left: 85, top: 88, w: 320, color: '#fff3d0', drift: 0.72 },
  ];

  farSet.forEach(c => makeCloud(far, c));
  midSet.forEach(c => makeCloud(mid, c));
  nearSet.forEach(c => makeCloud(near, c));

  // Speed lines
  const sl = document.getElementById('speedlines');
  for (let i = 0; i < 40; i++) {
    const line = document.createElement('div');
    line.className = 'line';
    line.style.left = Math.random() * 100 + '%';
    line.style.height = (60 + Math.random() * 180) + 'px';
    line.style.animationDelay = (Math.random() * 0.7) + 's';
    line.style.animationDuration = (0.4 + Math.random() * 0.5) + 's';
    line.style.opacity = (0.3 + Math.random() * 0.6).toString();
    sl.appendChild(line);
  }

  // Wind particles
  const wind = document.getElementById('wind');
  for (let i = 0; i < 26; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.left = Math.random() * 100 + '%';
    s.style.width = (3 + Math.random() * 6) + 'px';
    s.style.height = s.style.width;
    s.style.animationDelay = (Math.random() * 1.2) + 's';
    s.style.animationDuration = (0.8 + Math.random() * 1.2) + 's';
    s.style.opacity = (0.5 + Math.random() * 0.5).toString();
    wind.appendChild(s);
  }

  // Seagulls
  const g = document.getElementById('seagulls');
  const gulls = [
    { left: -10, top: 18, dur: 22, delay: 0, size: 34 },
    { left: -30, top: 32, dur: 28, delay: 6, size: 28 },
    { left: -50, top: 10, dur: 35, delay: 12, size: 40 },
    { left: -15, top: 45, dur: 26, delay: 3, size: 30 },
    { left: -40, top: 55, dur: 32, delay: 9, size: 36 },
  ];
  gulls.forEach(c => makeSeagull(g, c));

  // Pines row — alternating tall and short
  const pines = document.getElementById('pines');
  const n = 18;
  for (let i = 0; i < n; i++) {
    const h = 120 + (i % 3 === 0 ? 40 : 0) + Math.random() * 30;
    const shade = i % 2 === 0 ? ['#2f8f44', '#247134'] : ['#3aa256', '#2d8246'];
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'flex-end';
    wrap.style.flex = '1 0 auto';
    wrap.innerHTML = makePineSVG(h, shade[0], shade[1]);
    pines.appendChild(wrap);
  }

  // Reflections — vertical streaks beneath the pines
  const refl = document.getElementById('reflections');
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('div');
    s.style.position = 'absolute';
    s.style.left = (i / 18) * 100 + '%';
    s.style.top = '0';
    s.style.bottom = '0';
    s.style.width = (3 + Math.random() * 6) + 'px';
    s.style.background = 'linear-gradient(to bottom, rgba(47,143,68,0.55), rgba(47,143,68,0))';
    s.style.filter = 'blur(1.5px)';
    s.style.opacity = (0.35 + Math.random() * 0.35).toString();
    refl.appendChild(s);
  }
}

// ---------- Scroll-driven animation ----------
const $ = id => document.getElementById(id);

const els = {};
function cacheEls() {
  Object.assign(els, {
    stage: $('stage'),
    sky: $('sky'),
    sun: $('sun'),
    cloudFar: $('cloudFar'),
    cloudMid: $('cloudMid'),
    cloudNear: $('cloudNear'),
    hero: $('hero'),
    faller: $('faller'),
    speedlines: $('speedlines'),
    wind: $('wind'),
    cards: document.querySelectorAll('.card'),
    lagoon: $('lagoon'),
    splash: $('splash'),
    contact: $('contact'),
    depthTint: $('depthTint'),
    progressFill: $('progressFill'),
    ripples: $('ripples'),
  });
}

// easing helpers
const clamp01 = v => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, t) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

let lastP = -1;
let splashedAt = -1;

function updateScene(p) {
  if (p === lastP) return;
  lastP = p;

  // --- overall progress bar ---
  els.progressFill.style.width = (p * 100).toFixed(2) + '%';

  // --- phases ---
  const pHero  = smoothstep(0.0, 0.18, p); // 0 at hero, 1 when starting to fall
  const pFall  = smoothstep(0.15, 0.82, p);
  const pLand  = smoothstep(0.78, 0.95, p);

  // --- hero: slide up, fade away, scale a bit ---
  const heroOut = clamp01(p / 0.18);
  els.hero.style.opacity = String(1 - heroOut);
  els.hero.style.transform =
    `translateY(${-heroOut * 30}vh) scale(${1 - heroOut * 0.1})`;

  // --- sky: shift gradient as you fall deeper (warm -> cool) ---
  const skyShift = clamp01((p - 0.15) / 0.7);
  const hueRot = -skyShift * 50; // warm -> cool
  const bright = 1 - skyShift * 0.15;
  els.sky.style.filter = `hue-rotate(${hueRot}deg) brightness(${bright})`;
  // sun sinks behind horizon
  els.sun.style.transform = `translate(-50%, ${skyShift * 40}vh) scale(${1 - skyShift * 0.3})`;
  els.sun.style.opacity = String(1 - skyShift * 0.9);

  // --- Parallax clouds rushing UP (we're falling down) ---
  // Far drifts slowly; near drifts fast. Everything also shifts left a hair.
  const fallOffset = p * 100; // 0..100
  const clouds = [
    { el: els.cloudFar, speed: 1.2 },
    { el: els.cloudMid, speed: 2.4 },
    { el: els.cloudNear, speed: 4.0 },
  ];
  clouds.forEach(({ el, speed }) => {
    // vertical offset — clouds push UP as user falls
    el.style.transform = `translate3d(0, ${-fallOffset * speed}vh, 0)`;
  });

  // Extra per-cloud shake (wobble with speed for near layer)
  const intensity = tweaks.effects ? 1 : 0;
  const wobbleAmp = smoothstep(0.15, 0.6, p) * 6 * intensity;
  document.querySelectorAll('.cloud-near .cloud').forEach((c, i) => {
    const wob = Math.sin(p * 20 + i) * wobbleAmp;
    c.style.transform = `translate3d(${wob}px, 0, 0)`;
  });

  // --- Faller character ---
  // appears as you start falling; stays roughly centered, bobbing; enlarges slightly with depth
  const fallStart = 0.15;
  const fallEnd   = 0.85;
  const fp = clamp01((p - fallStart) / (fallEnd - fallStart));
  const landNow = p > 0.85 ? clamp01((p - 0.85) / 0.07) : 0;

  let fallerScale, fallerY, fallerOp;
  if (fp > 0) {
    fallerScale = lerp(0.6, 1.15, easeOutCubic(fp));
    const bob = Math.sin(p * 40) * 6;
    fallerY = bob + lerp(-4, 4, fp);
    fallerOp = 1;
  } else {
    fallerScale = 0;
    fallerY = -60;
    fallerOp = 0;
  }
  // during landing, faller sinks fast, then disappears at splash
  if (landNow > 0) {
    fallerScale *= (1 - landNow * 0.5);
    fallerY += landNow * 30;
    fallerOp *= (1 - landNow);
  }
  const tiltAngle = Math.sin(p * 12) * 6;
  els.faller.style.transform =
    `translate(-50%, calc(-50% + ${fallerY}vh)) rotate(${tiltAngle}deg) scale(${fallerScale})`;
  els.faller.style.opacity = String(fallerOp);

  // --- Speed lines + wind (visible during fall) ---
  const motionOn = tweaks.effects ? 1 : 0;
  const motionAmount = smoothstep(0.2, 0.35, p) * (1 - smoothstep(0.78, 0.9, p));
  els.speedlines.style.opacity = String(motionAmount * motionOn);
  els.wind.style.opacity = String(motionAmount * motionOn * 0.9);

  // depth tint darker in the middle, lifts at landing
  const tintAmt = Math.max(0, Math.sin(Math.PI * clamp01((p - 0.15) / 0.7))) * 0.7;
  els.depthTint.style.opacity = String(tintAmt);

  // --- Cards: show About around 0.28, Exp 0.48, Edu 0.66 ---
  const cardSpecs = [
    { el: document.querySelector('.card-about'),      mid: 0.3,  range: 0.08 },
    { el: document.querySelector('.card-exp'),        mid: 0.5,  range: 0.08 },
    { el: document.querySelector('.card-edu'),        mid: 0.7,  range: 0.08 },
  ];
  cardSpecs.forEach(({ el, mid, range }, i) => {
    const local = (p - mid) / range; // -inf .. +inf, 0 at midpoint
    // appear from below, drift up and away
    const op = Math.exp(-local * local * 2.2); // bell curve visibility
    // vertical travel: card enters from below and exits upward
    const ty = -local * 55; // vh units
    // side sway per card
    const sway = (i % 2 === 0 ? 1 : -1) * (4 - Math.abs(local) * 3);
    const rot = (i % 2 === 0 ? -3 : 3) + sway * 0.3;
    el.style.opacity = op.toFixed(3);
    el.style.transform =
      `translate(calc(-50% + ${sway}vw), ${ty}vh) rotate(${rot}deg) scale(${0.9 + op * 0.12})`;
  });

  // --- Landing / Lagoon reveal ---
  const lagoonShow = smoothstep(0.82, 0.93, p);
  els.lagoon.style.opacity = lagoonShow.toFixed(3);
  if (lagoonShow > 0.98) els.lagoon.classList.add('active');
  else els.lagoon.classList.remove('active');

  // splash trigger — fire once as user crosses 0.87
  if (p >= 0.86 && p <= 0.92 && splashedAt < 0) {
    triggerSplash();
    splashedAt = p;
  } else if (p < 0.82) {
    splashedAt = -1;
    els.splash.classList.remove('play');
  }

  // contact rises after splash
  const contactIn = smoothstep(0.9, 0.99, p);
  els.contact.style.opacity = contactIn.toFixed(3);
  els.contact.style.transform = `translateY(${(1 - contactIn) * 20}vh)`;
}

function triggerSplash() {
  els.splash.classList.remove('play');
  // force reflow then re-add
  void els.splash.offsetWidth;
  els.splash.classList.add('play');

  // Random ripples
  for (let i = 0; i < 4; i++) {
    const r = document.createElement('div');
    r.className = 'ripple';
    const cx = 50 + (Math.random() - 0.5) * 20;
    const cy = 30 + Math.random() * 50;
    r.style.left = cx + '%';
    r.style.top = cy + '%';
    r.style.width = '40px';
    r.style.height = '10px';
    r.style.animationDelay = (i * 0.18) + 's';
    els.ripples.appendChild(r);
    requestAnimationFrame(() => r.classList.add('play'));
    setTimeout(() => r.remove(), 3200);
  }
}

// ---------- Scroll loop ----------
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const rawP = max > 0 ? window.scrollY / max : 0;
  // Apply fall-speed tweak — accelerate/decelerate the middle section
  // Clamp so user can still reach the end.
  const p = clamp01(rawP);
  updateScene(p);

  // persist
  try { localStorage.setItem(SAVE_KEY, String(window.scrollY)); } catch (e) {}
}

// ---------- Contact form ----------
function wireForm() {
  const form = document.getElementById('contactForm');
  const ok = document.getElementById('formOk');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (!data.get('name') || !data.get('email') || !data.get('message')) {
      form.reportValidity();
      return;
    }
    ok.classList.add('show');
    form.reset();
    setTimeout(() => ok.classList.remove('show'), 4000);
  });
}

// ---------- Tweaks ----------
function applyTweaks() {
  // palette
  const root = document.documentElement;
  const palettes = {
    sunset: ['#ffd29a', '#ff9a7a', '#ff6f8a', '#8e5aa0', '#4a3a7a'],
    peach:  ['#ffe6c2', '#ffb38a', '#ff8ea6', '#b67ac6', '#5f4c8f'],
    berry:  ['#ffc2a8', '#ff7d8e', '#c75aa0', '#6a3c8f', '#2b1f55'],
    gold:   ['#fff0c2', '#ffd16a', '#ff9e5e', '#9c5d94', '#4a3968'],
  };
  const pal = palettes[tweaks.palette] || palettes.sunset;
  pal.forEach((c, i) => root.style.setProperty('--sky-' + (i + 1), c));

  // effects
  if (!tweaks.effects) {
    els.speedlines.style.opacity = '0';
    els.wind.style.opacity = '0';
  }

  // lagoon
  if (tweaks.lagoonMode === 'dusk') els.lagoon.classList.add('dusk');
  else els.lagoon.classList.remove('dusk');

  // reflect in controls
  const p = document.getElementById('twPalette');
  const s = document.getElementById('twSpeed');
  const ef = document.getElementById('twEffects');
  const l = document.getElementById('twLagoon');
  if (p) p.value = tweaks.palette;
  if (s) s.value = tweaks.fallSpeed;
  if (ef) ef.checked = tweaks.effects;
  if (l) l.value = tweaks.lagoonMode;
}

function wireTweaks() {
  const panel = document.getElementById('tweaksPanel');

  const setKeys = (edits) => {
    Object.assign(tweaks, edits);
    applyTweaks();
    onScroll();
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    } catch (e) {}
  };

  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode') panel.classList.remove('hidden');
    if (d.type === '__deactivate_edit_mode') panel.classList.add('hidden');
  });
  // Announce availability
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}

  document.getElementById('twPalette').addEventListener('change', e =>
    setKeys({ palette: e.target.value }));
  document.getElementById('twSpeed').addEventListener('input', e =>
    setKeys({ fallSpeed: parseFloat(e.target.value) }));
  document.getElementById('twEffects').addEventListener('change', e =>
    setKeys({ effects: e.target.checked }));
  document.getElementById('twLagoon').addEventListener('change', e =>
    setKeys({ lagoonMode: e.target.value }));
}

// ---------- Restore scroll ----------
function restoreScroll() {
  try {
    const y = parseFloat(localStorage.getItem(SAVE_KEY) || '0');
    if (y > 0 && Number.isFinite(y)) window.scrollTo(0, y);
  } catch (e) {}
}

// ---------- Boot ----------
document.addEventListener('DOMContentLoaded', () => {
  buildScene();
  cacheEls();
  applyTweaks();
  wireForm();
  wireTweaks();
  restoreScroll();
  onScroll();

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
});
