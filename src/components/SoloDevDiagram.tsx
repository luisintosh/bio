import { Corner } from './decor/Decor'
import './Diagram.css'

const LENSES = ['Evidence', 'Contract', 'Correctness', 'Security', 'Design', 'UI']

/** The full /mission flow from the SoloDev README, for the case study. */
export function SoloDevDiagram() {
  return (
    <figure className="diagram">
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />

      <ol className="diagram__flow">
        <li className="diagram__node">
          <strong>/mission Add CSV export to the accounts page</strong>
          <span>The commander writes the spec with you</span>
        </li>
        <li className="diagram__node">
          <strong>Spec</strong>
          <span>
            Requirements, acceptance scenarios tagged @S1, @S2…, and a plan of at most three
            journeys, one test file each
          </span>
        </li>
        <li className="diagram__node diagram__node--gate">
          <strong>You approve the spec</strong>
          <span>No code before this; solodev check fails a branch that has some</span>
        </li>
        <li className="diagram__group">
          <p className="diagram__group-label">
            <strong>Two shadows, fresh context</strong>
            <span>Subagents with their own models</span>
          </p>

          <ol className="diagram__steps">
            <li>
              <strong>Implement · shadow-coder</strong>
              <span>Writes the journey tests, then the code and the docs beside it</span>
              <em className="diagram__loop">Budget: two attempts</em>
            </li>
            <li>
              <strong>Review · shadow-reviewer</strong>
              <span>Runs each journey test on the old code, where it must fail, and on the new, where it must pass</span>
              <ul className="diagram__chips" aria-label="Review lenses">
                {LENSES.map((lens) => (
                  <li key={lens}>{lens}</li>
                ))}
              </ul>
              <span>A large or sensitive change gets one reviewer per lens, in parallel</span>
              <em className="diagram__loop">Blockers and majors: back to the coder once</em>
            </li>
          </ol>
        </li>
        <li className="diagram__node">
          <strong>Pull request</strong>
          <span>Draft PR, QA for any scenario no test covers, then marked ready</span>
        </li>
        <li className="diagram__node diagram__node--gate">
          <strong>You merge</strong>
          <span>It never merges or pushes to main</span>
        </li>
      </ol>
      <figcaption className="diagram__caption">
        Every step has a budget: two implement attempts, one fix round, one re-review. A spent
        budget stops and asks you.
      </figcaption>
    </figure>
  )
}
