import { FlowDefs, FlowPulse, INK } from './FlowGraph'

const CX = 220
const COL = { x: 130, w: 180 }

/** Top edge and height of each step in the main column. */
const STEPS = [
  { title: 'Next.js monorepo', y: 10, h: 30 },
  { title: 'Orchestrator', detail: 'LangGraph', y: 54, h: 40 },
  { title: 'Question generation', y: 104, h: 30 },
  { title: 'Question bank check', y: 146, h: 30 },
  { title: 'Synthesize feedback', detail: 'Applied to the item', y: 248, h: 40 },
  { title: 'UI generation', y: 302, h: 30 },
  { title: 'Specialist review', detail: 'Human gate', y: 346, h: 40, gate: true },
  { title: 'IMS QTI export', y: 400, h: 30 },
]

const REVIEWERS = [144, 182, 220, 258, 296]
const REVIEWER_Y = 204
const REVIEWER_SIZE = 26

const PATH_MAIN = `M${CX} 40 V400`
const PATH_REGENERATE = 'M310 161 H330 V119 H310'
const PATH_FEEDBACK = 'M130 268 H110 V119 H130'
const reviewerPath = (x: number) =>
  `M${CX} 176 L${x} ${REVIEWER_Y} V${REVIEWER_Y + REVIEWER_SIZE} L${CX} 248`

/** The ACT question flow for its homepage card. */
export function ActGraph() {
  const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <svg
      className="flow-graph"
      viewBox="0 0 440 440"
      role="img"
      aria-label="A Next.js monorepo calls a LangGraph orchestrator, which routes each request to its flow. In question generation, the new item is checked against the question bank and regenerated if it is 80% similar or more. Five reviewers then check it in parallel, and their feedback is synthesized and applied. If there is feedback, the item goes back to question generation. If not, the UI for the question is generated, a content specialist reviews it, and it is exported as IMS QTI."
    >
      <FlowDefs prefix="act" />

      <rect width="440" height="440" fill="url(#act-grid)" />

      <g fill="none" stroke={INK} strokeWidth="1">
        <path d={`M${CX} 40 V176`} />
        {REVIEWERS.map((x) => (
          <path key={x} d={reviewerPath(x)} />
        ))}
        <path d={`M${CX} 288 V400`} />
        <path d="M130 74 H112" strokeDasharray="2 4" />
        <path d={PATH_REGENERATE} strokeDasharray="2 4" />
        <path d={PATH_FEEDBACK} strokeDasharray="2 4" />
      </g>

      {/* Drawn before the boxes so pulses pass behind them. */}
      {animate && (
        <>
          <FlowPulse path={PATH_MAIN} dur={6} />
          {REVIEWERS.map((x, i) => (
            <FlowPulse key={x} path={reviewerPath(x)} dur={1.6} begin={i * 0.3} />
          ))}
          <FlowPulse path={PATH_REGENERATE} dur={2.4} begin={0.8} />
          <FlowPulse path={PATH_FEEDBACK} dur={3.6} begin={1.6} />
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
              <text x={COL.w / 2} y="17">{step.title}</text>
              <text className="flow-graph__small" x={COL.w / 2} y="33">{step.detail}</text>
            </>
          ) : (
            <text x={COL.w / 2} y="20">{step.title}</text>
          )}
        </g>
      ))}

      {REVIEWERS.map((x, i) => (
        <g
          key={x}
          className="flow-graph__node"
          transform={`translate(${x - REVIEWER_SIZE / 2} ${REVIEWER_Y})`}
        >
          <rect width={REVIEWER_SIZE} height={REVIEWER_SIZE} />
          <text x={REVIEWER_SIZE / 2} y="18">{i + 1}</text>
        </g>
      ))}

      <g className="flow-graph__side">
        <text x="106" y="78">Other flows</text>
        <text x="104" y="198">Feedback</text>
        <text className="flow-graph__side--right" x="338" y="136">80%+</text>
        <text className="flow-graph__side--right" x="338" y="152">regenerate</text>
        <text className="flow-graph__side--right" x="338" y="214">Reviewers</text>
        <text className="flow-graph__side--right" x="338" y="230">in parallel</text>
      </g>
    </svg>
  )
}
