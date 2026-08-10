import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import App from '../App'
import { createPortfolio } from '../content/portfolio'

const LEGACY_GREETING = /hello, i'm Luis Mendieta/i

describe('@S1 First viewport shows recruiter-facing identity', () => {
  it('renders the hero name and senior/AI role signals, avoiding the legacy greeting', () => {
    render(<App />)

    expect(screen.getByText('Luis Mendieta')).toBeInTheDocument()

    expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument()
    expect(screen.getByText(/Lead Full-Stack AI Engineer/i)).toBeInTheDocument()

    expect(screen.queryByText(LEGACY_GREETING)).not.toBeInTheDocument()
  })
})

describe('@S2 About section preserves meaning and skill chips', () => {
  it('renders required about copy and all skill chips in the document', () => {
    render(<App />)

    const about = screen.getByRole('region', { name: 'About' })
    const body = within(about).getByText(/Full-stack engineer with 8\+ years/)

    expect(body).toHaveTextContent(/React/)
    expect(body).toHaveTextContent(/Next\.js/)
    expect(body).toHaveTextContent(/Node\.js/)
    expect(body).toHaveTextContent(/NestJS/)
    expect(body).toHaveTextContent(/LangGraph/)
    expect(body).toHaveTextContent(/LangChain/)
    expect(body).toHaveTextContent(/No vibe coding\./)
    expect(body).toHaveTextContent(/ACT/)
    expect(body).toHaveTextContent(/Senior\/Lead/)
    expect(body).toHaveTextContent(/hiking/)
    expect(body).toHaveTextContent(/photos/)
    expect(body).toHaveTextContent(/coffee/)

    const chips = within(about).getAllByRole('listitem')
    for (const chip of ['React', 'Next.js', 'Node.js', 'NestJS', 'TypeScript', 'LangGraph', 'LangChain', 'LLMs']) {
      expect(chips.some((li) => li.textContent === chip)).toBe(true)
    }
  })
})

describe('@S3 Experience section lists both roles with date ranges', () => {
  it('renders both lead roles, companies, ranges, and description meaning', () => {
    render(<App />)

    const experience = screen.getByRole('region', { name: 'Experience' })

    expect(within(experience).getByText('Lead Full-Stack AI Engineer')).toBeInTheDocument()
    expect(within(experience).getByText(/ACT Company.*2025.*Now/)).toBeInTheDocument()
    expect(within(experience).getByText(/GenAI content platform/i)).toBeInTheDocument()
    expect(within(experience).getByText(/Node\.js\/LangGraph/i)).toBeInTheDocument()
    expect(within(experience).getByText(/Next\.js\/React/i)).toBeInTheDocument()

    expect(within(experience).getByText('Lead Frontend Engineer')).toBeInTheDocument()
    expect(within(experience).getByText(/Ultra Company.*2020.*2025/)).toBeInTheDocument()
    expect(within(experience).getByText(/crypto|NFTs|ecommerce|gaming/i)).toBeInTheDocument()
    expect(within(experience).getByText(/Electron/)).toBeInTheDocument()
    expect(within(experience).getByText(/Angular/)).toBeInTheDocument()
    expect(within(experience).getByText(/Node\.js\/NestJS\/Kafka/i)).toBeInTheDocument()
  })
})

describe('@S4 Education section lists credentials with years', () => {
  it('renders all five credentials and their years', () => {
    render(<App />)

    const education = screen.getByRole('region', { name: 'Education' })

    expect(within(education).getByText('GenAI Agentic Track')).toBeInTheDocument()
    expect(within(education).getByText('GenAI Technical Track')).toBeInTheDocument()
    expect(within(education).getByText('Professional Cloud Developer')).toBeInTheDocument()
    expect(within(education).getByText('AWS Certified Developer — Associate')).toBeInTheDocument()
    expect(within(education).getByText('Computer Systems Engineer, Computer Science')).toBeInTheDocument()

    expect(within(education).getAllByText(/2025/).length).toBeGreaterThanOrEqual(2)
    expect(within(education).getByText(/2024/)).toBeInTheDocument()
    expect(within(education).getByText(/2022/)).toBeInTheDocument()
    expect(within(education).getByText(/2017/)).toBeInTheDocument()
  })
})

describe('@S16 Missing section content does not break the page shell', () => {
  it('keeps identity visible and does not fabricate placeholder entries when sections are empty', () => {
    render(
      <App
        portfolio={createPortfolio({
          about: { body: '', skillChips: [] },
          experience: [],
          education: [],
          testimonials: [],
        })}
      />,
    )

    expect(screen.getByText('Luis Mendieta')).toBeInTheDocument()
    expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument()
    expect(screen.getByText(/Lead Full[\u2013-]Stack AI Engineer/i)).toBeInTheDocument()

    expect(screen.queryByText('About')).not.toBeInTheDocument()
    expect(screen.queryByText('Experience')).not.toBeInTheDocument()
    expect(screen.queryByText('Education')).not.toBeInTheDocument()
    expect(screen.queryByText('Testimonials')).not.toBeInTheDocument()

    const placeholders = [
      /lorem ipsum/i,
      /placeholder/i,
      /sample testimonial/i,
      /no entries yet/i,
    ]
    for (const pattern of placeholders) {
      expect(screen.queryByText(pattern)).not.toBeInTheDocument()
    }
  })
})

describe('@S22 Testimonials section presents all five canonical entries', () => {
  it('shows each name, role, and a distinct quote snippet', () => {
    render(<App />)

    const entries = [
      { name: 'Lance Blackstone', role: /Assessment Industry Consultant/i, quote: /ACT AI-powered prototype/i },
      { name: 'Paulo Lima', role: /Operational Intelligence/i, quote: /front-end architecture/i },
      { name: 'Oleg Statnii', role: /Senior QA Engineer/i, quote: /professional and proactive/i },
      { name: 'Axel Ayigbede', role: /Engineering Manager/i, quote: /Lead Frontend Developer/i },
      { name: 'Nicolas Bouillet', role: /Product Manager/i, quote: /custom blockchain/i },
    ]

    for (const { name, role, quote } of entries) {
      expect(screen.getByText(name)).toBeInTheDocument()
      expect(screen.getByText(role)).toBeInTheDocument()
      expect(screen.getByText(quote)).toBeInTheDocument()
    }
  })
})

describe('@S23 Empty testimonials content source does not fabricate quotes', () => {
  it('renders identity and other sections but no testimonial names or quotes', () => {
    render(<App portfolio={createPortfolio({ testimonials: [] })} />)

    expect(screen.getByText('Luis Mendieta')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Education')).toBeInTheDocument()

    expect(screen.queryByText('Testimonials')).not.toBeInTheDocument()

    const names = ['Lance Blackstone', 'Paulo Lima', 'Oleg Statnii', 'Axel Ayigbede', 'Nicolas Bouillet']
    for (const name of names) {
      expect(screen.queryByText(name)).not.toBeInTheDocument()
    }

    expect(screen.queryByText(/ACT AI-powered prototype/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/front-end architecture/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/professional and proactive/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Lead Frontend Developer/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/custom blockchain/i)).not.toBeInTheDocument()
  })
})
