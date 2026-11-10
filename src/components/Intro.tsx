import { useLayoutEffect } from 'react'
import { mailto, profile } from '../data/content'
import { playIntro, shouldPlayIntro, tiltPolaroid } from '../intro/cinematic'
import { Corner } from './decor/Decor'
import { Picture } from './Picture'
import './Intro.css'

/**
 * A reload starts at the top with the opening shot, instead of jumping back to the
 * last section (a "/#work" left by the nav, or the browser's restored scroll).
 * A shared "/#work" link opened fresh still lands on its section.
 */
function startReloadAtTop() {
  const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
  if (entry?.type !== 'reload') return
  history.scrollRestoration = 'manual'
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
  window.scrollTo(0, 0)
}

export function Intro() {
  // Layout effect: the start frames apply before the first paint, so nothing flashes.
  useLayoutEffect(() => {
    startReloadAtTop()
    const stopIntro = shouldPlayIntro() ? playIntro() : () => {}
    const stopTilt = tiltPolaroid()
    return () => {
      stopIntro()
      stopTilt()
    }
  }, [])

  return (
    <section className="intro">
      <Corner position="bl" />

      <div className="intro__polaroid">
        <div className="intro__card">
          <div className="intro__photo-wrap">
            <Picture
              src={profile.image}
              alt={profile.name}
              className="intro__photo"
              width={512}
              height={512}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="intro__polaroid-meta">
            {/* A non-breaking hyphen keeps "Full-Stack" on one line in the narrow caption. */}
            <p className="intro__polaroid-role">{profile.role.replace('-', '‑')}</p>
          </div>
        </div>
      </div>

      <h1 className="intro__headline">
        <span className="sr-only">{profile.headline}</span>
        {/* One span per character so the opening shot can decode it in place. */}
        <span className="intro__decode" aria-hidden>
          {[...profile.headline].map((char, i) =>
            // A newline in the headline starts its second sentence on a new line.
            char === '\n' ? <br key={i} /> : <span key={i}>{char}</span>,
          )}
        </span>
      </h1>
      <p className="body-text intro__subhead">{profile.subhead}</p>

      <dl className="intro__facts">
        <div>
          <dt>Role</dt>
          <dd>{profile.role}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{profile.location}</dd>
        </div>
        <div>
          <dt>Experience</dt>
          <dd>{profile.experience}</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>{profile.stack}</dd>
        </div>
        <div>
          <dt>Cloud</dt>
          <dd>
            {profile.cloudCertifications.map((certification) => (
              <span key={certification}>{certification}</span>
            ))}
          </dd>
        </div>
      </dl>

      <a className="intro__email" href={mailto}>
        Email me
      </a>
    </section>
  )
}
