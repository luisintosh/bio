import type { CaseStudySlug } from './content'

export type Lane = {
  label: string
  sub?: string
  /** A shorter name for the narrow phone layout, when `label` won't fit its column. */
  short?: string
  /** Draws the line after this lane as a trust boundary, with this label. */
  boundary?: string
}

export type Step = {
  /** Index into `lanes`. */
  lane: number
  /** Keep titles to about 10 characters and details to about 11: both layouts are tight. */
  title: string
  detail?: string
  /** A person decides here: drawn as a solid block, like the homepage diagrams. */
  gate?: boolean
  /** A deterministic check rather than a model or a person. */
  code?: boolean
}

/** A dashed return path from step `from` back to step `to`. */
export type Loop = {
  from: number
  to: number
  label: string
  /** How far past the nodes the path runs, in px. Stagger loops that share a lane. */
  depth: number
  /** Moves where the loop lands on its target, in px, so two loops don't share an arrowhead. */
  offset?: number
}

export type Flow = {
  lanes: Lane[]
  steps: Step[]
  loops?: Loop[]
  /** The whole flow in a sentence or two, for screen readers. */
  label: string
}

export const flows: Record<CaseStudySlug, Flow> = {
  act: {
    lanes: [
      { label: 'Specialist', sub: 'a person' },
      { label: 'Agents', sub: 'LangGraph' },
      { label: 'Platform', sub: 'NestJS, AWS' },
    ],
    steps: [
      { lane: 0, title: 'Request', detail: 'a new item' },
      { lane: 2, title: 'Schedule', detail: 'logged job' },
      { lane: 1, title: 'Generate', detail: 'by subject' },
      { lane: 1, title: 'Bank check', detail: 'RAG search' },
      { lane: 1, title: 'Review ×5', detail: 'in parallel' },
      { lane: 1, title: 'Synthesize', detail: 'fix list' },
      { lane: 0, title: 'Sign-off', detail: 'human gate', gate: true },
      { lane: 2, title: 'QTI export', detail: 'item banks' },
    ],
    loops: [
      { from: 3, to: 2, label: '80%+ similar', depth: 14 },
      { from: 5, to: 2, label: 'changes left', depth: 38, offset: -14 },
    ],
    label:
      'A content specialist requests a new item, and the platform schedules a logged job. LangGraph agents generate the question for its subject and check it against the question bank with a RAG search; if it is 80% similar or more to an existing one, it is regenerated. Five reviewers check it in parallel and their feedback is synthesized into one fix list; if changes are left, it goes back to generation. A specialist signs off, the human gate, and the platform exports the item as IMS QTI.',
  },
  solodev: {
    lanes: [
      { label: 'You', sub: 'decide' },
      { label: 'Think', sub: 'strong model' },
      { label: 'Implement', sub: 'cheap model' },
      { label: 'CLI', sub: '0 tokens' },
    ],
    steps: [
      { lane: 0, title: '/solo-task', detail: 'a feature' },
      { lane: 1, title: 'Spec', detail: 'scenarios' },
      { lane: 0, title: 'Approve', detail: 'the spec', gate: true },
      { lane: 3, title: 'check', detail: 'no code yet', code: true },
      { lane: 2, title: 'Code', detail: 'tests first' },
      { lane: 1, title: 'Review', detail: '6 lenses' },
      { lane: 1, title: 'Draft PR', detail: 'QA, ready' },
      { lane: 0, title: 'Merge', detail: 'your call', gate: true },
    ],
    loops: [{ from: 5, to: 4, label: 'fix once', depth: 14 }],
    label:
      'You start /solo-task with a feature. The strong model writes a spec with acceptance scenarios, and you approve it. The solodev CLI checks, at zero tokens, that no code exists before approval. The cheaper model writes the tests first, then the code. The strong model, in a fresh context, reviews it through six lenses and can send it back for one fix. It opens a draft pull request, runs QA, and marks it ready, and you merge it.',
  },
  ultra: {
    lanes: [
      { label: 'Player', sub: 'decides' },
      { label: 'Marketplace', short: 'Market', sub: 'web app', boundary: 'encrypted messages only' },
      { label: 'Wallet', sub: 'extension' },
      { label: 'Ultra API', sub: 'backend' },
    ],
    steps: [
      { lane: 0, title: 'Sign in', detail: 'one account' },
      { lane: 3, title: 'Session', detail: 'verified' },
      { lane: 2, title: 'Unlocked', detail: 'no key kept' },
      { lane: 1, title: 'Buy item', detail: 'Proxy call' },
      { lane: 2, title: 'Confirm', detail: 'popup' },
      { lane: 0, title: 'Approve', detail: 'in popup', gate: true },
      { lane: 2, title: 'Sign', detail: 'the order' },
      // DRAFT: "on-chain" simplifies what the backend does after signing.
      { lane: 3, title: 'Settle', detail: 'on-chain' },
    ],
    label:
      'The player signs in once with their Ultra account, the backend verifies the session, and the wallet extension unlocks without keeping a key. In the marketplace the player buys an item, which calls the wallet through a small Proxy command interface; marketplace and wallet only exchange encrypted messages. The wallet shows a confirmation popup, the player approves, the wallet signs the order, and the backend settles it on-chain.',
  },
}
