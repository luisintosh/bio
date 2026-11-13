export const profile = {
  name: 'Luis Mendieta',
  role: 'Senior Full-Stack AI Engineer',
  headline: 'Full-stack AI engineer.\nI ship what works.',
  subhead:
    'I build AI into real products, and plain software when that’s the better fix. I start with the people who have the problem, prototype fast, and ship to production.',
  location: 'Remote from San Luis Potosí, Mexico (UTC−6)',
  /** San Luis Potosí, shown in the hero's footer. */
  coordinates: '22.15°N 100.98°W · UTC−6',
  experience: 'Building software since 2018',
  stack: 'TypeScript, React, Next.js, NestJS, LangGraph, RAG, Docker, Kubernetes',
  cloudCertifications: [
    'AWS Certified Developer Associate',
    'Google Cloud Professional Cloud Developer',
  ],
  image: '/assets/links/profile',
}

export const navLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  // Every page has a contact section, so this one stays on the current page.
  { label: 'Email', href: '#contact' },
]

export type CaseStudySlug = 'act' | 'solodev' | 'ultra'

type Decision = {
  title: string
  /** Why: the reason behind the call, in a sentence or two. */
  body: string
}

/** One step of the story arc: where it stood, what changed, how it ended. */
type Beat = {
  /** The marker on the arc's rail, one or two words. */
  tick: string
  title: string
  body: string
}

type Layer = {
  name: string
  items: string[]
}

export type CaseStudy = {
  slug: CaseStudySlug
  name: string
  /** The company's own site, linked from the case page. */
  site?: { label: string; href: string }
  title: string
  /** The homepage row's one-liner. */
  summary: string
  /** Shown on the homepage row when the summary doesn't say what Luis did. */
  ownership?: string
  /** The case page's standfirst under the title. */
  dek: string
  facts: { label: string; value: string }[]
  beats: [Beat, Beat, Beat]
  /** The diagram's heading and the one line that explains how to read it. */
  flow: { title: string; caption: string }
  decisions: Decision[]
  layers: { title: string; items: Layer[] }
  /** Name of a recommendation in `testimonials` to quote on the page. */
  quote?: string
  link?: { label: string; href: string }
}

