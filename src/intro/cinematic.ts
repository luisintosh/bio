/**
 * The home page's motion outside the sky: the hero's name decodes on arrival, and when
 * the Intro first scrolls into view its headline decodes and the polaroid drops onto
 * the page.
 *
 * Every animation runs "from" a start state back to the element's own CSS, so the page
 * is already complete without it.
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

/** Scrambles each character, then settles them left to right. Returns a finisher. */
export function decode(chars: HTMLElement[], delay: number, duration: number): () => void {
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

/** Shows random glyphs in place of each character until `decode` settles them. */
function scramble(chars: HTMLElement[]): void {
  chars.forEach((c) => {
    if (!c.textContent?.trim()) return
    c.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
    c.classList.add('is-scrambled')
  })
}

/**
 * Sets the Intro's start frames now, and plays them the first time the Intro scrolls
 * into view. Returns a cleanup that finishes everything.
 */
export function playIntro(): () => void {
  const intro = document.querySelector<HTMLElement>('.intro')
  const polaroid = document.querySelector<HTMLElement>('.intro__polaroid')
  const card = document.querySelector<HTMLElement>('.intro__card')
  const chars = [...document.querySelectorAll<HTMLElement>('.intro__decode > span')]
  const rest = [...document.querySelectorAll<HTMLElement>('.intro__subhead, .intro__facts > div, .intro__email')]
  if (!intro) return () => {}

  const animations: Animation[] = []
  const run = (el: Element | null, frames: Keyframe[], options: KeyframeAnimationOptions) => {
    if (!el) return
    // A lone keyframe would be read as the end state; pin it as the start instead.
    const keyframes = frames.length === 1 ? [{ ...frames[0], offset: 0 }] : frames
    const animation = el.animate(keyframes, { fill: 'backwards', ...options })
    // Paused at 0, the backwards fill holds the start frame until the Intro is in view.
    animation.pause()
    animations.push(animation)
  }

  rest.forEach((el, i) => {
    run(el, [{ opacity: 0, transform: 'translateY(14px)' }], {
      duration: 700,
      delay: 650 + i * 70,
      easing: EASE_OUT,
    })
  })

  if (polaroid && card) {
    const steps = spring(48)
    run(
      polaroid,
      steps.map((p, i) => ({
        transform: `translateY(${(1 - p) * -170}vh) rotate(${-14 + p * 15.5}deg) scale(${1.25 - p * 0.25})`,
        opacity: i === 0 ? 0 : 1,
      })),
      { duration: 1250, delay: 250, easing: 'linear' },
    )
    run(
      card,
      [{ boxShadow: '30px 90px 70px rgba(0, 0, 0, 0.08)' }, { boxShadow: '8px 24px 30px rgba(0, 0, 0, 0.18)', offset: 0.55 }],
      { duration: 1250, delay: 250, easing: EASE_OUT },
    )
  }

  // Scrambled now, so the headline never shows plain text before it decodes.
  const finals = chars.map((c) => c.textContent ?? '')
  scramble(chars)
  let settleHeadline = () => {
    chars.forEach((c, i) => {
      c.textContent = finals[i]
      c.classList.remove('is-scrambled')
    })
  }

  const play = () => {
    animations.forEach((a) => a.play())
    chars.forEach((c, i) => (c.textContent = finals[i]))
    settleHeadline = decode(chars, 100, 1300)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      observer.disconnect()
      play()
    },
    { rootMargin: '0px 0px -20% 0px' },
  )
  observer.observe(intro)

  return () => {
    observer.disconnect()
    animations.forEach((a) => a.finish())
    settleHeadline()
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
