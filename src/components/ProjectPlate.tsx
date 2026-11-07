import type { CaseStudySlug } from '../data/content'
import { ActGraph } from './ActGraph'
import { Corner } from './decor/Decor'
import { Picture } from './Picture'
import { SoloDevFlow } from './SoloDevFlow'
import './ProjectPlate.css'

/** The visual beside each project on the homepage. */
export function ProjectPlate({ slug }: { slug: CaseStudySlug }) {
  return (
    <div className={`plate plate--${slug}`}>
      <Corner position="tl" />
      <Corner position="br" />
      {slug === 'act' && <ActGraph />}
      {slug === 'solodev' && <SoloDevFlow />}
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
