import { testimonials } from '../data/content'
import './Testimonials.css'

export function Testimonials() {
  const loop = [...testimonials.items, ...testimonials.items]

  return (
    <section className="testimonials">
      <div className="testimonials__intro">
        <p className="eyebrow">{testimonials.eyebrow}</p>
        <h2 className="section-title">{testimonials.title}</h2>
        <p className="body-text testimonials__copy">{testimonials.intro}</p>
      </div>

      <div className="testimonials__viewport">
        <div className="testimonials__track">
          {loop.map((item, i) => (
            <a
              key={`${item.name}-${i}`}
              className="testimonial-card"
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              <div className="testimonial-card__author">
                <img
                  src={item.avatar}
                  alt=""
                  className="testimonial-card__avatar"
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.company}</p>
                </div>
              </div>
              <div className="testimonial-card__quote-mark" aria-hidden>
                ”
              </div>
              <p className="testimonial-card__quote">{item.quote}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
