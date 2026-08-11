import { useEffect, useRef } from 'react'
import './GalaxyBackground.css'

type VantaEffect = {
  destroy: () => void
}

type CloudsFactory = (options: {
  el: HTMLElement
  THREE: unknown
  mouseControls?: boolean
  touchControls?: boolean
  gyroControls?: boolean
  minHeight?: number
  minWidth?: number
  skyColor?: number
  cloudColor?: number
  cloudShadowColor?: number
  sunColor?: number
  sunGlareColor?: number
  sunlightColor?: number
  speed?: number
}) => VantaEffect

function resolveClouds(cloudsModule: unknown): CloudsFactory {
  let current: unknown = cloudsModule
  while (current && typeof current !== 'function') {
    if (typeof current === 'object' && current !== null && 'default' in current) {
      current = (current as { default: unknown }).default
      continue
    }
    break
  }

  if (typeof current === 'function') return current as CloudsFactory

  const fromWindow = (
    window as Window & { VANTA?: { CLOUDS?: CloudsFactory } }
  ).VANTA?.CLOUDS
  if (typeof fromWindow === 'function') return fromWindow

  throw new Error('Vanta CLOUDS effect failed to load')
}

function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    )
  } catch {
    return false
  }
}

function shouldSkipHeavyBackground(): boolean {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return true

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
    }
  ).connection
  if (connection?.saveData) return true
  if (connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') {
    return true
  }

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (typeof memory === 'number' && memory <= 2) return true

  if (!canUseWebGL()) return true

  return false
}

function whenIdle(cb: () => void): () => void {
  const ric = window.requestIdleCallback?.bind(window)
  if (ric) {
    const id = ric(() => cb(), { timeout: 2500 })
    return () => window.cancelIdleCallback?.(id)
  }
  const id = window.setTimeout(cb, 200)
  return () => window.clearTimeout(id)
}

export function GalaxyBackground() {
  const rootRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<VantaEffect | null>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el || effectRef.current) return
    if (shouldSkipHeavyBackground()) return

    let cancelled = false
    let cancelIdle = () => {}

    const start = () => {
      cancelIdle = whenIdle(() => {
        if (cancelled || effectRef.current || !rootRef.current) return

        void (async () => {
          try {
            const [THREE, cloudsModule] = await Promise.all([
              import('three'),
              import('vanta/dist/vanta.clouds.min'),
            ])
            if (cancelled || effectRef.current || !rootRef.current) return

            const CLOUDS = resolveClouds(cloudsModule)
            const reduced = window.matchMedia(
              '(prefers-reduced-motion: reduce)',
            ).matches

            effectRef.current = CLOUDS({
              el: rootRef.current,
              THREE,
              mouseControls: !reduced,
              touchControls: !reduced,
              gyroControls: false,
              minHeight: 200,
              minWidth: 200,
              skyColor: 0x68b8d7,
              cloudColor: 0xadc1de,
              cloudShadowColor: 0x183550,
              sunColor: 0xff9919,
              sunGlareColor: 0xff6633,
              sunlightColor: 0xff9933,
              speed: reduced ? 0 : 0.7,
            })
          } catch (error) {
            console.error('[GalaxyBackground] failed to start Vanta CLOUDS', error)
          }
        })()
      })
    }

    // Defer until after first paint / when tab is visible
    if (document.visibilityState === 'hidden') {
      const onVisible = () => {
        if (document.visibilityState === 'visible') {
          document.removeEventListener('visibilitychange', onVisible)
          start()
        }
      }
      document.addEventListener('visibilitychange', onVisible)
      return () => {
        cancelled = true
        document.removeEventListener('visibilitychange', onVisible)
        cancelIdle()
        effectRef.current?.destroy()
        effectRef.current = null
      }
    }

    start()

    return () => {
      cancelled = true
      cancelIdle()
      effectRef.current?.destroy()
      effectRef.current = null
    }
  }, [])

  return <div ref={rootRef} className="galaxy" aria-hidden />
}
