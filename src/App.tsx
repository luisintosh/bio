import { lazy, Suspense, useEffect, useState } from 'react'
import { Contact } from './components/Contact'
import { Experience } from './components/Experience'
import { Intro } from './components/Intro'
import { LinkList } from './components/LinkList'
import { PortfolioStrip } from './components/PortfolioStrip'
import { Services } from './components/Services'
import { SocialGrid } from './components/SocialGrid'
import { Testimonials } from './components/Testimonials'

const GalaxyBackground = lazy(() =>
  import('./components/GalaxyBackground').then((m) => ({
    default: m.GalaxyBackground,
  })),
)

export default function App() {
  const [mountBackground, setMountBackground] = useState(false)

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

      <div className="page">
        <main className="column">
          <div className="column__dots" aria-hidden />
          <div className="column__inner">
            <Intro />
            <SocialGrid />
            <LinkList />
            <Experience />
            <Services />
            <PortfolioStrip />
            <Testimonials />
            <Contact />
          </div>
        </main>
      </div>
    </>
  )
}
