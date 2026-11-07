export const profile = {
  name: 'Luis Mendieta',
  role: 'Senior GenAI Full-Stack Engineer',
  headline: 'I build AI workflows that people can trust in production.',
  subhead:
    'LangGraph, RAG, and full-stack TypeScript, for education and healthcare.',
  location: 'Remote from Mexico',
  cloudCertifications: [
    'AWS Certified Developer Associate',
    'Google Cloud Professional Cloud Developer',
  ],
  image: '/assets/links/profile',
}

export type CaseStudySlug = 'act' | 'solodev' | 'ultra'

type Decision = {
  title: string
  body: string
}

export type CaseStudy = {
  slug: CaseStudySlug
  name: string
  title: string
  summary: string
  /** Shown on the homepage row when the summary doesn't say what Luis did. */
  ownership?: string
  intro: string
  decisions: Decision[]
  scope: string
  link?: { label: string; href: string }
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'act',
    name: 'ACT',
    title: 'Fresh exam questions from a multi-agent LangGraph platform',
    summary: 'In production pilot with Biology, English, and Math specialists.',
    ownership: 'I owned features end to end on a team of three.',
    intro:
      'A GenAI platform that keeps exams supplied with new questions. I owned features end to end on a team of three, from the LangGraph agents to the NestJS API and the Next.js app that content specialists use. The platform is private, so this page covers its architecture.',
    decisions: [
      {
        title: 'Specialized agents instead of one big prompt',
        body: 'Question generation, passage generation, and question review each have their own prompt and rules. That let us combine agents for different topics.',
      },
      {
        title: 'Regenerate first, then ask a person',
        body: 'A RAG search compares each new question against the question bank. Text that is 80% similar or more gets regenerated. If it happens again in the second round, it goes to a specialist.',
      },
      {
        title: 'Specialists make the final call',
        body: 'No item is accepted without specialist review. Audit logs on scheduling keep AI-driven content work traceable.',
      },
    ],
    scope:
      'Asynchronous drafting and review pipelines with durable checkpoints, collision-safe job scheduling, live progress over authenticated Socket.IO, RAG over textbook PDFs for passages, IMS QTI export, and Jest and Playwright coverage for concurrency edge cases.',
  },
  {
    slug: 'solodev',
    name: 'SoloDev',
    title: 'From one approved spec to a reviewed, tested pull request',
    summary: 'Open source. Works with Claude Code, Codex, and Cursor.',
    intro:
      'A skill set that gives coding agents the checks they can’t give themselves. I first built this approach for my team, where all three engineers adopted it. SoloDev is my public version, and I use it every day.',
    decisions: [
      {
        title: 'No code before an approved spec',
        body: 'You approve the requirements, acceptance scenarios, and plan first. The solodev check command fails any branch that has code before that approval.',
      },
      {
        title: 'The reviewer never wrote the code',
        body: 'A reviewer with fresh context runs each test on the old code, where it must fail, and on the new code, where it must pass. Then it reads the diff through lenses such as security and correctness.',
      },
      {
        title: 'Budgets instead of endless loops',
        body: 'Each step gets a limit: two implementation attempts, one fix round, and one re-review. When a budget runs out, the work comes back to you.',
      },
    ],
    scope:
      'Three commands: /mission ships one feature, /strategy plans a roadmap, and /gen-docs maps a repo once.',
    link: {
      label: 'View SoloDev on GitHub',
      href: 'https://github.com/luisintosh/solodev',
    },
  },
  {
    slug: 'ultra',
    name: 'Ultra',
    title: 'A crypto wallet that unlocks as simply as signing in',
    summary:
      'Principal-level ownership of React architecture and API contracts, for products serving thousands of active users.',
    intro:
      'A Chrome extension wallet connected to an NFT marketplace. I led the frontend architecture and guided a two-engineer frontend team through planning, code review, and delivery.',
    decisions: [
      {
        title: 'Sign-in unlocks the wallet',
        body: 'People unlock the wallet with their account sign-in, and decryption keys are never stored in the frontend.',
      },
      {
        title: 'A small command interface for the wallet',
        body: 'A JavaScript Proxy exposes the commands the wallet makes available to the marketplace.',
      },
      {
        title: 'Encrypted messages between marketplace and wallet',
        body: 'The two communicate through Chrome Extensions API events, with the messages encrypted, following the Chrome Developers best practices.',
      },
    ],
    scope:
      'An Electron game launcher with offline capabilities and auto-updates, NestJS and GraphQL services, Apache Kafka message flows, and CI/CD pipelines.',
  },
]

