import { FlowDefs, FlowPulse, INK } from './FlowGraph'

const PATH_IMPLEMENT = 'M220 80 L220 118'
const PATH_REVIEW = 'M220 174 L220 212'
const PATH_MERGE = 'M220 268 L220 306'
const PATH_FIX = 'M350 240 H395 V146 H350'

const STEPS = [
  { title: 'Spec', detail: 'You approve it', y: 24, gate: true },
  { title: 'Implementation', detail: 'Tests first, 2 attempts', y: 118, gate: false },
  { title: 'Fresh-context review', detail: '1 fix round, 1 re-review', y: 212, gate: false },
  { title: 'Pull request', detail: 'You merge', y: 306, gate: true },
]

/** The SoloDev workflow in the same language as the ACT graph; solid blocks mark a human gate. */
export function SoloDevFlow() {
  const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <svg
      className="flow-graph"
      viewBox="0 0 440 440"
      role="img"
      aria-label="The SoloDev flow. You approve a spec. Implementation writes tests first, with two attempts. A fresh-context reviewer allows one fix round and one re-review. You merge the pull request. When a budget runs out, the work comes back to you."
    >
      <FlowDefs prefix="solodev" />

      <rect width="440" height="440" fill="url(#solodev-grid)" />

      <g fill="none" stroke={INK} strokeWidth="1">
        <path d={PATH_IMPLEMENT} />
        <path d={PATH_REVIEW} />
        <path d={PATH_MERGE} />
        <path d={PATH_FIX} strokeDasharray="2 4" />
      </g>

      {animate && (
        <>
          <FlowPulse path={PATH_IMPLEMENT} dur={1.8} />
          <FlowPulse path={PATH_REVIEW} dur={1.8} begin={0.6} />
          <FlowPulse path={PATH_FIX} dur={3} begin={1} />
          <FlowPulse path={PATH_MERGE} dur={1.8} begin={1.2} />
        </>
      )}

      {STEPS.map((step) => (
        <g
          key={step.title}
          className={`flow-graph__node${step.gate ? ' flow-graph__node--gate' : ''}`}
          transform={`translate(90 ${step.y})`}
        >
          <rect width="260" height="56" />
          <text x="130" y="24">{step.title}</text>
          <text className="flow-graph__small" x="130" y="43">{step.detail}</text>
        </g>
      ))}

      <text className="flow-graph__loop" x="388" y="198">Fix</text>
      <text className="flow-graph__note" x="220" y="404">Budget runs out: back to you</text>
    </svg>
  )
}
