import { principles } from '../data/content'
import './Principles.css'

export function Principles() {
  return (
    <section className="principles">
      <h2 className="section-title principles__title">How I work</h2>
      <ul className="principles__grid">
        {principles.map((principle) => (
          <li key={principle.title} className="principles__item">
            <h3>{principle.title}</h3>
            <p>{principle.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
