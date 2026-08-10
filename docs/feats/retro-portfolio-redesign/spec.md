# Retro portfolio redesign

## Problem

The live personal site at [https://www.luisexpert.dev/](https://www.luisexpert.dev/) presents Luis Mendieta’s software-engineering identity, but its visual system (playful pastel “Mario Wonder-ish” scroll experience) no longer matches the brand he wants: a techie, retro-futurist, dark, vibrant personal surface. The current origin stack is plain HTML/CSS/JS bundled with Vite; the desired product is a React + Vite static site that keeps the same professional information, adopts a Link Board–inspired personal-brand layout adapted for an engineer portfolio (including testimonials social proof), ships solid SEO, and continues to deploy as static files to GitHub Pages—replacing the current stack on `origin/main`.

## Motivation

Visitors (recruiters, peers, collaborators) should meet a cohesive dark retro-futurist brand that still communicates who Luis is, what he has built, how he learned, social proof from collaborators, and how to reach him—without hunting through a themed scroll toy or losing crawlable SEO essentials. Replacing the stack with React + Vite is an explicit product constraint so the site can be maintained as a modern static SPA (or SSG-equivalent static build) on GitHub Pages.

## User stories

1. As an IT recruiter or peer on a first visit (desktop or mobile), I want a name-first brand hierarchy with a strong senior/AI full-stack role signal in the first viewport so the site feels recruiter-compelling—“sexy” for hiring—not a playful old greeting page.
2. As a recruiter or peer, I want to read About, Experience, and Education content equivalent in meaning to today’s site so I can evaluate fit without losing facts.
3. As a recruiter or peer, I want a Testimonials section with collaborator social proof (name, role, quote) so I can gauge how others experience working with Luis.
4. As a visitor who wants to connect, I want a Contact surface (prompt, Name + Message form, Send, and LinkedIn) that acknowledges locally and hands off via `mailto:hello@luisexpert.dev` so I can reach out or jump to LinkedIn.
5. As a visitor sharing or previewing the URL in social/chat apps, I want correct title, description, Open Graph, Twitter card, and canonical metadata—with a dark retro-futurist preview image—so previews look intentional.
6. As a site owner, I want a static production build deployable to GitHub Pages that replaces the current plain HTML/CSS/JS stack so deploys stay simple and the old theme/stack are gone.
7. As a visitor on a phone, I want the redesigned page to remain readable and usable so the brand works beyond desktop.

## Functional requirements

### Content (preserve meaning; minor copy polish OK)

- **FR1 — Identity & hero.** The page presents **Luis Mendieta** as a hero-level brand signal with a strong recruiter-facing role framing (**Software Engineer** / **Lead Full-Stack AI Engineer** or equivalent senior/AI full-stack positioning) visible in the **first viewport**. Hero copy must read as confident and compelling for IT recruiters—not the playful legacy greeting **“hello, i'm Luis Mendieta”**. Name-first brand hierarchy is required; exact legacy string is not.
- **FR2 — About.** An About section conveys: full-stack engineer, **8+ years**; **React, Next.js, Node & NestJS**; building AI into user-facing products (**LangGraph**, **LangChain**); **“No vibe coding.”**; GenAI initiative at **ACT**; open to **Senior/Lead Full-Stack · AI Engineering**; outside code: hiking, photos, coffee; skill chips: **React, Next.js, Node.js, NestJS, TypeScript, LangGraph, LangChain, LLMs**.
- **FR3 — Experience.** An Experience section includes at least these two roles with equivalent meaning and date ranges:
  1. **Lead Full-Stack AI Engineer, 2025—Now** — GenAI content platform (Node.js/LangGraph, Next.js/React), deterministic stateful systems at scale, technical bridge Product & UX, mentor senior engineers/QA in an AI-first org (org context as on the live site today).
  2. **Lead Frontend Engineer, 2020—2025** — Senior→Lead 5+ years across crypto/NFTs/ecommerce/gaming; Lead Electron; Senior Angular; cross-stack Node.js/NestJS/Kafka (org context as on the live site today).
- **FR4 — Education.** An Education section lists, with years and issuing orgs equivalent to today: GenAI Agentic Track **2025**; GenAI Technical Track **2025**; Professional Cloud Developer **2024**; AWS Certified Developer — Associate **2022**; Computer Systems Engineer, Computer Science **2017**.
- **FR5 — Contact.** A Contact section includes: heading/prompt equivalent to **“say hi”** and **“Drop a note — let's build something fun.”**; a form with **Name**, **Message**, and **Send**; and a LinkedIn control pointing to `https://www.linkedin.com/in/luismendieta/` that opens in a new browsing context with `rel` behavior safe for external links (`noopener`/`noreferrer` or equivalent). Successful send hands off via **`mailto:hello@luisexpert.dev`** with subject and body derived from the submitted Name and Message (see FR6).
- **FR6 — Contact form behavior.** Submitting with both Name and Message non-empty: (1) shows a clear local success acknowledgment visible to the visitor, and (2) initiates a `mailto:` handoff to **`hello@luisexpert.dev`** whose subject and body are derived from the submitted Name and Message. Submitting with Name or Message empty does not show success and does not initiate mailto; the visitor is informed that required fields are missing (native validation or equivalent visible message). Double/rapid submit must not show a confusing partial state (e.g. duplicate stacked success messages that stay indefinitely) and must not spam multiple mailto launches as the settled outcome.
- **FR15 — Testimonials.** A Testimonials section (Link Board–style social proof) presents **all five** of the following entries. Each entry shows **name**, **role/title line**, and **quote**; context/date is optional but preferred when it fits the layout. Canonical copy (meaning preserved):

  1. **Lance Blackstone** — Assessment Industry Consultant, Business Advisor, Change Agent, Agile Coach. Context preferred: Managed Luis directly (Nov 2025); ACT AI-powered prototype. Quote: *I had the pleasure of working with Luis very briefly on a project for ACT. I was acting as product manager/owner for an AI-powered prototype and Luis was one of two developers contributing to the project. I found Luis very easy to work with. He was technically knowledgeable and skilled. More importantly to me, he was highly collaborative and responsive. He listened well, found good solutions, and met commitments. I would work with Luis again in a heartbeat and hope I get the opportunity in the future.*
  2. **Paulo Lima** — Operational Intelligence & Applied AI | Founder @ Struon · ANP Labs | FDE @ Harmony. Context preferred: Same team (Sep 2025). Quote: *I had the pleasure of working with Luis, and he was an exceptional teammate. He excelled in front-end architecture and consistently demonstrated a strong commitment to user experience and security. Luis was always willing to jump in and support the team, driving architectural decisions with a thoughtful and user-first approach. His technical expertise and collaborative spirit made a real difference — an absolute pleasure to work alongside him.*
  3. **Oleg Statnii** — Senior QA Engineer, QA Lead @ Ultra.io. Context preferred: Same team (Sep 2025). Quote: *I had a real pleasure working together with Luis in the same team. He is very professional and proactive, with deep knowledge across many technologies — often outside his primary domain. Luis is an explorer, always proposing strong, current solutions to improve the product. He is also a team player: easy to communicate with, and a very good person. I highly recommend Luis!*
  4. **Axel Ayigbede** — Engineering Manager. Context preferred: Managed Luis directly at Ultra while Luis was Lead Frontend Developer (Jan 2025). Quote: *I had the pleasure of working with Luis Mendieta at Ultra while I was the Lead Frontend Developer there. Luis was an essential part of our team — always ready to help and full of ideas, making him the perfect backup for me. He is enthusiastic about his work and loves exploring areas including backend and blockchain to help the team and broaden his skills. He keeps up with technical trends and brings fresh perspectives; he would occasionally share interesting pet projects that showed his passion for development. What really makes Luis stand out is how easy it is to get along with him — great at building relationships and casual conversation, which made remote work more enjoyable. He makes informed decisions by understanding and challenging the full picture, which benefits the product and the company. Luis is more than a skilled developer: a passionate, motivated team player whose wide interests and friendly nature strengthen any team. I highly recommend him to any company looking for a creative, proactive person.*
  5. **Nicolas Bouillet** — Product Manager. Context preferred: Same Ultra squad 1+ year (May 2021); gaming platform on custom EOSIO-based blockchain. Quote: *I'm currently working with Luis at Ultra in the same squad for more than one year. We are developing a groundbreaking gaming-industry platform heavily relying on a custom blockchain based on EOSIO. This competitive, complex, innovative context is demanding — you need amazing people to deliver, and Luis is one of them. He is an absolute team player: not only friendly, but someone who brings trust and collaboration that make the team better. He is skilled and versatile — a fast learner who contributes high-quality code on both backend and frontend. He also has affinities with product, business, and UX; he understands what is at stake and is not afraid to take valuable initiatives, which makes collaboration very effective. I'm very lucky to have Luis on my team.*

### Design & information architecture

- **FR7 — Link Board–inspired structure.** Layout/structure is inspired by [Link Board](https://linkboard.framer.website/) (personal brand profile/header, stacked section or link-style blocks, socials, cohesive single-page brand surface), adapted for a **software engineer portfolio** (About / Experience / Education / Testimonials / Contact as first-class sections—not a generic link-in-bio-only page).
- **FR8 — Aesthetic direction.** The visible theme is **techie, retro-futurism, dark mode, vibrant color palettes**—not the current pastel Mario Wonder light theme. Dark is the default (and only required) presentation for this feature.
- **FR9 — Responsive.** The same content and primary actions (read sections, use form, open LinkedIn) work on desktop (≥1280px wide) and mobile (≤390px wide) without horizontal clipping of primary text or unreachable primary controls.

### SEO

- **FR10 — Document SEO.** The shipped document provides:
  - `<title>` equivalent to **`Luis Mendieta — Software Engineer`**
  - meta description equivalent to **`Lead Full-Stack AI Engineer | React, Node.js, NestJS.`**
  - Open Graph: `og:title`, `og:description`, `og:type=website`, `og:url`, `og:image`
  - Twitter: `twitter:card` (summary large image), `twitter:title`, `twitter:description`, `twitter:image`, `twitter:creator=@luisintosh`
  - canonical URL locked to **`https://www.luisexpert.dev/`**
  - `og:url` locked to **`https://www.luisexpert.dev/`**
  - social image URLs locked to **`https://www.luisexpert.dev/preview-image.jpg`**
  - the asset at `/preview-image.jpg` is a **redesigned** Open Graph image matching the dark retro-futurist brand (legacy preview art is not acceptable)
- **FR11 — Crawlable essentials.** Primary identity and section copy (name, role, About/Experience/Education/Testimonials headings and body meaning) are present in the initial HTML response or otherwise available to non-JS crawlers without requiring interaction (e.g. no “scroll toy” gate). Meta tags in FR10 are present in the document head without requiring client-only injection that crawlers commonly miss.

### Delivery & stack replacement

- **FR12 — Static GitHub Pages delivery.** The feature produces a **static file** build artifact suitable for **GitHub Pages** deployment (no server runtime required to serve the site). Correct serving on the default `*.github.io` hostname is **not** required; production SEO absolute URLs remain locked to `https://www.luisexpert.dev/` per FR10.
- **FR13 — React + Vite.** The application is authored as a **React** app built with **Vite**, replacing the current plain HTML/CSS/JS Vite site on the repository’s mainline.
- **FR14 — Stack replacement completeness.** After ship, the production visitor experience no longer depends on the old scroll-driven Mario/lagoon theme or the **Tweaks** toolbar (sky palette, fall speed, etc.). Those toys are out of content scope and must not remain as the primary UX.

## Non-functional requirements

- **NFR1 — Viewport coverage.** Primary content readable and primary actions usable at **390×844** (mobile) and **1280×800** (desktop) without requiring landscape-only layout.
- **NFR2 — Contrast.** Body text and interactive labels on the dark background meet a practical readability bar: contrast ratio **≥ 4.5:1** for normal text and **≥ 3:1** for large text (≥18px regular or ≥14px bold), measured against the immediate background behind that text.
- **NFR3 — Motion.** Any decorative motion must not be required to read content or complete Contact/LinkedIn. If the user prefers reduced motion (`prefers-reduced-motion: reduce`), non-essential motion does not block or obscure content.
- **NFR4 — External link safety.** LinkedIn (and any other outbound social/profile links) use `target="_blank"` with `rel` including `noopener` (and `noreferrer` when matching today’s practice).
- **NFR5 — Build artifact.** A production build completes to a static `dist` (or equivalent) directory of HTML/CSS/JS/assets that GitHub Pages can publish; visiting the published root URL loads the portfolio without a backend API dependency for page render.
- **NFR6 — SEO string stability.** Title and description strings match FR10 within minor punctuation/entity differences (`—` vs `-`, HTML entities) that do not change meaning for humans or link previews.

## Out of scope

- Recreating the live site’s **Tweaks** toolbar or scroll-driven Mario/lagoon scene as a product feature.
- Link Board extras beyond the adapted portfolio sections already in scope: **services menus/lists** and arbitrary outbound “link-card” rows to unrelated demos/portfolios (Testimonials are in scope per FR15).
- Multi-page Framer template marketing chrome (“Start with Framer”, template author credits as site content).
- CMS, blog, auth, analytics product work, or a real email/backend submission endpoint (Contact uses client acknowledgment + `mailto:hello@luisexpert.dev` per FR6).
- Changing DNS/registrar settings outside the repo (custom domain wiring is environmental; the site must still be correct for the canonical URL in FR10).
- Making the same build SEO-correct on the default `*.github.io` hostname (not required).
- Light-mode theme or user-facing theme switcher.
- Localizing into languages other than English.

## Assumptions

1. **Single-page portfolio** — default: one cohesive page with profile/header + About / Experience / Education / Testimonials / Contact (and socials), adapting Link Board structure—not a multi-route mini-site. If wrong: routing, SEO per-route, and navigation scope expand.
2. **Org names preserved** — default: keep live org labels (e.g. ACT Company, Ultra Company, IBM/Coursera, DeepLearning.AI/Coursera, Google Cloud, AWS, TecNM) alongside role/title/year meaning. If wrong: copy must be rewritten and contracts’ example strings updated.
3. **Contact fields = Name + Message** — default: no email field (matches live markup and the request inventory). If wrong: validation and SEO-adjacent privacy copy change; scenarios for email required/invalid apply.
4. **Dark-only presentation** — default: no light theme or toggle in this feature. If wrong: additional theme requirements and contrast checks for light surfaces.
5. **GitHub Pages remains the host** — default: CI continues to publish the static build to GitHub Pages from the mainline branch used today. If wrong: deploy contracts and artifact expectations change.
6. **Preview image path + redesign** — default: serve OG/Twitter image at public path `/preview-image.jpg` (`https://www.luisexpert.dev/preview-image.jpg`) **and** that asset is redesigned for the dark retro-futurist brand in this feature (legacy art is not acceptable). If wrong: all social meta image URLs, crawl checks, and brand-preview acceptance change.
7. **Link Board is structural inspiration** — default: emulate personal-brand block rhythm/hierarchy, not pixel-parity or Framer-only interactions. If wrong: visual acceptance becomes template cloning rather than adaptation.
8. **Section content and social URLs are data/config-driven** — default: About / Experience / Education / Testimonials copy and social profile URLs (including LinkedIn) come from a content/config data source that can be varied per build (empty section, missing/invalid LinkedIn URL) without editing application UI source. If wrong: counterpart scenarios @S16, @S12, and @S23 are not constructible as written and must be dropped or rewritten.
9. **Contact delivery = mailto handoff** — default: keep today’s behavior: prevent default submit, show local thanks acknowledgment, and initiate `mailto:hello@luisexpert.dev` with subject/body derived from Name + Message. If wrong: FR5/FR6 and @S10 observable success criteria change (client-only ack or real backend endpoint).
10. **Production SEO host locked to custom domain** — default: `canonical`, `og:url`, and absolute social image URLs stay locked to `https://www.luisexpert.dev/` (and `https://www.luisexpert.dev/preview-image.jpg`); correct SEO on default `*.github.io` is not required. If wrong: absolute URL expectations and host-specific acceptance expand.
11. **Hero is recruiter-facing, not legacy greeting** — default: first-viewport identity is name-first with a strong senior/AI full-stack role signal and recruiter-compelling framing; the literal string `hello, i'm Luis Mendieta` is not required. If wrong: FR1/@S1/@S19 acceptance reverts to exact legacy greeting copy.

## Open questions

_(none — all prior open questions were resolved at the spec gate.)_

## Traceability

| Requirement | Scenarios |
|---|---|
| FR1 | @S1, @S19 |
| FR2 | @S2, @S16 |
| FR3 | @S3, @S16 |
| FR4 | @S4, @S16 |
| FR5 | @S5, @S12 |
| FR6 | @S10, @S11, @S15 |
| FR7 | @S1, @S7, @S22 |
| FR8 | @S7, @S20 |
| FR9 / NFR1 | @S8, @S14, @S19 |
| FR10 / NFR6 | @S6, @S13, @S18 |
| FR11 | @S17 |
| FR12 / NFR5 | @S9 |
| FR13 | @S9, @S20 |
| FR14 | @S20 |
| FR15 | @S22, @S23, @S16 |
| NFR2 | @S7 |
| NFR3 | @S21 |
| NFR4 | @S5, @S12 |
| NFR5 | @S9 |
| NFR6 | @S6, @S13 |
