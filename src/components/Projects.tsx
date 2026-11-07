import { caseStudies, whenAreYou } from '../data/content'
import { Picture } from './Picture'
import { ProjectPlate } from './ProjectPlate'
import './Projects.css'

function ProjectHover({ external = false }: { external?: boolean }) {
  return (
    <>
      <span className="project__wipe" aria-hidden />
      <span className="project__arrow" aria-hidden>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          transform={external ? 'rotate(-45)' : undefined}
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </>
  )
}

export function Projects() {
  return (
    <section id="work" className="projects" aria-label="Selected work">
      {caseStudies.map((study) => (
        <div key={study.slug} className="project">
          {/* An overlay link, so its name is the title rather than the whole row. */}
          <a
            className="project__link"
            href={`/work/${study.slug}/`}
            aria-labelledby={`project-${study.slug}`}
          />
          <div className="project__copy">
            <ProjectHover />
            <p className="project__name">{study.name}</p>
            <h2 id={`project-${study.slug}`} className="project__title">
              {study.title}
            </h2>
            <p className="project__summary">
              {study.summary}
              {study.ownership && ` ${study.ownership}`}
            </p>
            <ul className="project__decisions">
              {study.decisions.map((decision) => (
                <li key={decision.title}>{decision.title}</li>
              ))}
            </ul>
            <span className="project__cta" aria-hidden>
              Read the case study
            </span>
          </div>
          <ProjectPlate slug={study.slug} />
        </div>
      ))}

      <div className="project project--small">
        <a
          className="project__link"
          href={whenAreYou.href}
          target="_blank"
          rel="noreferrer"
          aria-labelledby="project-when-are-you"
        />
        <div className="project__copy">
          <ProjectHover external />
          <h2 id="project-when-are-you" className="project__title">
            {whenAreYou.title}
          </h2>
          <p className="project__summary">{whenAreYou.description}</p>
          <span className="project__cta" aria-hidden>
            Open the app
          </span>
        </div>
        <div className="project__thumb">
          <Picture src={whenAreYou.image} alt={whenAreYou.imageAlt} />
        </div>
      </div>
    </section>
  )
}
