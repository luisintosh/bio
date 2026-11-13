import { useEffect, useRef, useState } from 'react'
import './Sky.css'

/** Low-power devices and data savers keep the plain CSS sky instead of the particles. */
function prefersStaticSky(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection
  if (connection?.saveData) return true
  if (connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') return true
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  return typeof memory === 'number' && memory <= 2
}

/**
 * The page background: a particle field drawn with WebGL2. On the home page (`face`)
 * the hero's particles form Luis's face. Without WebGL2 the CSS sky stays, and the hero
 * shows a still halftone poster instead (see `.sky-static` in Hero.css).
 */
export function Sky({ face = false }: { face?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)
  const [failed, setFailed] = useState(prefersStaticSky)

  useEffect(() => {
    document.documentElement.classList.toggle('sky-static', failed)
    if (failed) return

    let stop = () => {}
    let cancelled = false
    import('../sky/engine')
      .then(({ startSky }) => {
        if (cancelled || !canvasRef.current) return
        stop = startSky({
          canvas: canvasRef.current,
          face,
          cursor:
            cursorRef.current && labelRef.current && ringRef.current
              ? { root: cursorRef.current, label: labelRef.current, ring: ringRef.current }
              : undefined,
          onFail: () => setFailed(true),
        })
      })
      .catch((error) => {
        console.error('[Sky] falling back to the CSS sky', error)
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
      stop()
    }
  }, [face, failed])

  return (
    <>
      <div className="sky" aria-hidden>
        {!failed && <canvas ref={canvasRef} className="sky__canvas" />}
      </div>
      {/* Outside .sky, whose stacking context sits under the page. */}
      <div ref={cursorRef} className="sky-cursor" aria-hidden>
        <span ref={ringRef} className="sky-cursor__ring" />
        <span className="sky-cursor__x" />
        <span className="sky-cursor__y" />
        <span ref={labelRef} className="sky-cursor__label" />
      </div>
    </>
  )
}
