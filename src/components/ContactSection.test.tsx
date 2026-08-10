import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'
import { createPortfolio } from '../content/portfolio'

const CONTACT = createPortfolio().contact
const originalLocation = window.location
let hrefSpy = vi.fn()

beforeEach(() => {
  hrefSpy = vi.fn()
  Object.defineProperty(window, 'location', {
    writable: true,
    configurable: true,
    value: {
      ...originalLocation,
      get href() {
        return ''
      },
      set href(value: string) {
        hrefSpy(value)
      },
    },
  })
})

afterEach(() => {
  Object.defineProperty(window, 'location', {
    writable: true,
    configurable: true,
    value: originalLocation,
  })
})

describe('@S5 Contact section shows prompt, form, and LinkedIn', () => {
  it('renders the heading, prompt, form fields, Send control, and safe LinkedIn link', () => {
    render(<App />)

    expect(screen.getByText(CONTACT.heading)).toBeInTheDocument()
    expect(screen.getByText(CONTACT.prompt)).toBeInTheDocument()

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument()

    const linkedIn = screen.getByRole('link', { name: /LinkedIn/i })
    expect(linkedIn).toHaveAttribute('href', CONTACT.linkedIn)
    expect(linkedIn).toHaveAttribute('target', '_blank')
    expect(linkedIn).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

describe('@S10 Valid submit triggers thanks and mailto', () => {
  it('shows a success acknowledgment and initiates mailto with subject and body from fields', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Luis' } })
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello there' } })
    fireEvent.click(screen.getByRole('button', { name: /Send/i }))

    expect(screen.getByText(/thank/i)).toBeInTheDocument()
    expect(hrefSpy).toHaveBeenCalledTimes(1)
    expect(hrefSpy).toHaveBeenCalledWith(expect.stringMatching(/^mailto:hello@luisexpert\.dev\?/))

    const mailto = hrefSpy.mock.calls[0][0] as string
    expect(decodeURIComponent(mailto)).toContain('Luis')
    expect(decodeURIComponent(mailto)).toContain('Hello there')
  })
})

describe('@S11 Empty required fields do not succeed', () => {
  it.each([
    { name: '', message: 'I have no name' },
    { name: 'I have no message', message: '' },
  ])('rejects empty fields and does not handoff mailto', ({ name, message }) => {
    render(<App />)

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: name } })
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: message } })
    fireEvent.click(screen.getByRole('button', { name: /Send/i }))

    expect(screen.queryByText(/thank/i)).not.toBeInTheDocument()
    expect(hrefSpy).not.toHaveBeenCalled()
    expect(screen.getByText(/required/i)).toBeInTheDocument()
  })
})

describe('@S12 Missing or invalid LinkedIn URL is not presented as a live link', () => {
  it.each([
    { linkedIn: '', label: 'empty' },
    { linkedIn: 'not-a-url', label: 'invalid' },
    { linkedIn: 'javascript:alert(1)', label: 'javascript:' },
    { linkedIn: 'data:text/html,<script>alert(1)</script>', label: 'data:' },
  ])('hides the clickable LinkedIn control when URL is $label', ({ linkedIn }) => {
    render(
      <App
        portfolio={createPortfolio({
          contact: { ...CONTACT, linkedIn },
        })}
      />,
    )

    expect(screen.queryByRole('link', { name: /LinkedIn/i })).not.toBeInTheDocument()
    expect(screen.getByText(CONTACT.heading)).toBeInTheDocument()
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument()
  })
})

describe('@S15 Rapid double submit does not leave a stuck multi-success state', () => {
  it('allows at most one success acknowledgment and one mailto launch', async () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Luis' } })
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello there' } })

    const sendButton = screen.getByRole('button', { name: /Send/i })
    fireEvent.click(sendButton)
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(screen.queryAllByText(/thank/i).length).toBeLessThanOrEqual(1)
    })

    expect(hrefSpy.mock.calls.length).toBeLessThanOrEqual(1)
    expect(sendButton).not.toBeDisabled()
  })
})