export const principles = [
  {
    title: 'Deterministic shell, non-deterministic core',
    body: 'Checkpoints, schedules, and validation wrap the LLM calls.',
  },
  {
    title: 'Specialized agents over one giant prompt',
    body: 'Each has its own rules, so they can be combined for different topics.',
  },
  {
    title: 'Retry once, then ask a person',
    body: 'A near-duplicate is regenerated first, then flagged to a specialist on the second round.',
  },
  {
    title: 'People make the final call',
    body: 'Specialists approve every item, and an audit trail makes the decisions traceable.',
  },
]

export const experience = [
  {
    role: 'Senior Full-Stack Engineer',
    company: 'MaxiCare',
    dates: 'Sep 2026 - Now',
    summary:
      'Building AI workflows into an AI-native EMR for skilled nursing and assisted living, so nurses and doctors spend less time on the platform and more with residents.',
  },
  {
    role: 'Senior Full-Stack Software Engineer, AI Platform',
    company: 'ACT (via Coforge)',
    dates: 'Sep 2025 - Aug 2026',
    summary:
      'Built a GenAI assessment platform with LangGraph, NestJS, and Next.js on a team of three, now in production pilot with content specialists.',
  },
  {
    role: 'Senior to Principal Frontend Engineer',
    company: 'Ultra (via Coforge)',
    dates: 'Mar 2020 - Sep 2025',
    summary:
      'Led React architecture for a crypto wallet and NFT marketplace serving thousands of active users, and delivered backend services with NestJS, GraphQL, and Kafka.',
  },
]

export const education = [
  'B.S. Computer Systems Engineering, Tecnológico Nacional de México',
  ...profile.cloudCertifications,
  'GenAI training, technical and agentic tracks, from DeepLearning.AI and IBM',
]

export const whenAreYou = {
  title: 'When Are You',
  description: 'One live clock for your team across time zones.',
  href: 'https://whenareyou.luism.dev/',
  image: '/assets/links/whenareyou',
  imageAlt: 'When Are You home screen with a 24-hour team clock',
}

export const testimonials = {
  title: 'From people I’ve worked with',
  items: [
    {
      name: 'Lance Blackstone',
      company: 'Product Owner @ ACT',
      quote:
        'Luis was easy to work with: skilled, collaborative, and responsive. He listened well, found good solutions, and met commitments. I’d work with him again in a heartbeat.',
      avatar: '/assets/avatars/lance.png',
      href: 'https://www.linkedin.com/in/lancemblackstone',
    },
    {
      name: 'Axel Ayigbede',
      company: 'Engineering Manager @ Ultra',
      quote:
        'Essential to our Ultra team: always ready to help, full of ideas, and great at building relationships. A passionate, motivated teammate I highly recommend.',
      avatar: '/assets/avatars/axel.png',
      href: 'https://www.linkedin.com/in/luismendieta/details/recommendations/?detailScreenTabIndex=0',
    },
    {
      name: 'Paulo Ferreira',
      company: 'Lead Backend @ Ultra',
      quote:
        'An exceptional teammate. Excelled in front-end architecture with a strong UX and security focus. His expertise and collaborative spirit made a real difference.',
      avatar: '/assets/avatars/paulo.png',
      href: 'https://www.linkedin.com/in/pflima',
    },
    {
      name: 'Oleg Statnii',
      company: 'QA Engineer @ Ultra',
      quote:
        'Professional and proactive, with deep knowledge across many technologies. An explorer who proposes strong solutions, and a genuine team player. Highly recommend Luis!',
      avatar: '/assets/avatars/oleg.png',
      href: 'https://www.linkedin.com/in/luismendieta/details/recommendations/?detailScreenTabIndex=0',
    },
    {
      name: 'Nicolas Bouillet',
      company: 'Product Manager @ Ultra',
      quote:
        'An absolute team player on our Ultra squad: skilled, versatile, and strong on backend and frontend. He takes valuable initiatives. Lucky to have him on the team.',
      avatar: '/assets/avatars/nicolas.png',
      href: 'https://www.linkedin.com/in/luismendieta/details/recommendations/?detailScreenTabIndex=0',
    },
  ],
}

export const contact = {
  email: 'yo@luism.dev',
  subject: '[luism.dev] Hello',
  title: 'Let’s talk about senior GenAI full-stack roles.',
  location: `${profile.location}.`,
  resume: 'Want my resume? Ask in your email and I’ll send it over.',
  links: [
    { name: 'GitHub', href: 'https://github.com/luisintosh' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/luismendieta' },
  ],
}

export const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(contact.subject)}`
