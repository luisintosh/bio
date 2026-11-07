import { lazy, type ReactNode, Suspense, useEffect, useState } from 'react'
import { Contact } from './Contact'
import { SiteNav } from './SiteNav'

const GalaxyBackground = lazy(() =>
  import('./GalaxyBackground').then((m) => ({
    default: m.GalaxyBackground,
  })),
)

export function SiteShell({ children }: { children: ReactNode }) {
  const [mountBackground, setMountBackground] = useState(false)

  useEffect(() => {
    // Sections render client-side, after the browser's own scroll to the hash.
    const target = window.location.hash.slice(1)
    if (target) {
      document.getElementById(target)?.scrollIntoView({ behavior: 'instant' })
    }
  }, [])

  useEffect(() => {
    // Mount after first paint so FCP isn't blocked by the background chunk.
    let idleId: number | undefined
    let timeoutId: number | undefined

    const mount = () => setMountBackground(true)
    const ric = window.requestIdleCallback?.bind(window)

    if (ric) {
      idleId = ric(mount, { timeout: 2000 })
    } else {
      timeoutId = window.setTimeout(mount, 1)
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <>
      {mountBackground ? (
        <Suspense fallback={<div className="galaxy" aria-hidden />}>
          <GalaxyBackground />
        </Suspense>
      ) : (
        <div className="galaxy" aria-hidden />
      )}

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="page">
        <div className="column">
          <header>
            <SiteNav />
          </header>
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <footer>
            <Contact />
          </footer>
        </div>
      </div>
    </>
  )
}
