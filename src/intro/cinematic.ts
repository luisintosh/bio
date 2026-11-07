/**
 * The home page's opening shot: clouds part, the paper column rises out of the sky,
 * the headline decodes, and the polaroid drops onto the page.
 *
 * Every animation runs "from" a start state back to the element's own CSS, so the page
 * is already complete without it, and any scroll, click, or key press finishes it at once.
 */

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)'
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/'

export function shouldPlayIntro(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (window.location.hash) return false
  // Coming back from a case study: the visitor has already seen it.
  try {
    if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
      return false
    }
  } catch {
    // An unparsable referrer is treated as an outside visit.
  }
  return true
}

/** A damped spring from 0 to 1 over `steps` samples, for the polaroid's landing. */
function spring(steps: number, damping = 0.5, stiffness = 15): number[] {
  const out: number[] = []
  const damped = stiffness * Math.sqrt(1 - damping * damping)
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 1.15
    const decay = Math.exp(-damping * stiffness * t)
    out.push(1 - decay * (Math.cos(damped * t) + ((damping * stiffness) / damped) * Math.sin(damped * t)))
  }
  out[steps] = 1
  return out
}

function createVeil(): HTMLElement {
  const veil = document.createElement('div')
  veil.className = 'cine-veil'
  veil.setAttribute('aria-hidden', 'true')
  veil.innerHTML = `
    <svg width="0" height="0" style="position:absolute">
      <filter id="cine-billow" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.009" numOctaves="4" seed="7" result="noise">
          <animate attributeName="baseFrequency" dur="2.4s" values="0.006 0.009;0.009 0.006" fill="freeze" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="260" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
    <div class="cine-veil__cloud"></div>`
  document.body.append(veil)
  return veil
}

/** Scrambles each character, then settles them left to right. Returns a finisher. */
function decode(chars: HTMLElement[], delay: number, duration: number): () => void {
  const finals = chars.map((c) => c.textContent ?? '')
  const settleAt = finals.map((_, i) => delay + (i / chars.length) * duration * 0.75 + Math.random() * duration * 0.25)
  const start = performance.now()
  let frame = 0
  let lastSwap = 0

  const settle = () => {
    cancelAnimationFrame(frame)
    chars.forEach((c, i) => {
      c.textContent = finals[i]
      c.classList.remove('is-scrambled')
    })
  }

  const tick = (now: number) => {
    const elapsed = now - start
    const swap = now - lastSwap > 45
    if (swap) lastSwap = now
    let pending = false
    chars.forEach((c, i) => {
      if (finals[i] === ' ') return
      if (elapsed >= settleAt[i]) {
        if (c.classList.contains('is-scrambled')) {
          c.textContent = finals[i]
          c.classList.remove('is-scrambled')
        }
        return
      }
      pending = true
      if (swap) {
        c.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        c.classList.add('is-scrambled')
      }
    })
    if (pending) frame = requestAnimationFrame(tick)
  }

  tick(start)
  return settle
}

