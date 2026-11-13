import { useLayoutEffect, useRef } from 'react'
import { navLinks, profile } from '../data/content'
import { decode, shouldPlayIntro } from '../intro/cinematic'
import './Hero.css'

/**
 * The home page's first screen. The face itself is drawn by the sky behind it (see
 * Sky.tsx); this is the text around it, which fades out as the page scrolls.
 */
export function Hero() {
  const nameRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (!shouldPlayIntro() || !nameRef.current) return
    return decode([...nameRef.current.querySelectorAll<HTMLElement>('span')], 200, 1100)
  }, [])

  return (
    <section className="hero" aria-label="Introduction">
      <nav className="hero__nav" aria-label="Sections">
        <span className="hero__brand">{profile.name}</span>
        <ul>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <img
        className="hero__poster"
        src="/assets/hero/face-poster.webp"
        alt=""
        width={1100}
        height={1100}
        decoding="async"
        loading="lazy"
      />

      <div className="hero__title">
        <p className="hero__name">
          <span className="sr-only">{profile.name}</span>
          {/* One span per character so it can decode in place. */}
          <span ref={nameRef} aria-hidden>
            {[...profile.name].map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </span>
        </p>
        <p className="hero__meta">
          <span>// luism.dev</span>
          <span>©{new Date().getFullYear()}</span>
        </p>
      </div>

      <p className="hero__role">
        {profile.role}. Problem first, then prototype, then production.
      </p>

      <div className="hero__foot">
        <span>{profile.coordinates}</span>
        <span className="hero__scroll">
          <i aria-hidden />
          Scroll
        </span>
      </div>
    </section>
  )
}
