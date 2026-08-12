import { profile } from '../data/content'
import { Corner } from './decor/Decor'
import { Picture } from './Picture'
import './Intro.css'

export function Intro() {
  return (
    <section className="intro">
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />

      <div className="intro__top">
        <div className="intro__polaroid">
          <div className="intro__photo-wrap">
            <Picture
              src={profile.image}
              alt={`${profile.firstName} ${profile.lastName}`}
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

        <div className="intro__name-block">
          <p className="eyebrow intro__label">{profile.label}</p>
          <h1 className="intro__name">
            <span>{profile.firstName}</span>
            <span>{profile.lastName}</span>
          </h1>
        </div>
      </div>

      <p className="body-text intro__bio">{profile.bio}</p>
    </section>
  )
}
