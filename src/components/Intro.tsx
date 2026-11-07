import { profile } from '../data/content'
import { Corner } from './decor/Decor'
import { Picture } from './Picture'
import './Intro.css'

export function Intro() {
  return (
    <section className="intro">
      <Corner position="bl" />

      <div className="intro__polaroid">
        <div className="intro__photo-wrap">
          <Picture
            src={profile.image}
            alt={profile.name}
            className="intro__photo"
            width={512}
            height={512}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="intro__polaroid-meta">
          <p className="intro__polaroid-role">{profile.role}</p>
          <p className="intro__polaroid-year">{new Date().getFullYear()}</p>
        </div>
      </div>

      <h1 className="intro__headline">{profile.headline}</h1>
      <p className="body-text intro__subhead">{profile.subhead}</p>
    </section>
  )
}
