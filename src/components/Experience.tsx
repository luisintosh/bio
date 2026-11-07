import { education, experience } from '../data/content'
import './Experience.css'

export function Experience() {
  return (
    <section id="experience" className="experience">
      <div className="experience__label">
        <h2 className="eyebrow">Experience:</h2>
      </div>
      <ul className="experience__list">
        {experience.map((item) => (
          <li key={item.company} className="experience__item">
            <div className="experience__header">
              <span className="experience__role">{item.role}</span>
              <span className="experience__dates">{item.dates}</span>
            </div>
            <span className="experience__company">{item.company}</span>
            <p className="experience__summary">{item.summary}</p>
          </li>
        ))}
      </ul>

      <div className="experience__label">
        <h2 className="eyebrow">Education:</h2>
      </div>
      <p className="experience__note">{education}</p>
    </section>
  )
}
