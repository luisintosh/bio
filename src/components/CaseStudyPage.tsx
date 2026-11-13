import { type CaseStudy, caseStudies, testimonials } from '../data/content'
import { flows } from '../data/flows'
import { Corner } from './decor/Decor'
import { Picture } from './Picture'
import { SiteShell } from './SiteShell'
import { Swimlane } from './Swimlane'
import './CaseStudyPage.css'

function Arrow({ external = false }: { external?: boolean }) {
  return (
    <svg
      className="case__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d={external ? 'M7 17 17 7M8 7h9v9' : 'M5 12h14M13 6l6 6-6 6'} />
    </svg>
  )
}

/** The page's own visual beside or below the header, when the work can be shown. */
function HeaderArt({ slug }: { slug: CaseStudy['slug'] }) {
  if (slug !== 'solodev') return null
  return (
    <Picture
      src="/assets/links/solodev"
      alt="SoloDev artwork: a developer at a desk with a team of AI shadows behind them. Its caption reads: Summon a team of AI “shadows” with one command."
      className="case__art"
      width={960}
      height={960}
      loading="eager"
    />
  )
}

function Quote({ name }: { name: string }) {
  const item = testimonials.items.find((t) => t.name === name)
  if (!item) return null
  return (
    <figure className="case__quote">
      <blockquote>
        <p>“{item.quote}”</p>
      </blockquote>
      <figcaption>
        <img src={item.avatar} alt="" width={44} height={44} loading="lazy" decoding="async" />
        <span>
          <a href={item.href} target="_blank" rel="noreferrer">
            {item.name}
          </a>
          <br />
          {item.company}
        </span>
      </figcaption>
    </figure>
  )
}

function TryIt({ link }: { link: NonNullable<CaseStudy['link']> }) {
  return (
    <section className="case__try" aria-labelledby="try-title">
      <h2 id="try-title" className="case__h2">
        Try it
      </h2>
      <pre className="case__terminal">
        <code>
          <span className="case__prompt">$ npx skills add luisintosh/solodev</span>
          {'\n'}
          <span className="case__muted">Then, once in each coding tool, and in a new session:</span>
          {'\n\n'}
          <span className="case__prompt">/solo-task init</span>
          {'\n'}
          <span className="case__prompt">/solo-task Add CSV export to the accounts page</span>
        </code>
      </pre>
      <a className="case__button" href={link.href} target="_blank" rel="noreferrer">
        {link.label}
        <Arrow external />
      </a>
    </section>
  )
}

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const next = caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length]

  return (
    <SiteShell>
      <article className={`case case--${study.slug}`}>
        <header className="case__head">
          <div className="case__head-copy">
            <nav className="case__crumbs" aria-label="Breadcrumb">
              <a href="/#work">Work</a>
              <span aria-hidden>/</span>
              <span aria-current="page">{study.name}</span>
              {study.site && (
                <a className="case__site" href={study.site.href} target="_blank" rel="noreferrer">
                  {study.site.label}
                  <Arrow external />
                </a>
              )}
            </nav>
            <h1 className="case__title">{study.title}</h1>
            <p className="case__dek">{study.dek}</p>
          </div>
          <HeaderArt slug={study.slug} />
        </header>

        <dl className="case__facts">
          {study.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>

        {study.slug === 'ultra' && (
          <figure className="case__screens">
            <Picture
              src="/assets/portfolio/ultra-crypto-wallet"
              alt="Ultra wallet screens: a balance view and a collectible transfer"
              className="case__screen"
              width={780}
              height={730}
              loading="eager"
            />
          </figure>
        )}

        <section className="case__arc" aria-labelledby="story-title">
          <h2 id="story-title" className="sr-only">
            The story
          </h2>
          <ol>
            {study.beats.map((beat) => (
              <li key={beat.tick}>
                <span className="case__tick">{beat.tick}</span>
                <h3>{beat.title}</h3>
                <p>{beat.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="case__flow" aria-labelledby="flow-title">
          <Corner position="tl" />
          <Corner position="br" />
          <div className="case__flow-head">
            <h2 id="flow-title" className="case__h2">
              {study.flow.title}
            </h2>
            <p>{study.flow.caption}</p>
          </div>
          <Swimlane flow={flows[study.slug]} id={study.slug} />
        </section>

        <section className="case__calls" aria-labelledby="calls-title">
          <h2 id="calls-title" className="case__h2">
            Calls I made
          </h2>
          <ul>
            {study.decisions.map((decision) => (
              <li key={decision.title}>
                <h3>{decision.title}</h3>
                <p>{decision.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="case__layers" aria-labelledby="layers-title">
          <h2 id="layers-title" className="case__h2">
            {study.layers.title}
          </h2>
          <dl>
            {study.layers.items.map((layer) => (
              <div key={layer.name}>
                <dt>{layer.name}</dt>
                <dd>
                  <ul>
                    {layer.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {study.quote && <Quote name={study.quote} />}
        {study.link && <TryIt link={study.link} />}

        <a className="case__next" href={`/work/${next.slug}/`}>
          <span className="case__next-label">Next case · {next.name}</span>
          <span className="case__next-title">{next.title}</span>
          <span className="case__next-arrow">
            <Arrow />
          </span>
        </a>
      </article>
    </SiteShell>
  )
}
