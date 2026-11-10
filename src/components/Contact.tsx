import { contact, mailto } from '../data/content'
import { Corner } from './decor/Decor'
import './Contact.css'

export function Contact() {
  return (
    <section id="contact" className="contact">
      <Corner position="tl" />
      <Corner position="tr" />

      <h2 className="section-title contact__title">{contact.title}</h2>
      <p className="contact__location">{contact.location}</p>

      <a className="contact__button" href={mailto}>
        Email me
      </a>
      <p className="contact__address">{contact.email}</p>

      <ul className="contact__links">
        {contact.links.map((link) => (
          <li key={link.name}>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.name} <span aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>

      <Corner position="bl" />
      <Corner position="br" />
    </section>
  )
}
