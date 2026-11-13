import type { Flow } from '../data/flows'
import { FlowDefs, FlowPulse, INK } from './FlowGraph'
import './Swimlane.css'

type Orientation = 'wide' | 'tall'

type Box = { x: number; y: number; w: number; h: number; cx: number; cy: number }

/*
 * Both layouts are drawn in "main" (the direction steps advance) and "cross" (across the
 * lanes) coordinates, then mapped to x and y. Wide runs steps left to right with lanes as
 * rows; tall runs them top to bottom with lanes as columns, so phones keep readable text.
 */
const WIDE = { width: 832, gutter: 104, laneSize: 76, nodeCross: 46, nodeGap: 12 }
const TALL = { width: 360, stepPitch: 64, laneHead: 46, nodeMain: 46, nodeGap: 8 }

function layout(flow: Flow, orientation: Orientation) {
  const { lanes, steps, loops = [] } = flow
  const wide = orientation === 'wide'
  const xy = (main: number, cross: number) => (wide ? [main, cross] : [cross, main])

  // Cross extent of each lane band, and the main pitch of each step.
  const laneSize = wide ? WIDE.laneSize : TALL.width / lanes.length
  const mainStart = wide ? WIDE.gutter : TALL.laneHead
  const pitch = wide ? (WIDE.width - WIDE.gutter) / steps.length : TALL.stepPitch

  const nodeMain = wide ? pitch - WIDE.nodeGap : TALL.nodeMain
  const nodeCross = wide ? WIDE.nodeCross : laneSize - TALL.nodeGap

  const boxes: Box[] = steps.map((step, i) => {
    const mainCenter = mainStart + pitch * i + pitch / 2
    const crossCenter = laneSize * step.lane + laneSize / 2
    const [cx, cy] = xy(mainCenter, crossCenter)
    const [w, h] = xy(nodeMain, nodeCross)
    return { x: cx - w / 2, y: cy - h / 2, w, h, cx, cy }
  })

  const mainOf = (b: Box) => (wide ? b.cx : b.cy)
  const crossOf = (b: Box) => (wide ? b.cy : b.cx)
  const pt = (main: number, cross: number) => xy(main, cross).join(' ')

  // One path through every node's center; nodes are drawn over it, so only the links show.
  let spine = `M${pt(mainOf(boxes[0]), crossOf(boxes[0]))}`
  const arrows: string[] = []
  for (let i = 1; i < boxes.length; i++) {
    const a = boxes[i - 1]
    const b = boxes[i]
    const mid = (mainOf(a) + mainOf(b)) / 2
    if (crossOf(a) !== crossOf(b)) {
      spine += ` L${pt(mid, crossOf(a))} L${pt(mid, crossOf(b))}`
    }
    spine += ` L${pt(mainOf(b), crossOf(b))}`
    const edge = mainOf(b) - nodeMain / 2
    arrows.push(`M${pt(edge - 9, crossOf(b))} L${pt(edge, crossOf(b))}`)
  }

  // Loops leave from the far side of a node (below in wide, right in tall) and come back.
  const far = (b: Box) => (wide ? b.y + b.h : b.x + b.w)
  const loopPaths = loops.map((loop) => {
    const a = boxes[loop.from]
    const b = boxes[loop.to]
    const out = Math.max(far(a), far(b)) + loop.depth
    const land = mainOf(b) + (loop.offset ?? 0)
    const d = `M${pt(mainOf(a), far(a))} L${pt(mainOf(a), out)} L${pt(land, out)} L${pt(land, far(b))}`
    const [lx, ly] = xy((mainOf(a) + land) / 2, out)
    return { d, lx, ly, label: loop.label, reach: out }
  })

  const lastStep = mainStart + pitch * steps.length
  const loopReach = Math.max(0, ...loopPaths.map((l) => l.reach + 14))
  const hasBoundary = lanes.some((lane) => lane.boundary)

  const width = wide ? WIDE.width : TALL.width
  const height = wide
    ? Math.max(laneSize * lanes.length, loopReach)
    : lastStep + (hasBoundary ? 30 : 6)

  // Lines between lanes, with the trust boundary drawn heavier and labeled.
  const separators = lanes.slice(0, -1).map((lane, i) => {
    const at = laneSize * (i + 1)
    const [x1, y1] = xy(0, at)
    const [x2, y2] = xy(wide ? width : lastStep, at)
    return { x1, y1, x2, y2, boundary: lane.boundary, at }
  })

  return { width, height, boxes, spine, arrows, loopPaths, separators, laneSize, wide }
}

