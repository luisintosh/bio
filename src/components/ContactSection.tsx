import { useRef, useState, type FormEvent } from 'react'
import type { ContactContent } from '../content/portfolio'
import { buildContactMailto } from '../lib/mailto'
import { SocialLink } from './SocialLink'

interface ContactSectionProps {
  contact: ContactContent
}

export function ContactSection({ contact }: ContactSectionProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [succeeded, setSucceeded] = useState(false)
  const submittedRef = useRef(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submittedRef.current) return

    const trimmedName = name.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName || !trimmedMessage) {
      setError('Name and Message are required.')
      setSucceeded(false)
      return
    }

    submittedRef.current = true
    setError(null)
    setSucceeded(true)
    window.location.href = buildContactMailto({
      name: trimmedName,
      message: trimmedMessage,
    })
  }

  return (
    <section className="section contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">{contact.heading}</h2>
      <p>{contact.prompt}</p>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="contact-field">
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="contact-field">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>
        <button type="submit">Send</button>
      </form>

      {error && <p className="contact-error">{error}</p>}
      {succeeded && <p className="contact-success">Thanks — talk soon.</p>}

      <SocialLink href={contact.linkedIn} />
    </section>
  )
}
