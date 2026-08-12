import { type FormEvent, useRef } from 'react'
import { contact } from '../data/content'
import { Corner } from './decor/Decor'
import './Contact.css'

const MAILTO = 'yo@uism.dev'
const SUBJECT = '[luism.dev] Contact Form'

export function Contact() {
  const messageRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const message = messageRef.current?.value.trim() ?? ''
    if (!message) return

    const href = `mailto:${MAILTO}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(message)}`
    window.location.href = href
  }

  return (
    <section className="contact">
      <Corner position="tl" />
      <Corner position="tr" />

      <div className="contact__intro">
        <p className="eyebrow">{contact.eyebrow}</p>
        <h2 className="section-title">{contact.title}</h2>
        <p className="body-text contact__copy">{contact.intro}</p>
      </div>

      <form className="contact__form" onSubmit={handleSubmit}>
        <label className="contact__field">
          <span>Message*</span>
          <textarea
            ref={messageRef}
            name="Message"
            placeholder="Role, company, and a short note"
            rows={6}
            required
          />
        </label>
        <button type="submit" className="contact__submit">
          Send
        </button>
      </form>

      <Corner position="bl" />
      <Corner position="br" />
    </section>
  )
}
