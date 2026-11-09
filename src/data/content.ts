export const profile = {
  name: 'Luis Mendieta',
  role: 'Senior Full-Stack AI Engineer',
  headline: 'Full-stack AI engineer.\nI ship what works.',
  subhead:
    'I build AI into real products, and plain software when that’s the better fix. I start with the people who have the problem, prototype fast, and ship to production.',
  location: 'Remote from San Luis Potosí, Mexico (UTC−6)',
  experience: 'Building software since 2018',
  stack: 'TypeScript, React, Next.js, NestJS, LangGraph, RAG, Docker, Kubernetes',
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
    title: 'A two-person prototype that became an AI exam platform',
    summary: 'In production pilot with Biology, English, and Math specialists.',
    ownership: 'I co-built the first prototype, then owned features end to end on a team of three.',
    intro:
      'Content specialists at ACT needed help drafting exam items. A teammate and I worked out the idea with stakeholders and built a prototype: a workflow that chains a set of prompts to write a first draft of an item. It was approved, and we grew it into a platform that covers more of the specialists’ work, with passage generation, reviews through different lenses, and a RAG check that keeps new questions from duplicating old ones. I owned features end to end, from the LangGraph agents to the NestJS API, the Next.js app the specialists use, and the deployment to AWS. The platform is private, so this page covers its architecture.',
    decisions: [
      {
        title: 'Prove one workflow before building a platform',
        body: 'We started with a single job, drafting a first version of an item, and showed it to stakeholders. Passages, reviews, and duplicate checks came only after they approved it.',
      },
      {
        title: 'Specialized agents instead of one big prompt',
        body: 'Question generation, passage generation, and question review each have their own prompt and rules. Because each agent does one job, we could combine them for different subjects instead of rewriting one giant prompt each time.',
      },
      {
        title: 'Regenerate first, then ask a person',
        body: 'Every new question is compared against the question bank with a RAG similarity search. If it’s 80% similar or more to an existing one, the agent tries again. If the second try is still too close, a specialist decides.',
      },
      {
        title: 'Specialists make the final call',
        body: 'No item is accepted without specialist review. Every scheduled job is logged, so we can always say what produced an item and when.',
      },
    ],
    scope:
      'Drafting and review jobs that resume from checkpoints, job scheduling that avoids collisions, live progress over authenticated Socket.IO, RAG over textbook PDFs for passages, IMS QTI export so items load into other platforms, Jest and Playwright tests for concurrency edge cases, and Docker images deployed to a Kubernetes cluster on AWS through the company’s Jenkins pipelines.',
  },
  {
    slug: 'solodev',
    name: 'SoloDev',
    title: 'From one approved spec to a reviewed, tested pull request',
    summary: 'Open source. Works with Claude Code, Codex, and Cursor.',
    intro:
      'When executives at ACT asked our team to start using AI, nobody told us how to do it well. I brought in a customized version of the open source Superpowers skill set, and it worked until it started using up our monthly token budget too fast. So I researched on my own time and built SoloDev, a workflow that uses fewer tokens and still does the work well. I kept developing it at MaxiCare with one goal: automate the busywork, so my time goes to understanding the problem, proposing a solution, and understanding the code the agents write. I use it every day.',
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
      'Over five years I went from senior to principal engineer, owning the React architecture and the API contracts between frontend and backend. Thousands of people used it.',
    intro:
      'A Chrome extension wallet connected to an NFT marketplace. I owned the frontend architecture and led two frontend engineers through planning, code review, and delivery.',
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
        body: 'The marketplace and the wallet only talk through Chrome extension message events, and every message is encrypted.',
      },
    ],
    scope:
      'Beyond the wallet: an Electron game launcher that works offline and updates itself, NestJS and GraphQL services, Apache Kafka message flows, and CI/CD pipelines.',
  },
]

export const principles = [
  {
    title: 'Understand the problem first',
    body: 'Talk to the people doing the work before writing code.',
  },
  {
    title: 'Pick the simplest thing that works',
    body: 'Automation, RAG, an agent, or no AI at all.',
  },
  {
    title: 'Prototype before building it properly',
    body: 'Prove the idea with real users, then harden it.',
  },
  {
    title: 'Keep people in control',
    body: 'Checks, review, and audit logs around anything a model produces.',
  },
]

export const experience = [
  {
    role: 'Senior Full-Stack Engineer',
    company: 'MaxiCare (via Coforge)',
    dates: 'Sep 2026 - Now',
    summary:
      'Building AI workflows into an AI-native EMR for skilled nursing and assisted living, so nurses and doctors spend less time on the platform and more with residents.',
  },
  {
    role: 'Senior Full-Stack Software Engineer, AI Platform',
    company: 'ACT (via Coforge)',
    dates: 'Sep 2025 - Aug 2026',
    summary:
      'Co-built the first prototype with a teammate, then grew it into a GenAI assessment platform with LangGraph, NestJS, and Next.js, deployed to AWS. Now in production pilot with content specialists.',
  },
  {
    role: 'Senior to Principal Frontend Engineer',
    company: 'Ultra (via Coforge)',
    dates: 'Mar 2020 - Sep 2025',
    summary:
      'Grew from senior to principal. Led React architecture for a crypto wallet and NFT marketplace serving thousands of active users, and delivered backend services with NestJS, GraphQL, and Kafka.',
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
      href: 'https://www.linkedin.com/in/luismendieta/details/recommendations/?detailScreenTabIndex=0',
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
      href: 'https://www.linkedin.com/in/luismendieta/details/recommendations/?detailScreenTabIndex=0',
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
  title: 'Want to build something together?',
  location: `${profile.location}.`,
  links: [
    { name: 'GitHub', href: 'https://github.com/luisintosh' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/luismendieta' },
  ],
}

export const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(contact.subject)}`
