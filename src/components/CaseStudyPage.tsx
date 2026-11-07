import { type CaseStudy, caseStudies } from '../data/content'
import { ActDiagram } from './ActDiagram'
import { Picture } from './Picture'
import { SiteShell } from './SiteShell'
import { SoloDevDiagram } from './SoloDevDiagram'
import { SoloDevTerminal } from './SoloDevTerminal'
import './CaseStudyPage.css'

function Visual({ slug }: { slug: CaseStudy['slug'] }) {
  if (slug === 'act') return <ActDiagram />

  if (slug === 'solodev') {
    return (
      <>
        <div className="case__visual case__visual--solodev">
          <Picture
            src="/assets/links/solodev"
            alt="SoloDev artwork: a developer at a desk with a team of AI shadows behind them. Its caption reads: Summon a team of AI “shadows” with one command."
            className="case__art"
            width={960}
            height={960}
            loading="eager"
          />
          <SoloDevTerminal />
        </div>
        <SoloDevDiagram />
      </>
    )
  }

  return (
    <figure className="case__visual case__visual--ultra">
      <Picture
        src="/assets/portfolio/ultra-crypto-wallet"
        alt="Ultra wallet screens: a balance view and a collectible transfer"
        className="case__screen"
        width={780}
        height={730}
        loading="eager"
      />
    </figure>
  )
}

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const next = caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length]

  return (
    <SiteShell>
      <article>
        <header className="case__header">
          <p className="case__name">{study.name}</p>
          <h1 className="case__title">{study.title}</h1>
          <p className="case__summary">{study.summary}</p>
          <p className="body-text case__intro">{study.intro}</p>
          {study.link && (
            <a className="case__link" href={study.link.href} target="_blank" rel="noreferrer">
              {study.link.label}
            </a>
          )}
        </header>

        <Visual slug={study.slug} />

        <section className="case__row">
          <h2 className="eyebrow case__label">Decisions:</h2>
          <ul className="case__decisions">
            {study.decisions.map((decision) => (
              <li key={decision.title}>
                <h3>{decision.title}</h3>
                <p>{decision.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="case__row case__row--scope">
          <h2 className="eyebrow case__label">Also:</h2>
          <p className="case__scope">{study.scope}</p>
        </section>

        <a className="case__next" href={`/work/${next.slug}/`}>
          Next: {next.name}
        </a>
      </article>
    </SiteShell>
  )
}
