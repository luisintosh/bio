import { mailto, profile } from '../data/content'
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
          {/* A non-breaking hyphen keeps "Full-Stack" on one line in the narrow caption. */}
          <p className="intro__polaroid-role">{profile.role.replace('-', '‑')}</p>
          <p className="intro__polaroid-year">{new Date().getFullYear()}</p>
        </div>
      </div>

      <h1 className="intro__headline">{profile.headline}</h1>
      <p className="body-text intro__subhead">{profile.subhead}</p>

      <dl className="intro__facts">
        <div>
          <dt>Role</dt>
          <dd>{profile.role}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{profile.location}</dd>
        </div>
        <div>
          <dt>Cloud</dt>
          <dd>
            {profile.cloudCertifications.map((certification) => (
              <span key={certification}>{certification}</span>
            ))}
          </dd>
        </div>
      </dl>

      <a className="intro__email" href={mailto}>
        Email me
      </a>
    </section>
  )
}
