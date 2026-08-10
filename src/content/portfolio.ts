export interface HeroContent {
  name: string
  primaryRole: string
  secondaryRole: string
}

export interface AboutContent {
  body: string
  skillChips: string[]
}

export interface ExperienceEntry {
  title: string
  company: string
  dateRange: string
  description: string
}

export interface EducationEntry {
  credential: string
  issuer: string
  year: string
}

export interface TestimonialEntry {
  name: string
  role: string
  context?: string
  quote: string
}

export interface ContactContent {
  heading: string
  prompt: string
  email: string
  linkedIn: string
}

export interface PortfolioContent {
  hero: HeroContent
  about: AboutContent
  experience: ExperienceEntry[]
  education: EducationEntry[]
  testimonials: TestimonialEntry[]
  contact: ContactContent
}

const defaultPortfolio: PortfolioContent = {
  hero: {
    name: 'Luis Mendieta',
    primaryRole: 'Software Engineer',
    secondaryRole: 'Lead Full-Stack AI Engineer',
  },
  about: {
    body:
      'Full-stack engineer with 8+ years building user-facing products with React, Next.js, Node.js, and NestJS. I integrate AI into real products using LangGraph and LangChain. No vibe coding. Currently leading a GenAI initiative at ACT. Open to Senior/Lead Full-Stack · AI Engineering roles. Outside code: hiking, photos, coffee.',
    skillChips: [
      'React',
      'Next.js',
      'Node.js',
      'NestJS',
      'TypeScript',
      'LangGraph',
      'LangChain',
      'LLMs',
    ],
  },
  experience: [
    {
      title: 'Lead Full-Stack AI Engineer',
      company: 'ACT Company',
      dateRange: '2025—Now',
      description:
        'GenAI content platform built with Node.js/LangGraph and Next.js/React. Deterministic stateful systems at scale; technical bridge between Product & UX; mentor senior engineers and QA in an AI-first org.',
    },
    {
      title: 'Lead Frontend Engineer',
      company: 'Ultra Company',
      dateRange: '2020—2025',
      description:
        'Senior→Lead over 5+ years across crypto/NFTs/ecommerce/gaming. Lead Electron; Senior Angular; cross-stack Node.js/NestJS/Kafka.',
    },
  ],
  education: [
    {
      credential: 'GenAI Agentic Track',
      issuer: 'DeepLearning.AI / Coursera',
      year: '2025',
    },
    {
      credential: 'GenAI Technical Track',
      issuer: 'DeepLearning.AI / Coursera',
      year: '2025',
    },
    {
      credential: 'Professional Cloud Developer',
      issuer: 'Google Cloud',
      year: '2024',
    },
    {
      credential: 'AWS Certified Developer — Associate',
      issuer: 'AWS',
      year: '2022',
    },
    {
      credential: 'Computer Systems Engineer, Computer Science',
      issuer: 'TecNM',
      year: '2017',
    },
  ],
  testimonials: [
    {
      name: 'Lance Blackstone',
      role: 'Assessment Industry Consultant, Business Advisor, Change Agent, Agile Coach',
      context: 'Managed Luis directly (Nov 2025); ACT AI-powered prototype',
      quote:
        'I had the pleasure of working with Luis very briefly on a project for ACT. I was acting as product-manager/owner for an AI-powered prototype and Luis was one of two developers contributing to the project. I found Luis very easy to work with. He was technically knowledgeable and skilled. More importantly to me, he was highly collaborative and responsive. He listened well, found good solutions, and met commitments. I would work with Luis again in a heartbeat and hope I get the opportunity in the future.',
    },
    {
      name: 'Paulo Lima',
      role: 'Operational Intelligence & Applied AI | Founder @ Struon · ANP Labs | FDE @ Harmony',
      context: 'Same team (Sep 2025)',
      quote:
        'I had the pleasure of working with Luis, and he was an exceptional teammate. He excelled in front-end architecture and consistently demonstrated a strong commitment to user experience and security. Luis was always willing to jump in and support the team, driving architectural decisions with a thoughtful and user-first approach. His technical expertise and collaborative spirit made a real difference — an absolute pleasure to work alongside him.',
    },
    {
      name: 'Oleg Statnii',
      role: 'Senior QA Engineer, QA Lead @ Ultra.io',
      context: 'Same team (Sep 2025)',
      quote:
        'I had a real pleasure working together with Luis in the same team. He is very professional and proactive, with deep knowledge across many technologies — often outside his primary domain. Luis is an explorer, always proposing strong, current solutions to improve the product. He is also a team player: easy to communicate with, and a very good person. I highly recommend Luis!',
    },
    {
      name: 'Axel Ayigbede',
      role: 'Engineering Manager',
      context: 'Managed Luis directly at Ultra (Jan 2025)',
      quote:
        'I had the pleasure of working with Luis Mendieta at Ultra while I was the Lead Frontend Developer there. Luis was an essential part of our team — always ready to help and full of ideas, making him the perfect backup for me. He is enthusiastic about his work and loves exploring areas including backend and blockchain to help the team and broaden his skills. He keeps up with technical trends and brings fresh perspectives; he would occasionally share interesting pet projects that showed his passion for development. What really makes Luis stand out is how easy it is to get along with him — great at building relationships and casual conversation, which made remote work more enjoyable. He makes informed decisions by understanding and challenging the full picture, which benefits the product and the company. Luis is more than a skilled developer: a passionate, motivated team player whose wide interests and friendly nature strengthen any team. I highly recommend him to any company looking for a creative, proactive person.',
    },
    {
      name: 'Nicolas Bouillet',
      role: 'Product Manager',
      context: 'Same Ultra squad 1+ year (May 2021); gaming platform on custom EOSIO-based blockchain',
      quote:
        "I'm currently working with Luis at Ultra in the same squad for more than one year. We are developing a groundbreaking gaming-industry platform heavily relying on a custom blockchain based on EOSIO. This competitive, complex, innovative context is demanding — you need amazing people to deliver, and Luis is one of them. He is an absolute team player: not only friendly, but someone who brings trust and collaboration that make the team better. He is skilled and versatile — a fast learner who contributes high-quality code on both backend and frontend. He also has affinities with product, business, and UX; he understands what is at stake and is not afraid to take valuable initiatives, which makes collaboration very effective. I'm very lucky to have Luis on my team.",
    },
  ],
  contact: {
    heading: 'say hi',
    prompt: "Drop a note — let's build something fun.",
    email: 'hello@luisexpert.dev',
    linkedIn: 'https://www.linkedin.com/in/luismendieta/',
  },
}

export function createPortfolio(overrides: Partial<PortfolioContent> = {}): PortfolioContent {
  return {
    ...defaultPortfolio,
    ...overrides,
    hero: { ...defaultPortfolio.hero, ...overrides.hero },
    about: { ...defaultPortfolio.about, ...overrides.about },
    contact: { ...defaultPortfolio.contact, ...overrides.contact },
    experience: overrides.experience ?? defaultPortfolio.experience,
    education: overrides.education ?? defaultPortfolio.education,
    testimonials: overrides.testimonials ?? defaultPortfolio.testimonials,
  }
}

export const portfolio = createPortfolio()
