import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { type ReactNode, useEffect } from 'react'
import { Contact } from './Contact'
import { SiteNav } from './SiteNav'
import { Sky } from './Sky'

/**
 * Every page: the particle sky behind, then the white column of content. The home page
 * passes a `hero`, which fills the first screen above the column, and gets the face.
 */
export function SiteShell({ children, hero }: { children: ReactNode; hero?: ReactNode }) {
  useEffect(() => {
    // Sections render client-side, after the browser's own scroll to the hash.
    const target = window.location.hash.slice(1)
    if (target) {
      document.getElementById(target)?.scrollIntoView({ behavior: 'instant' })
    }
  }, [])

  useEffect(() => {
    // Eased wheel scrolling; the sky reads the same scroll position, so they move as one.
    // Lenis turns its own smoothing off for visitors who prefer reduced motion.
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 })
    return () => lenis.destroy()
  }, [])

  return (
    <>
      <Sky face={!!hero} />

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {hero}

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
