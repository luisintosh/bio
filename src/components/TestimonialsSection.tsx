import type { TestimonialEntry } from '../content/portfolio'

interface TestimonialsSectionProps {
  testimonials: TestimonialEntry[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null

  return (
    <section className="section" aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading">Testimonials</h2>
      <ul className="entry-list">
        {testimonials.map((entry) => (
          <li key={entry.name}>
            <h3>{entry.name}</h3>
            <p className="entry-meta">{entry.role}</p>
            {entry.context && <p className="entry-context">{entry.context}</p>}
            <blockquote cite={`#testimonial-${entry.name}`}>
              <p>{entry.quote}</p>
            </blockquote>
          </li>
        ))}
      </ul>
    </section>
  )
}
