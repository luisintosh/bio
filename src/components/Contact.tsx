import { contact } from '../data/content'
import { Corner } from './decor/Decor'
import './Contact.css'

const MAILTO = `mailto:${contact.email}?subject=${encodeURIComponent(contact.subject)}`

export function Contact() {
  return (
    <section id="contact" className="contact">
      <Corner position="tl" />
      <Corner position="tr" />

      <h2 className="section-title contact__title">{contact.title}</h2>
      <p className="contact__location">{contact.location}</p>

      <a className="contact__button" href={MAILTO}>
        Email me
      </a>
      <p className="contact__address">{contact.email}</p>
      <p className="contact__resume">{contact.resume}</p>

      <ul className="contact__links">
        {contact.links.map((link) => (
          <li key={link.name}>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.name}
            </a>
          </li>
        ))}
      </ul>

      <Corner position="bl" />
      <Corner position="br" />
    </section>
  )
}
