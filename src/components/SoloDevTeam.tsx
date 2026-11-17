import { useEffect, useRef, useState } from 'react'
import './SoloDevTeam.css'

/*
 * One agent vs. SoloDev, row by row. The left column is the failure a single agent falls into;
 * the right plays the SoloDev fix as a short sequence, one beat per step, then holds and loops.
 */
const SPEC_LINES = ['Requirements', '@scenario tags', 'Plan']
const LENSES = ['evidence', 'correctness', 'security', 'design', 'UI']

/** Beat at which each part of the sequence lights up. */
const AT = {
  spec: 1, // spec lines tick in, one per beat (1, 2, 3)
  approve: 4,
  fail: 5,
  pass: 6,
  reviewer: 7,
  lenses: 8,
  pr: 9,
}
const LAST = AT.pr
const BEAT_MS = 850
const HOLD_BEATS = 4

function useSequence() {
  const ref = useRef<HTMLElement>(null)
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [beat, setBeat] = useState(reduced ? LAST : 0)
  const [visible, setVisible] = useState(false)
  const [run, setRun] = useState(0)
  // The interval reads the beat from here, so it resumes where it paused without restarting.
  const beatRef = useRef(beat)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.35,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  useEffect(() => {
    if (!visible || reduced) return
    const id = window.setInterval(() => {
      const tick = beatRef.current >= LAST + HOLD_BEATS ? 0 : beatRef.current + 1
      beatRef.current = tick
      setBeat(Math.min(tick, LAST))
    }, BEAT_MS)
    return () => window.clearInterval(id)
  }, [visible, reduced, run])

  const replay = () => {
    beatRef.current = 0
    setBeat(0)
    setRun((r) => r + 1)
  }

  return { ref, beat, replay, reduced }
}

export function SoloDevTeam() {
  const { ref, beat, replay, reduced } = useSequence()
  const on = (n: number) => (beat >= n ? ' is-on' : '')

  return (
    <section ref={ref} className="team" aria-labelledby="team-title">
      <div className="team__head">
        <h2 id="team-title" className="case__h2">
          One agent vs. a team
        </h2>
        <p>
          Ask one agent to build a feature and it fails in three predictable places. SoloDev gives
          each of those jobs to someone else.
        </p>
      </div>

      <div className="team__grid">
        <div className="team__colhead" aria-hidden>
          <span />
          <span>One agent</span>
          <span>SoloDev</span>
        </div>

        {/* ---------- Scope ---------- */}
        <div className="team__row">
          <p className="team__label">Scope</p>
          <div className="team__solo">
            <div className="team__fuzzy" aria-hidden>
              <span>build feature X</span>
              <span className="team__q">?</span>
            </div>
            <p>Guesses what you meant and starts coding.</p>
          </div>
          <div className="team__fix">
            <div className="team__spec" aria-hidden>
              <span className="team__card-title">spec.md</span>
              {SPEC_LINES.map((line, i) => (
                <span key={line} className={`team__line${on(AT.spec + i)}`}>
                  <span className="team__check">✓</span>
                  {line}
                </span>
              ))}
              <span className={`team__stamp${on(AT.approve)}`}>You approve</span>
            </div>
            <p>
              You approve a spec before any code exists. A CLI check fails any branch with code
              written before approval.
            </p>
          </div>
        </div>

        {/* ---------- Tests ---------- */}
        <div className="team__row">
          <p className="team__label">Tests</p>
          <div className="team__solo">
            <div className="team__runs" aria-hidden>
              <span className="team__run team__run--pass is-on">
                <span>new code</span>
                <b>PASS</b>
              </span>
            </div>
            <p>Writes tests that pass by construction. They were never seen to fail.</p>
          </div>
          <div className="team__fix">
            <div className="team__runs" aria-hidden>
              <span className={`team__run team__run--fail${on(AT.fail)}`}>
                <span>old code</span>
                <b>FAIL</b>
                <i>recorded</i>
              </span>
              <span className={`team__arrow${on(AT.pass)}`}>→</span>
              <span className={`team__run team__run--pass${on(AT.pass)}`}>
                <span>new code</span>
                <b>PASS</b>
              </span>
            </div>
            <p>Each test is shown to fail first. The reviewer reads that failing run before running it on the new code.</p>
          </div>
        </div>

        {/* ---------- Review ---------- */}
        <div className="team__row">
          <p className="team__label">Review</p>
          <div className="team__solo">
            <div className="team__self" aria-hidden>
              <span className="team__agent">agent</span>
              <svg viewBox="0 0 60 28" className="team__loop">
                <path d="M6 22 C6 4, 54 4, 54 22" fill="none" stroke="currentColor" strokeDasharray="2 3" />
                <path d="M50 18 L54 23 L58 18" fill="none" stroke="currentColor" />
              </svg>
              <span className="team__lgtm">“LGTM”</span>
            </div>
            <p>Reviews its own work, with the same context and the same blind spots.</p>
          </div>
          <div className="team__fix">
            <div className="team__review" aria-hidden>
              <div className="team__pair">
                <span className="team__agent">coder</span>
                <span className={`team__arrow${on(AT.reviewer)}`}>→</span>
                <span className={`team__agent team__agent--reviewer${on(AT.reviewer)}`}>
                  reviewer
                  <small>fresh context · own model</small>
                </span>
              </div>
              <div className="team__lenses">
                <span className={`team__risky${on(AT.lenses)}`}>risky change:</span>
                {LENSES.map((lens, i) => (
                  <span
                    key={lens}
                    className={`team__lens${on(AT.lenses)}`}
                    style={{ transitionDelay: beat >= AT.lenses ? `${i * 70}ms` : '0ms' }}
                  >
                    {lens}
                  </span>
                ))}
              </div>
            </div>
            <p>
              The reviewer never wrote the code. Auth, payments, migrations, or a public API get one
              reviewer per lens, in parallel, and can run on another vendor’s model.
            </p>
          </div>
        </div>

        {/* ---------- Result ---------- */}
        <div className="team__row team__row--result">
          <p className="team__label">You get</p>
          <div className="team__solo">
            <span className="team__diff" aria-hidden>
              git diff
            </span>
            <p>A diff, and you start reviewing.</p>
          </div>
          <div className="team__fix">
            <span className={`team__pr${on(AT.pr)}`} aria-hidden>
              <b>PR ready</b>
              <span>QA attached</span>
              <span>walkthrough</span>
            </span>
            <p>A ready pull request with QA results and a file-by-file walkthrough. It never merges or pushes to main.</p>
          </div>
        </div>
      </div>

      {!reduced && (
        <button type="button" className="team__replay" onClick={replay}>
          Replay
        </button>
      )}
    </section>
  )
}
