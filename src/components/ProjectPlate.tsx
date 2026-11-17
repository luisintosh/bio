import type { CaseStudySlug } from '../data/content'
import { ActGraph } from './ActGraph'
import { Corner } from './decor/Decor'
import { Picture } from './Picture'
import './ProjectPlate.css'

/** The visual beside each project on the homepage. */
export function ProjectPlate({ slug }: { slug: CaseStudySlug }) {
  return (
    <div className={`plate plate--${slug}`}>
      <Corner position="tl" />
      <Corner position="br" />
      {slug === 'act' && <ActGraph />}
      {slug === 'solodev' && (
        <Picture
          src="/assets/links/solodev"
          alt="SoloDev artwork: a developer at a keyboard with a team of AI agents behind them, labeled strategist, reviewer, coder, quality assurance, and systems architect, all linked to the problem in the middle."
          className="plate__art"
          width={960}
          height={960}
        />
      )}
      {slug === 'ultra' && (
        <Picture
          src="/assets/portfolio/ultra-crypto-wallet"
          alt="Ultra wallet screens: a balance view and a collectible transfer"
          className="plate__screen"
          width={780}
          height={730}
        />
      )}
    </div>
  )
}