function Diagram({ flow, id, orientation }: { flow: Flow; id: string; orientation: Orientation }) {
  const g = layout(flow, orientation)
  const prefix = `${id}-${orientation}`
  const animate =
    typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <svg
      className={`lanes__svg lanes__svg--${orientation}`}
      viewBox={`0 0 ${g.width} ${g.height}`}
      role="img"
      aria-label={flow.label}
    >
      <FlowDefs prefix={prefix}>
        <marker
          id={`${prefix}-arrow`}
          viewBox="0 0 8 8"
          refX="8"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0 0 L8 4 L0 8 z" fill={INK} />
        </marker>
      </FlowDefs>

      <rect width={g.width} height={g.height} fill={`url(#${prefix}-grid)`} />

      {g.wide && (
        <line
          className="lanes__gutter"
          x1={WIDE.gutter - 12}
          y1="0"
          x2={WIDE.gutter - 12}
          y2={g.laneSize * flow.lanes.length}
        />
      )}

      {g.separators.map((s) => (
        <line
          key={s.at}
          className={s.boundary ? 'lanes__boundary' : 'lanes__separator'}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
        />
      ))}

      {flow.lanes.map((lane, i) =>
        g.wide ? (
          <text
            key={lane.label}
            className="lanes__lane"
            x="0"
            y={g.laneSize * i + g.laneSize / 2 - (lane.sub ? 3 : -4)}
          >
            <tspan className="lanes__lane-name">{lane.label}</tspan>
            {lane.sub && (
              <tspan x="0" dy="16">
                {lane.sub}
              </tspan>
            )}
          </text>
        ) : (
          <text
            key={lane.label}
            className="lanes__lane lanes__lane--tall"
            x={g.laneSize * i + g.laneSize / 2}
            y="16"
          >
            <tspan className="lanes__lane-name">{lane.short ?? lane.label}</tspan>
            {lane.sub && (
              <tspan x={g.laneSize * i + g.laneSize / 2} dy="15">
                {lane.sub}
              </tspan>
            )}
          </text>
        ),
      )}

      <path className="lanes__spine" d={g.spine} />

      {g.loopPaths.map((loop) => (
        <path
          key={loop.label}
          className="lanes__loop"
          d={loop.d}
          markerEnd={`url(#${prefix}-arrow)`}
        />
      ))}

      {/* Drawn before the boxes so the pulse passes behind them. */}
      {animate && <FlowPulse path={g.spine} dur={flow.steps.length * 0.9} />}

      {g.arrows.map((d) => (
        <path key={d} className="lanes__arrow" d={d} markerEnd={`url(#${prefix}-arrow)`} />
      ))}

      {flow.steps.map((step, i) => {
        const b = g.boxes[i]
        const kind = step.gate ? ' lanes__node--gate' : step.code ? ' lanes__node--code' : ''
        return (
          <g key={`${step.title}-${i}`} className={`lanes__node${kind}`}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} />
            <text className="lanes__title" x={b.cx} y={step.detail ? b.cy - 3 : b.cy + 4}>
              {step.title}
            </text>
            {step.detail && (
              <text className="lanes__detail" x={b.cx} y={b.cy + 13}>
                {step.detail}
              </text>
            )}
          </g>
        )
      })}

      {g.loopPaths.map((loop) => (
        <text key={loop.label} className="lanes__note" x={loop.lx} y={loop.ly + 4}>
          {loop.label}
        </text>
      ))}

      {g.separators
        .filter((s) => s.boundary)
        .map((s) =>
          g.wide ? (
            <text
              key={s.at}
              className="lanes__note lanes__note--end"
              x={g.width - 4}
              y={s.y1 - 7}
            >
              {s.boundary}
            </text>
          ) : (
            <text key={s.at} className="lanes__note" x={s.x1} y={g.height - 8}>
              {s.boundary}
            </text>
          ),
        )}
    </svg>
  )
}

/** A swimlane diagram: who (or what) does each step, in order. Wide on desktop, tall on phones. */
export function Swimlane({ flow, id }: { flow: Flow; id: string }) {
  return (
    <div className="lanes">
      <Diagram flow={flow} id={id} orientation="wide" />
      <Diagram flow={flow} id={id} orientation="tall" />
    </div>
  )
}
