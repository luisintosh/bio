import { testimonials } from '../data/content'
import './Testimonials.css'

export function Testimonials() {
  return (
    <section className="testimonials" aria-labelledby="recommendations-title">
      <h2 id="recommendations-title" className="section-title testimonials__title">
        {testimonials.title}
      </h2>

      <ul className="testimonials__list">
        {testimonials.items.map((item) => (
          <li key={item.name}>
            <figure className="testimonial">
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
                    {item.name} <span aria-hidden>↗</span>
                  </a>
                  <br />
                  {item.company}
                </span>
              </figcaption>
              <blockquote className="testimonial__quote">{item.quote}</blockquote>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
