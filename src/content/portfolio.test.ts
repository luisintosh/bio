import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'

const CONTENT_PATH = 'src/content/portfolio.ts'

function loadPortfolioText(): string {
  if (!existsSync(CONTENT_PATH)) {
    throw new Error(`Content module missing: ${CONTENT_PATH}`)
  }
  return readFileSync(CONTENT_PATH, 'utf-8')
}

describe('@S2 About section content', () => {
  it('exports about copy with required meaning and skill chips', () => {
    const text = loadPortfolioText()

    expect(text).toMatch(/8\+ years/)
    expect(text).toMatch(/React/)
    expect(text).toMatch(/Next\.js/)
    expect(text).toMatch(/Node\.js/)
    expect(text).toMatch(/NestJS/)
    expect(text).toMatch(/LangGraph/)
    expect(text).toMatch(/LangChain/)
    expect(text).toMatch(/No vibe coding\./)
    expect(text).toMatch(/ACT/)
    expect(text).toMatch(/Senior/)
    expect(text).toMatch(/Lead/)
    expect(text).toMatch(/hiking/)
    expect(text).toMatch(/photos/)
    expect(text).toMatch(/coffee/)

    for (const chip of ['React', 'Next.js', 'Node.js', 'NestJS', 'TypeScript', 'LangGraph', 'LangChain', 'LLMs']) {
      expect(text).toContain(chip)
    }
  })
})

describe('@S3 Experience section content', () => {
  it('lists both lead roles with date ranges and preserved meaning', () => {
    const text = loadPortfolioText()

    expect(text).toMatch(/Lead Full-Stack AI Engineer/)
    expect(text).toMatch(/2025/)
    expect(text).toMatch(/Now/)
    expect(text).toMatch(/GenAI content platform/)
    expect(text).toMatch(/Node\.js[\s/]*LangGraph/)
    expect(text).toMatch(/Next\.js[\s/]*React/)

    expect(text).toMatch(/Lead Frontend Engineer/)
    expect(text).toMatch(/2020/)
    expect(text).toMatch(/2025/)
    expect(text).toMatch(/crypto|NFTs|ecommerce|gaming/)
    expect(text).toMatch(/Electron/)
    expect(text).toMatch(/Angular/)
    expect(text).toMatch(/Node\.js[\s/]*NestJS[\s/]*Kafka/)
  })
})

describe('@S4 Education section content', () => {
  it('lists all credentials with years', () => {
    const text = loadPortfolioText()

    expect(text).toMatch(/GenAI Agentic Track/)
    expect(text).toMatch(/GenAI Technical Track/)
    expect(text).toMatch(/Professional Cloud Developer/)
    expect(text).toMatch(/AWS Certified Developer/)
    expect(text).toMatch(/Computer Systems Engineer/)
    expect(text).toMatch(/2017/)
    expect(text).toMatch(/2022/)
    expect(text).toMatch(/2024/)
    expect((text.match(/2025/g) || []).length).toBeGreaterThanOrEqual(2)
  })
})

describe('@S22 Testimonials section content', () => {
  it('contains all five canonical entries with names, roles, and quotes', () => {
    const text = loadPortfolioText()

    const entries = [
      { name: 'Lance Blackstone', role: 'Assessment Industry Consultant', quote: 'pleasure of working with Luis very briefly' },
      { name: 'Paulo Lima', role: 'Operational Intelligence', quote: 'front-end architecture' },
      { name: 'Oleg Statnii', role: 'Senior QA Engineer', quote: 'professional and proactive' },
      { name: 'Axel Ayigbede', role: 'Engineering Manager', quote: 'Lead Frontend Developer' },
      { name: 'Nicolas Bouillet', role: 'Product Manager', quote: 'custom blockchain' },
    ]

    for (const { name, role, quote } of entries) {
      expect(text).toContain(name)
      expect(text).toContain(role)
      expect(text).toContain(quote)
    }
  })
})

describe('@S23 Empty testimonials do not fabricate quotes', () => {
  it('defines testimonials as a data-driven array and avoids placeholder quotes', () => {
    const text = loadPortfolioText()

    expect(text).toMatch(/testimonials\s*:\s*\[/)

    const placeholders = [/lorem ipsum/i, /sample testimonial/i, /placeholder quote/i]
    for (const pattern of placeholders) {
      expect(text).not.toMatch(pattern)
    }
  })
})
