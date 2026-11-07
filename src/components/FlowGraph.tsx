import type { ReactNode } from 'react'
import './FlowGraph.css'

export const CYAN = '#4fe3ff'
export const GOLD = '#ffc94d'
export const CORAL = '#ff7a90'

/** The grid and glow shared by the homepage diagrams. Prefix keeps SVG ids unique. */
export function FlowDefs({ prefix, children }: { prefix: string; children?: ReactNode }) {
  return (
    <defs>
      <pattern id={`${prefix}-grid`} width="22" height="22" patternUnits="userSpaceOnUse">
        <path d="M22 0H0V22" fill="none" stroke={CYAN} strokeOpacity="0.1" />
      </pattern>
      <filter id={`${prefix}-glow`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      {children}
    </defs>
  )
}

export function FlowPulse({
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
