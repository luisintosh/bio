import { useEffect, useState } from 'react'
import { portfolioItems } from '../data/content'
import { Picture } from './Picture'
import './PortfolioStrip.css'

export function PortfolioStrip() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const visible = [
    portfolioItems[index % portfolioItems.length],
    portfolioItems[(index + 1) % portfolioItems.length],
  ]

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || paused) return

    const id = window.setInterval(() => {
      setIndex((i) => i + 1)
    }, 3200)
    return () => window.clearInterval(id)
  }, [paused])

  return (
    <section
      className="portfolio"
      aria-label="Portfolio projects"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {visible.map((item, i) => (
        <figure key={`${item.image}-${index}-${i}`} className="portfolio__frame">
          <Picture
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="portfolio__caption">{item.title}</figcaption>
        </figure>
      ))}
    </section>
  )
}
