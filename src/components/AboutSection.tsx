import type { AboutContent } from '../content/portfolio'

interface AboutSectionProps {
  about: AboutContent
}

export function AboutSection({ about }: AboutSectionProps) {
  if (!about.body.trim()) return null

  return (
    <section className="section" aria-labelledby="about-heading">
      <h2 id="about-heading">About</h2>
      <p>{about.body}</p>
      {about.skillChips.length > 0 && (
        <ul className="skill-chips">
          {about.skillChips.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