/*
 * Lines marked DRAFT are plausible story details written for Luis to confirm, change, or
 * cut. Everything else comes from earlier site copy, the SoloDev README, or act.org.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'act',
    name: 'ACT',
    site: { label: 'act.org', href: 'https://www.act.org/' },
    title: 'The AI drafts the exam question. A specialist decides.',
    summary: 'In production, and rolling out to every subject area it can cover to speed up content creation.',
    ownership: 'I co-built the first prototype, then owned features end to end.',
    dek: 'A prototype that grew into a multi-agent LangGraph platform at ACT, now in production and rolling out across subject areas to speed up content creation.',
    facts: [
      { label: 'Role', value: 'Senior full-stack engineer' },
      { label: 'When', value: 'Sep 2025 – Aug 2026' },
      { label: 'Core stack', value: 'LangGraph, NestJS, Next.js, AWS' },
      { label: 'Status', value: 'In production' },
    ],
    beats: [
      {
        tick: 'Problem',
        // DRAFT: "hours per item" is an estimate.
        title: 'Every new item cost a specialist hours',
        body: 'ACT writes exams that 2M+ students take each year. Each question was drafted, checked against the question bank, and reviewed by hand.',
      },
      {
        tick: 'Prototype',
        title: 'Prove one workflow first',
        body: 'We mapped the work with specialists and stakeholders, then built one thing: a prompt chain that drafts a first version of an item. It was approved.',
      },
      {
        tick: 'Production',
        title: 'Grow it into a platform',
        body: 'Subject agents, passage generation, five parallel reviewers, and a duplicate check, deployed to AWS. I owned features from the agents to the UI.',
      },
    ],
    flow: {
      title: 'How one question gets made',
      caption: 'Solid blocks are where a person decides. Dashed lines send work back.',
    },
    decisions: [
      {
        title: 'Small agents, not one mega-prompt',
        body: 'Question writing, passage writing, and review each have their own prompt and rules. A new subject is a new combination, not a rewrite.',
      },
      {
        title: 'A cheap retry before a human',
        body: 'An item 80% similar or more to one in the bank is regenerated once. Only a second miss takes a specialist’s time.',
      },
      {
        title: 'Resume from checkpoints, never from zero',
        // DRAFT: the "crash or deploy" framing and the token angle.
        body: 'Long jobs resume from their last LangGraph checkpoint after a crash or a deploy, so tokens already spent aren’t spent twice.',
      },
    ],
    layers: {
      title: 'Built end to end',
      items: [
        { name: 'Product', items: ['Next.js app for specialists', 'Live progress over authenticated Socket.IO'] },
        { name: 'API', items: ['NestJS', 'Collision-free job scheduling', 'Audit log of every job'] },
        { name: 'Agents', items: ['LangGraph flows', 'Durable checkpoints', 'Subject specialists'] },
        { name: 'Data', items: ['RAG over the question bank', 'RAG over textbook PDFs', 'IMS QTI export'] },
        { name: 'Delivery', items: ['Docker', 'Kubernetes on AWS', 'Jenkins CI/CD', 'Jest and Playwright concurrency tests'] },
      ],
    },
    quote: 'Lance Blackstone',
  },
  {
    slug: 'solodev',
    name: 'SoloDev',
    title: 'One engineer leading a team of AI agents',
    summary: 'Open source. Works with Claude Code, Codex, and Cursor.',
    dek: 'SoloDev is an open-source workflow that turns one approved spec into a reviewed, tested pull request, on Claude Code, Codex, or Cursor.',
    facts: [
      { label: 'Role', value: 'Creator and maintainer' },
      { label: 'License', value: 'Open source, Apache 2.0' },
      { label: 'Runs on', value: 'Claude Code, Codex, Cursor' },
      { label: 'Prompt evals', value: '77/77 scenarios, 40/40 routing' },
      { label: 'In use', value: 'Daily, at MaxiCare' },
    ],
    beats: [
      {
        tick: 'Problem',
        // DRAFT: "in about two weeks".
        title: '“Use AI,” with no playbook',
        body: 'ACT asked our team to adopt AI. I rolled out a customized Superpowers skill set. It worked, and it burned the monthly token budget in about two weeks.',
      },
      {
        tick: 'Rebuild',
        title: 'Spend tokens only on judgment',
        body: 'On my own time I rebuilt it lean: a strong model plans and reviews, a cheaper one writes code, and any rule a script can check costs zero tokens.',
      },
      {
        tick: 'Today',
        title: 'One command, one ready PR',
        body: '/solo-task takes a feature from spec to a reviewed, tested pull request. I use it every day at MaxiCare, so my time goes to the problem, not the busywork.',
      },
    ],
    flow: {
      title: 'Who does what, and what it costs',
      caption: 'Each lane is a cost tier, and the CLI’s checks spend no tokens. Every step has a budget: 2 attempts, 1 fix round, 1 re-review.',
    },
    decisions: [
      {
        title: 'The strong model thinks, the cheap model types',
        // DRAFT: "most of the savings".
        body: 'Planning and review need judgment. Writing code to an approved spec mostly doesn’t. That split is where most of the savings come from.',
      },
      {
        title: 'If code can check a rule, code checks it',
        body: '“No code before approval” is a git check in the solodev CLI, with unit tests, not a line in a prompt that a model can skip.',
      },
      {
        title: 'The reviewer never wrote the code',
        body: 'A fresh-context reviewer runs each test on the old code, where it must fail, then on the new code, where it must pass.',
      },
    ],
    layers: {
      title: 'How it’s built',
      items: [
        { name: 'Source', items: ['One catalog and prompt set', 'Models pinned in one place'] },
        { name: 'Build', items: ['7 skills', 'solodev CLI', 'Native agents for each tool'] },
        { name: 'Gates', items: ['Checks over git, not prompts', 'Unit tested'] },
        { name: 'Evals', items: ['77 decision scenarios', '40 routing queries', 'Headless runs graded on git'] },
        { name: 'CI', items: ['A line budget for every skill'] },
      ],
    },
    link: {
      label: 'View SoloDev on GitHub',
      href: 'https://github.com/luisintosh/solodev',
    },
  },
  {
    slug: 'ultra',
    name: 'Ultra',
    site: { label: 'ultra.io', href: 'https://ultra.io/' },
    title: 'A crypto wallet that unlocks like a normal sign-in',
    summary:
      'Over five years I went from senior to principal engineer, owning the Angular architecture and the API contracts between frontend and backend. Thousands of people used it.',
    dek: 'Five years, senior to principal: I led the frontend architecture for Ultra’s browser-extension wallet and NFT marketplace, used by thousands of players.',
    facts: [
      { label: 'Role', value: 'Senior to principal engineer' },
      { label: 'Team', value: 'Led 2 frontend engineers' },
      { label: 'When', value: 'Mar 2020 – Sep 2025' },
      { label: 'Core stack', value: 'Angular, Chrome extension, Electron, NestJS' },
      { label: 'Users', value: 'Thousands of active players' },
    ],
    beats: [
      {
        tick: 'Problem',
        // DRAFT: the checkout drop-off framing.
        title: 'Seed phrases lose buyers',
        body: 'Players came to buy game items, not to learn crypto. Seed phrases, extension pop-ups, and unclear signing prompts lost them at checkout.',
      },
      {
        tick: 'Approach',
        title: 'Make the wallet feel like an account',
        body: 'Sign in once and the wallet unlocks. Keys never live in the frontend, and the marketplace can only ask the wallet for a few safe things.',
      },
      {
        tick: 'Result',
        title: 'A wallet thousands of players used',
        body: 'A wallet built as a self-contained module: it shipped as a Chrome extension, then moved into Ultra’s desktop game launcher with little rework. I led two frontend engineers.',
      },
    ],
    flow: {
      title: 'One purchase, end to end',
      caption: 'Marketplace and wallet only talk across the dashed line, and every message is encrypted. The solid block is where the player decides.',
    },
    decisions: [
      {
        title: 'Sign-in is the unlock',
        body: 'People already trust their account. Decryption keys are never stored in the frontend, so there is no key at rest in the browser to steal.',
      },
      {
        title: 'A Proxy, not an open API',
        body: 'A JavaScript Proxy exposes only the commands the marketplace needs. Everything else doesn’t exist from the page’s side.',
      },
      {
        title: 'One wallet module, two hosts',
        body: 'The wallet kept no ties to the browser it first shipped in, so the same module dropped into the Electron game launcher instead of being rebuilt for desktop.',
      },
      {
        title: 'Encrypt even our own messages',
        body: 'The marketplace and the wallet talk only through Chrome extension message events, and every one is encrypted, because the page is untrusted ground.',
      },
    ],
    layers: {
      title: 'Beyond the wallet',
      items: [
        { name: 'Wallet', items: ['Angular', 'Self-contained module', 'Chrome extension', 'Proxy command API', 'Encrypted messaging'] },
        { name: 'Marketplace', items: ['Angular architecture', 'API contracts with backend'] },
        { name: 'Services', items: ['NestJS', 'GraphQL', 'Apache Kafka'] },
        { name: 'Desktop', items: ['Electron game launcher', 'Same wallet module', 'Works offline', 'Updates itself'] },
        { name: 'Delivery', items: ['CI/CD pipelines'] },
      ],
    },
    quote: 'Paulo Ferreira',
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
      'Co-built the first prototype, then grew it into a GenAI assessment platform with LangGraph, NestJS, and Next.js, deployed to AWS. Now in production and rolling out across subject areas.',
  },
  {
    role: 'Senior to Principal Frontend Engineer',
    company: 'Ultra (via Coforge)',
    dates: 'Mar 2020 - Sep 2025',
    summary:
      'Grew from senior to principal. Led Angular architecture for a crypto wallet and NFT marketplace serving thousands of active users, and delivered backend services with NestJS, GraphQL, and Kafka.',
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
