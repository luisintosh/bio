import type { ReactNode } from 'react'
import './FlowGraph.css'

/* Match the page tokens in index.css; SVG presentation attributes can't read CSS variables. */
export const INK = '#1c1c1c'
export const ACCENT = '#2352de'

/** The dot grid shared by the homepage diagrams. Prefix keeps SVG ids unique. */
export function FlowDefs({ prefix, children }: { prefix: string; children?: ReactNode }) {
  return (
    <defs>
      <pattern id={`${prefix}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="0.9" fill={INK} fillOpacity="0.22" />
      </pattern>
      {children}
    </defs>
  )
}

export function FlowPulse({
  path,
  dur = 2.4,
  begin = 0,
}: {
  path: string
  dur?: number
  begin?: number
}) {
  return (
    <circle r="3.5" fill={ACCENT}>
      {/* A negative begin starts mid-path, so a delayed pulse never sits at the SVG origin. */}
      <animateMotion path={path} dur={`${dur}s`} begin={`${-begin}s`} repeatCount="indefinite" />
    </circle>
  )
}
