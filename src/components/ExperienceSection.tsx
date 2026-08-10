import type { ExperienceEntry } from '../content/portfolio'

interface ExperienceSectionProps {
  experience: ExperienceEntry[]
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  if (experience.length === 0) return null

  return (
    <section className="section" aria-labelledby="experience-heading">
      <h2 id="experience-heading">Experience</h2>
      <ul className="entry-list">
        {experience.map((entry) => (
          <li key={`${entry.title}-${entry.dateRange}`}>
            <h3>{entry.title}</h3>
            <p className="entry-meta">
              {entry.company} · {entry.dateRange}
            </p>
            <p>{entry.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
