import { education } from '../data/content'
import { IconCheck } from './Icons'
import './Services.css'

export function Services() {
  return (
    <section className="services">
      <div className="services__label">
        <h3 className="eyebrow">Education:</h3>
      </div>
      <ul className="services__list">
        {education.map((item) => (
          <li key={`${item.title}-${item.year}`} className="services__item">
            <IconCheck className="services__check" />
            <div className="services__copy">
              <span className="services__title">{item.title}</span>
              <span className="services__meta">
                {item.school} · {item.year}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
