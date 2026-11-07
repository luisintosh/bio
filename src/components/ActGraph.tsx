import './ActGraph.css'

const CYAN = '#4fe3ff'
const GOLD = '#ffc94d'
const CORAL = '#ff7a90'

const HUB = { x: 220, y: 190 }

const AGENTS = [
  { lines: ['Passage', 'generation'], x: 30, y: 95, spoke: 'M220 190 L150 135' },
  { lines: ['Question', 'generation'], x: 290, y: 95, spoke: 'M220 190 L290 135' },
  { lines: ['Question', 'review'], x: 30, y: 235, spoke: 'M220 190 L150 245' },
  { lines: ['Question bank', 'RAG check'], x: 290, y: 235, spoke: 'M220 190 L290 245' },
]

const PATH_IN = 'M220 56 L220 150'
const PATH_GATE = 'M220 230 L220 316'
const PATH_EXPORT = 'M220 364 L220 392'
const PATH_REGENERATE = 'M395 235 L395 145'

function Pulse({
  path,
  color = CYAN,
  dur = 2.4,
  begin = 0,
}: {
  path: string
  color?: string
  dur?: number
  begin?: number
}) {
  const motion = (
    <animateMotion path={path} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
  )
  return (
    <g>
      <circle r="8" fill={color} opacity="0.25">
        {motion}
      </circle>
      <circle r="3" fill="#fff">
        {motion}
      </circle>
    </g>
  )
}

/** The ACT platform drawn as an agent graph for its homepage card. */
export function ActGraph() {
  const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <svg
      className="act-graph"
      viewBox="0 0 440 440"
      role="img"
      aria-label="Next.js and NestJS send work to a LangGraph core that runs four agents: passage generation, question generation, question review, and a question bank RAG check. Questions 80% similar or more are regenerated. Results pass through specialist review, then IMS QTI export."
    >
      <defs>
        <pattern id="act-grid" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M22 0H0V22" fill="none" stroke={CYAN} strokeOpacity="0.1" />
        </pattern>
        <radialGradient id="act-core-light">
          <stop offset="0" stopColor={CYAN} stopOpacity="0.5" />
          <stop offset="1" stopColor={CYAN} stopOpacity="0" />
        </radialGradient>
        <filter id="act-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="440" height="440" fill="url(#act-grid)" />
      <circle cx={HUB.x} cy={HUB.y} r="130" fill="url(#act-core-light)" />

      <g fill="none" stroke={CYAN} strokeWidth="1.5" filter="url(#act-glow)">
        <path d={PATH_IN} />
        {AGENTS.map((agent) => (
          <path key={agent.lines.join()} d={agent.spoke} />
        ))}
        <path d={PATH_GATE} stroke={GOLD} />
        <path d={PATH_EXPORT} stroke={GOLD} />
        <path d={PATH_REGENERATE} stroke={CORAL} strokeDasharray="5 5" />
      </g>

      <g className="act-graph__node" transform="translate(120 20)">
        <rect width="200" height="36" />
        <text x="100" y="23">Next.js + NestJS API</text>
      </g>

      {AGENTS.map((agent) => (
        <g
          key={agent.lines.join()}
          className="act-graph__node"
          transform={`translate(${agent.x} ${agent.y})`}
        >
          <rect width="120" height="50" />
          <text x="60" y="21">{agent.lines[0]}</text>
          <text x="60" y="38">{agent.lines[1]}</text>
        </g>
      ))}

      <text className="act-graph__loop" x="385" y="186">80%+</text>
      <text className="act-graph__loop" x="385" y="202">regenerate</text>

      {/* Drawn before the core so pulses emerge from behind it. */}
      {animate && (
        <>
          <Pulse path={PATH_IN} dur={1.8} />
          {AGENTS.map((agent, i) => (
            <Pulse key={agent.lines.join()} path={agent.spoke} begin={i * 0.6} />
          ))}
          <Pulse path={PATH_REGENERATE} color={CORAL} dur={3} begin={1} />
          <Pulse path={PATH_GATE} color={GOLD} dur={2} begin={0.5} />
          <Pulse path={PATH_EXPORT} color={GOLD} dur={1.2} begin={1.5} />
        </>
      )}

      <g filter="url(#act-glow)">
        <circle cx={HUB.x} cy={HUB.y} r="40" fill="#0b2a55" stroke={CYAN} strokeWidth="2" />
        <circle
          cx={HUB.x}
          cy={HUB.y}
          r="48"
          fill="none"
          stroke={CYAN}
          strokeOpacity="0.7"
          strokeDasharray="3 9"
        >
          {animate && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${HUB.x} ${HUB.y}`}
              to={`360 ${HUB.x} ${HUB.y}`}
              dur="24s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </g>
      <text className="act-graph__hub" x={HUB.x} y={HUB.y + 5}>LangGraph</text>

      <g className="act-graph__node act-graph__node--gate" transform="translate(130 316)">
        <rect width="180" height="48" filter="url(#act-glow)" />
        <text x="90" y="21">Specialist review</text>
        <text className="act-graph__small" x="90" y="37">Human gate</text>
      </g>

      <g className="act-graph__node act-graph__node--export" transform="translate(150 392)">
        <rect width="140" height="32" />
        <text x="70" y="21">IMS QTI export</text>
      </g>
    </svg>
  )
}
