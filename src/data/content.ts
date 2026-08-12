export const profile = {
  label: 'Name:',
  firstName: 'Luis',
  lastName: 'Mendieta',
  role: 'Full-Stack Engineer',
  bio: 'I like building things people can trust. These days that means AI workflows with LangGraph and LangChain, plus skills for coding tools where a human stays in the loop before anything ships. I also enjoy teaching what I learn and helping teammates level up. On the product side I still ship with React, Next.js, Node, and NestJS, and I settle into a team quickly.',
  image: '/assets/links/profile',
}

export const socials = [
  {
    name: 'X',
    href: 'https://x.com/luisintosh',
    icon: 'x',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/luismendieta',
    icon: 'linkedin',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/luisintosh',
    icon: 'github',
  },
  {
    name: 'Dev.to',
    href: 'https://dev.to/luisintosh',
    icon: 'devto',
  },
] as const

type LinkItem = {
  title: string
  description: string
  href: string
  image: string
  imageBg: string
}

export const links: LinkItem[] = [
  // {
  //   title: 'Now: ACT',
  //   description:
  //     'Lead Full-Stack AI Engineer. Building the GenAI content platform end to end: LangGraph backends, Next.js / React apps, production workflows.',
  //   href: 'https://www.luism.dev/',
  //   image: '/assets/links/portfolio',
  //   imageBg: '#d4a017',
  // },
  // {
  //   title: 'Before: Ultra',
  //   description:
  //     'Grew from Senior to Lead Frontend over 5 years. Crypto wallets, NFT marketplace, Electron launcher, plus NestJS / Kafka services.',
  //   href: 'https://www.luism.dev/',
  //   image: '/assets/links/art-prints',
  //   imageBg: '#bedfe8',
  // },
  // {
  //   title: 'Certifications',
  //   description:
  //     'GCP Professional Cloud Developer, AWS Developer Associate, GenAI tracks (IBM & DeepLearning.AI), CS degree from TecNM.',
  //   href: 'https://www.linkedin.com/in/luismendieta/',
  //   image: '/assets/links/portraits',
  //   imageBg: '#d4c8e0',
  // },
]

export const experience = [
  {
    role: 'Lead Full-Stack AI Engineer',
    company: 'ACT',
    dates: '2025 - Now',
    summary:
      'Own the GenAI content platform across the stack: LangGraph agent backends and Next.js / React frontends. Ship reliable AI workflows, partner with Product and UX, and mentor engineers in an AI-first team.',
  },
  {
    role: 'Lead Frontend Engineer',
    company: 'Ultra',
    dates: '2020 - 2025',
    summary:
      'Promoted from Senior to Lead. Ran frontend architecture for a crypto wallet, NFT marketplace, and Electron game launcher. Also shipped NestJS / Kafka services when the team needed it.',
  },
]

export const education = [
  {
    title: 'GenAI Training Path: Agentic Track',
    school: 'IBM · Coursera',
    year: '2025',
  },
  {
    title: 'GenAI Training Path: Technical Track',
    school: 'DeepLearning.AI · Coursera',
    year: '2025',
  },
  {
    title: 'Professional Cloud Developer',
    school: 'Google Cloud',
    year: '2024',
  },
  {
    title: 'AWS Certified Developer Associate',
    school: 'Amazon Web Services',
    year: '2022',
  },
  {
    title: 'Computer Systems Engineer',
    school: 'Tecnológico Nacional de México (TecNM)',
    year: '2017',
  },
]

export const portfolioItems = [
  {
    title: 'Ultra Crypto Wallet - Chrome Extension',
    image: '/assets/portfolio/ultra-crypto-wallet',
  },
  {
    title: 'Ultra Game Store - Frontend',
    image: '/assets/portfolio/ultra-game-store',
  },
  {
    title: 'Nebula Design System - Frontend',
    image: '/assets/portfolio/nebula-design-system',
  },
]

export const testimonials = {
  eyebrow: 'Recommendations:',
  title: 'From people I’ve worked with',
  intro:
    'Managers and teammates on LinkedIn. Short takes below; full write-ups are on my profile.',
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
      name: 'Axel Ayigbede',
      company: 'Engineering Manager @ Ultra',
      quote:
        'Essential to our Ultra team: always ready to help, full of ideas, and great at building relationships. A passionate, motivated teammate I highly recommend.',
      avatar: '/assets/avatars/axel.png',
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
  eyebrow: 'Contact:',
  title: "Let's talk",
  intro:
    'Hiring for Senior / Lead Full-Stack or AI Engineering? I’d love to hear about the role. Drop a short note below and let’s connect.',
}

