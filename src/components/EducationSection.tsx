import type { EducationEntry } from '../content/portfolio'

interface EducationSectionProps {
  education: EducationEntry[]
}

export function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) return null

  return (
    <section className="section" aria-labelledby="education-heading">
      <h2 id="education-heading">Education</h2>
      <ul className="entry-list">
        {education.map((entry) => (
          <li key={`${entry.credential}-${entry.year}`}>
            <h3>{entry.credential}</h3>
            <p className="entry-meta">
              {entry.issuer} · {entry.year}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