/** Plays the opening shot. Returns a cleanup that finishes it and removes the veil. */
export function playIntro(): () => void {
  const sky = document.querySelector<HTMLElement>('.sky')
  const column = document.querySelector<HTMLElement>('.column')
  const polaroid = document.querySelector<HTMLElement>('.intro__polaroid')
  const card = document.querySelector<HTMLElement>('.intro__card')
  const chars = [...document.querySelectorAll<HTMLElement>('.intro__decode > span')]
  const rest = [
    ...document.querySelectorAll<HTMLElement>('.site-nav, .intro__subhead, .intro__facts > div, .intro__email'),
  ]

  const veil = createVeil()
  const animations: Animation[] = []
  const run = (el: Element | null, frames: Keyframe[], options: KeyframeAnimationOptions) => {
    if (!el) return
    // A lone keyframe would be read as the end state; pin it as the start instead.
    const keyframes = frames.length === 1 ? [{ ...frames[0], offset: 0 }] : frames
    animations.push(el.animate(keyframes, { fill: 'backwards', ...options }))
  }

  const cloud = veil.querySelector('.cine-veil__cloud')
  run(cloud, [{ '--hole': '-18vmax' } as Keyframe, { '--hole': '160vmax' } as Keyframe], {
    duration: 1900,
    delay: 250,
    easing: 'cubic-bezier(0.55, 0, 0.25, 1)',
    fill: 'forwards',
  })
  run(veil, [{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: 1700, fill: 'forwards' })

  run(sky, [{ transform: 'scale(1.45)', filter: 'blur(10px) brightness(1.15)' }], {
    duration: 2400,
    delay: 150,
    easing: EASE_OUT,
  })

  run(
    column,
    [
      {
        transform: 'perspective(1600px) translateY(85vh) rotateX(22deg) scale(0.92)',
        boxShadow: '0 80px 120px rgba(0, 0, 0, 0.35)',
      },
    ],
    { duration: 1500, delay: 550, easing: EASE_OUT },
  )

  rest.forEach((el, i) => {
    run(el, [{ opacity: 0, transform: 'translateY(14px)' }], {
      duration: 700,
      delay: 1750 + i * 70,
      easing: EASE_OUT,
    })
  })

  if (polaroid && card) {
    const steps = spring(48)
    run(
      polaroid,
      // Hidden while it waits: the column's tilt would otherwise project it into view.
      steps.map((p, i) => ({
        transform: `translateY(${(1 - p) * -170}vh) rotate(${-14 + p * 15.5}deg) scale(${1.25 - p * 0.25})`,
        opacity: i === 0 ? 0 : 1,
      })),
      { duration: 1250, delay: 1350, easing: 'linear' },
    )
    run(
      card,
      [{ boxShadow: '30px 90px 70px rgba(0, 0, 0, 0.08)' }, { boxShadow: '8px 24px 30px rgba(0, 0, 0, 0.18)', offset: 0.55 }],
      { duration: 1250, delay: 1350, easing: EASE_OUT },
    )
  }

  const settleHeadline = decode(chars, 1000, 1300)

  let done = false
  const finish = () => {
    if (done) return
    done = true
    animations.forEach((a) => a.finish())
    settleHeadline()
    veil.remove()
    removeListeners()
  }

  const skip = () => finish()
  const events = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const
  events.forEach((e) => window.addEventListener(e, skip, { passive: true, once: true }))
  const removeListeners = () => events.forEach((e) => window.removeEventListener(e, skip))

  const timer = window.setTimeout(finish, 3200)

  return () => {
    window.clearTimeout(timer)
    finish()
    animations.forEach((a) => a.cancel())
  }
}

/** Tilts the polaroid toward the cursor, with glare and a shadow that moves opposite it. */
export function tiltPolaroid(): () => void {
  const card = document.querySelector<HTMLElement>('.intro__card')
  if (!card || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  const MAX = 11
  let target = { x: 0, y: 0 }
  const current = { x: 0, y: 0 }
  let frame = 0

  const onMove = (event: PointerEvent) => {
    const box = card.getBoundingClientRect()
    const dx = (event.clientX - (box.left + box.width / 2)) / (window.innerWidth / 2)
    const dy = (event.clientY - (box.top + box.height / 2)) / (window.innerHeight / 2)
    target = { x: Math.max(-1, Math.min(1, dx)), y: Math.max(-1, Math.min(1, dy)) }
  }

  const onLeave = () => {
    target = { x: 0, y: 0 }
  }

  const tick = () => {
    current.x += (target.x - current.x) * 0.08
    current.y += (target.y - current.y) * 0.08
    const ry = current.x * MAX
    const rx = -current.y * MAX
    card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
    card.style.boxShadow = `${(-current.x * 14).toFixed(1)}px ${(16 - current.y * 10).toFixed(1)}px 30px rgba(0, 0, 0, 0.16), 3px 4px 0 rgba(0, 0, 0, 0.06)`
    card.style.setProperty('--gx', `${50 + current.x * 50}%`)
    card.style.setProperty('--gy', `${50 + current.y * 50}%`)
    card.style.setProperty('--glare', Math.min(1, Math.hypot(current.x, current.y) * 1.4).toFixed(2))
    frame = requestAnimationFrame(tick)
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
  frame = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('pointermove', onMove)
    document.documentElement.removeEventListener('pointerleave', onLeave)
    card.style.removeProperty('transform')
    card.style.removeProperty('box-shadow')
  }
}
