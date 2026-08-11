import { socials } from '../data/content'
import { socialIconMap } from './Icons'
import './SocialGrid.css'

export function SocialGrid() {
  return (
    <ul className="social-grid">
      {socials.map((social) => {
        const Icon = socialIconMap[social.icon]
        return (
          <li key={social.name} className="social-grid__item">
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.name}
              className="social-grid__link"
            >
              <Icon className="social-grid__icon" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
