import { profile } from '../data/content'
import { Corner } from './decor/Decor'
import './SiteNav.css'

const LINKS = [
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  // Every page has a contact section, so this one stays on the current page.
  { label: 'Email', href: '#contact' },
]

const EXTERNAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/luismendieta' },
  { label: 'GitHub', href: 'https://github.com/luisintosh' },
]

export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Main">
      <Corner position="tl" />
      <Corner position="tr" />
      <a className="site-nav__name" href="/">
        {profile.name}
      </a>
      <ul className="site-nav__links">
        {LINKS.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
        {EXTERNAL_LINKS.map((link) => (
          <li key={link.label}>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.label} <span aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
