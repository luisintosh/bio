import { useRef, useState } from 'react'
import { testimonials } from '../data/content'
import './Testimonials.css'

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const count = testimonials.items.length

  function goTo(next: number) {
    const track = trackRef.current
    if (!track) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({
      left: next * track.clientWidth,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  function handleScroll() {
    const track = trackRef.current
    if (!track) return
    setIndex(Math.round(track.scrollLeft / track.clientWidth))
  }

  return (
    <section
      className="testimonials"
      aria-roledescription="carousel"
      aria-labelledby="recommendations-title"
    >
      <div className="testimonials__header">
        <h2 id="recommendations-title" className="section-title">
          {testimonials.title}
        </h2>
        <div className="testimonials__controls">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous recommendation"
          >
            ‹
          </button>
          <span aria-live="polite">
            {index + 1} of {count}
          </span>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === count - 1}
            aria-label="Next recommendation"
          >
            ›
          </button>
        </div>
      </div>

      <div ref={trackRef} className="testimonials__track" onScroll={handleScroll}>
        {testimonials.items.map((item, i) => (
          <figure
            key={item.name}
            className="testimonial"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
          >
            <blockquote className="testimonial__quote">{item.quote}</blockquote>
            <figcaption className="testimonial__author">
              <img
                src={item.avatar}
                alt=""
                className="testimonial__avatar"
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
              />
              <span>
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.name}
                </a>
                <br />
                {item.company}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
