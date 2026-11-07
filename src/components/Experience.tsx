import { education, experience } from '../data/content'
import './Experience.css'

export function Experience() {
  return (
    <section id="experience" className="experience">
      <h2 className="section-title experience__title">Experience</h2>
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

      <h2 className="section-title experience__title">Education</h2>
      <ul className="experience__education">
        {education.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
