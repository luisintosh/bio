import { lazy, type ReactNode, Suspense, useEffect } from 'react'
import { Contact } from './Contact'
import { SiteNav } from './SiteNav'

const GalaxyBackground = lazy(() =>
  import('./GalaxyBackground').then((m) => ({
    default: m.GalaxyBackground,
  })),
)

export function SiteShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Sections render client-side, after the browser's own scroll to the hash.
    const target = window.location.hash.slice(1)
    if (target) {
      document.getElementById(target)?.scrollIntoView({ behavior: 'instant' })
    }
  }, [])

  return (
    <>
      {/* Mounted at once so the clouds are there for the home page's opening shot. */}
      <div className="sky" aria-hidden>
        <Suspense fallback={<div className="galaxy" />}>
          <GalaxyBackground />
        </Suspense>
      </div>

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
