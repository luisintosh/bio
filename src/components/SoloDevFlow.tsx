import { FlowDefs, FlowPulse, INK } from './FlowGraph'

const CX = 220
const COL = { x: 110, w: 220 }

const STEPS = [
  { title: '/solo-task Add CSV export', y: 10, h: 30 },
  { title: 'Spec', detail: 'Scenarios, plan, journeys', y: 54, h: 44 },
  { title: 'You approve the spec', y: 112, h: 30, gate: true },
  { title: 'Implement · shadow-coder', detail: 'Tests, then code and docs', y: 156, h: 44 },
  { title: 'Review · shadow-reviewer', detail: 'Tests fail old, pass new', y: 214, h: 44 },
  { title: 'Pull request', detail: 'Draft, QA, marked ready', y: 272, h: 44 },
  { title: 'You merge', y: 330, h: 30, gate: true },
]

const PATH_MAIN = `M${CX} 40 V330`
const PATH_FIX = 'M110 236 H90 V178 H110'

/** The SoloDev /solo-task flow for its homepage card; solid blocks mark a human gate. */
export function SoloDevFlow() {
  const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <svg
      className="flow-graph"
      viewBox="0 0 440 440"
      role="img"
      aria-label="The SoloDev mission flow. You start a mission with a feature request. It writes a spec with scenarios, a plan, and journeys, and you approve it. Two shadows with fresh context take over: the coder writes the tests, then the code and docs, and the reviewer checks that each test fails on the old code and passes on the new. Blockers go back to the coder once. A draft pull request goes through QA and is marked ready, and you merge it. Every step has a budget: two implement attempts, one fix round, and one re-review. A spent budget comes back to you."
    >
      <FlowDefs prefix="solodev" />

      <rect width="440" height="440" fill="url(#solodev-grid)" />

      <rect
        x="100"
        y="148"
        width="240"
        height="118"
        fill="none"
        stroke={INK}
        strokeDasharray="2 4"
      />

      <g fill="none" stroke={INK} strokeWidth="1">
        <path d={PATH_MAIN} />
        <path d={PATH_FIX} strokeDasharray="2 4" />
      </g>

      {/* Drawn before the boxes so pulses pass behind them. */}
      {animate && (
        <>
          <FlowPulse path={PATH_MAIN} dur={5} />
          <FlowPulse path={PATH_FIX} dur={2.4} begin={1.2} />
        </>
      )}

      {STEPS.map((step) => (
        <g
          key={step.title}
          className={`flow-graph__node${step.gate ? ' flow-graph__node--gate' : ''}`}
          transform={`translate(${COL.x} ${step.y})`}
        >
          <rect width={COL.w} height={step.h} />
          {step.detail ? (
            <>
              <text x={COL.w / 2} y="18">{step.title}</text>
              <text className="flow-graph__small" x={COL.w / 2} y="35">{step.detail}</text>
            </>
          ) : (
            <text x={COL.w / 2} y="20">{step.title}</text>
          )}
        </g>
      ))}

      <g className="flow-graph__side">
        <text x="84" y="203">Blockers:</text>
        <text x="84" y="219">fix once</text>
        <text className="flow-graph__side--right" x="346" y="200">Shadows,</text>
        <text className="flow-graph__side--right" x="346" y="216">fresh</text>
        <text className="flow-graph__side--right" x="346" y="232">context</text>
      </g>

      <text className="flow-graph__note" x={CX} y="392">Budget spent: back to you</text>
      <text className="flow-graph__note" x={CX} y="412">2 attempts · 1 fix · 1 re-review</text>
    </svg>
  )
}
