# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The site is for people who want to know how Luis works and what he has built:

- **Visitors scanning quickly** want to know what he does, his stack, his experience, and where he works from, without reading a case study.
- **Engineers and engineering leads** want the reasoning behind the work: the problem, the decisions, and how the result was kept reliable.

## Product Purpose

luism.dev is the personal site of Luis Mendieta, Senior Full-Stack AI Engineer. It shows his work and how he approaches problems, and makes it easy to get in touch to build something together or compare notes. Success means a visitor understands what he does and how he does it, and emails him when there's something worth talking about.

## Positioning

Luis learns the problem from the people who have it, proves the idea with a quick prototype, then ships it end to end, using AI where it helps and plain software where that's the better fix. Describe what he has done, in plain language. These parts are one claim and future work should protect all of them:

- **Problem first:** working out the idea with stakeholders and users before building (the ACT prototype).
- **Prototype, then production:** prove one workflow, get approval, then grow it (ACT).
- **Trustworthy AI:** deterministic checks, audit trails, human sign-off, and attention to token cost.
- **End-to-end ownership:** from agents and RAG through the API, product UI, and deployment to AWS.

## Operating Context

The site sits alongside his LinkedIn and GitHub profiles. Luis works remotely from San Luis Potosí, Mexico (UTC−6), has built software since 2018, and currently works at MaxiCare. Keep the tone that of a personal site: invite collaboration and conversation, and don't advertise availability.

## Capabilities and Constraints

- The site has a home page and static case study pages for ACT, SoloDev, and Ultra at `/work/<slug>/`, plus a link to When Are You.
- Contact is one email action to `yo@luism.dev`, with links to GitHub and LinkedIn.
- Most site copy lives in `src/data/content.ts`.
- The site is deployed to GitHub Pages at `www.luism.dev`.

## Brand Commitments

The name is Luis Mendieta, the role title is Senior Full-Stack AI Engineer, and the domain is `luism.dev`. The headline is "Full-stack AI engineer. I ship what works." and the subhead is "I build AI into real products, and plain software when that’s the better fix. I start with the people who have the problem, prototype fast, and ship to production." Don't add observability claims or metrics until Luis supplies an example.

## Evidence on Hand

The current site copy is the limit of what may be claimed about ACT, Ultra, and MaxiCare. Don't add screenshots, metrics, client details, or new claims without Luis's approval.

- **ACT:** a private multi-agent LangGraph platform in production, onboarding as many subject areas as possible (Biology, English, and Math among them) to speed up content generation. It began as a prototype Luis and a teammate shaped with stakeholders (an AI workflow that drafts a first version of an exam item); after approval it grew to cover passage generation, multi-lens reviews, and RAG duplicate detection. Luis deployed it to the company's AWS through Jenkins CI/CD, with Docker images on Kubernetes. Its page covers architecture only.
- **SoloDev:** open source at `https://github.com/luisintosh/solodev`. Origin: the team at ACT was asked to adopt AI with no guidance on how; Luis introduced a customized version of the open source Superpowers skill set, which used up the monthly token budget too fast, so he built SoloDev on his own time to use fewer tokens. He continued it at MaxiCare, focused on automating the process so people can focus on the problem, the solution, and understanding the output.
- **Ultra:** a crypto wallet and NFT marketplace serving thousands of active users.
- **MaxiCare:** current role building AI workflows into an AI-native EMR for skilled nursing and assisted living.
- **When Are You:** a live product at `https://whenareyou.luism.dev/`.
- **Recommendations:** five named quotes from ACT and Ultra colleagues in `src/data/content.ts`, with avatars in `public/assets/avatars/`.
- **Credentials:** B.S. in Computer Systems Engineering, Google Cloud Professional Cloud Developer, AWS Certified Developer Associate, and GenAI training from DeepLearning.AI and IBM.
- **Cloud delivery:** ACT on AWS (Jenkins, Docker, Kubernetes), the AWS and Google Cloud certifications, and CI/CD pipelines at Ultra. There is no GCP deployment story; don't invent one.

The site has no published metrics beyond what is listed above, and no ACT or MaxiCare product visuals.

## Product Principles

1. **Serve the scan and the deep read.** A quick visitor should be able to confirm what Luis does, his stack, experience, and location without reading a case study, and an engineer should be able to find the reasoning behind the work.
2. **Back every claim.** Tie positioning to real work or credentials, and stay within the approved evidence.
3. **Keep the whole position intact.** Don't reduce Luis to an AI specialist, a frontend engineer, or a cloud engineer.
4. **Show how trust is built.** Name the concrete mechanisms, such as checks, review, and audit trails, instead of only saying the work is trustworthy.
