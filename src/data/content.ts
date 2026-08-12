export const profile = {
  label: 'Name:',
  firstName: 'Luis',
  lastName: 'Mendieta',
  role: 'Full-Stack Engineer',
  bio: 'Full-stack engineer working in TypeScript end to end: Next.js and React on the front, Node.js and NestJS on the back. I take features from specification to production and work with the people who have the problem, not at the far end of a handoff. I use AI tooling to move faster and review everything it writes before it ships. Wherever I land, I ramp fast, share the knowledge with people around me, and surface risks while they’re still cheap to fix.',
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
      'Own a GenAI content platform end to end in TypeScript: LangGraph agent services behind Next.js / React apps. Turn requirements into shipped features with Product and UX, keep humans reviewing what the models produce, and mentor engineers on AI-assisted workflows.',
  },
  {
    role: 'Lead Frontend Engineer',
    company: 'Ultra',
    dates: '2020 - 2025',
    summary:
      'Promoted from Senior to Lead over five years. Owned frontend architecture for a crypto wallet, NFT marketplace, and Electron game launcher, and shipped NestJS / Kafka services when the backend needed hands. Set standards, reviewed code, and kept releases on schedule.',
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
    'Hiring for a Senior or Lead Full-Stack role? Tell me about the team and the problem you’re solving, and I’ll come back with how I’d approach it.',
}

