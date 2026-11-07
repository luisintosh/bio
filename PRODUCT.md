# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The site serves two primary audiences for senior GenAI full-stack roles:

- **Recruiters and talent partners** screen candidates. They need to establish role fit, stack, seniority, and location quickly, then decide whether to reach out or pass Luis along.
- **Hiring managers** evaluate the candidate. They need enough evidence of technical judgment, ownership, and delivery to decide whether a conversation is worthwhile.

## Product Purpose

luism.dev is the personal site of Luis Mendieta, Senior GenAI Full-Stack Engineer. It exists to win conversations about senior GenAI full-stack roles. Success means a qualified recruiter or hiring manager understands the fit and emails Luis.

## Positioning

Luis builds AI workflows that people can trust in production, and owns them end to end through cloud deployment. These three parts are one claim and future work should protect all of them:

- **Trustworthy AI:** deterministic checks, audit trails, and human sign-off around non-deterministic models.
- **End-to-end ownership:** from agents and RAG through the API and product UI.
- **Cloud delivery:** deployment to AWS and GCP, with CI/CD.

## Operating Context

The site is evaluated alongside a resume, LinkedIn profile, and GitHub profile. The resume isn't published; visitors request it by email. Luis works remotely from Mexico.

## Capabilities and Constraints

- The site has a home page and static case study pages for ACT, SoloDev, and Ultra at `/work/<slug>/`, plus a link to When Are You.
- Contact is one email action to `yo@luism.dev`, with links to GitHub and LinkedIn.
- Most site copy lives in `src/data/content.ts`.
- The site is deployed to GitHub Pages at `www.luism.dev`.
- **Undecided:** whether Luis is open to full-time roles only or also contract work. The copy says "roles" and shouldn't be narrowed without confirmation. It also lists a current position at MaxiCare, so future copy shouldn't imply Luis is between jobs.

## Brand Commitments

The name is Luis Mendieta, the role title is Senior GenAI Full-Stack Engineer, and the domain is `luism.dev`. The headline is "I build AI workflows that people can trust in production."

## Evidence on Hand

The current site copy is the limit of what may be claimed about ACT, Ultra, and MaxiCare. Don't add screenshots, metrics, client details, or new claims without Luis's approval.

- **ACT:** a private multi-agent LangGraph platform in production pilot with Biology, English, and Math specialists. Its page covers architecture only.
- **SoloDev:** open source at `https://github.com/luisintosh/solodev`.
- **Ultra:** a crypto wallet and NFT marketplace serving thousands of active users.
- **MaxiCare:** current role building AI workflows into an AI-native EMR for skilled nursing and assisted living.
- **When Are You:** a live product at `https://whenareyou.luism.dev/`.
- **Recommendations:** five named quotes from ACT and Ultra colleagues in `src/data/content.ts`, with avatars in `public/assets/avatars/`.
- **Credentials:** B.S. in Computer Systems Engineering, Google Cloud Professional Cloud Developer, AWS Certified Developer Associate, and GenAI training from DeepLearning.AI and IBM.
- **Cloud delivery:** the site currently supports this with the AWS and Google Cloud certifications and CI/CD pipelines in the Ultra scope. It has no detailed AWS or GCP deployment story; don't invent one.

The site has no published metrics beyond what is listed above, and no ACT or MaxiCare product visuals.

## Product Principles

1. **Serve the scan and the deep read.** A recruiter should be able to confirm role, stack, seniority, and location without reading a case study, and a hiring manager should be able to find the reasoning behind the work.
2. **Back every claim.** Tie positioning to real work or credentials, and stay within the approved evidence.
3. **Keep the whole position intact.** Don't reduce Luis to an AI specialist, a frontend engineer, or a cloud engineer.
4. **Show how trust is built.** Name the concrete mechanisms, such as checks, review, and audit trails, instead of only saying the work is trustworthy.
