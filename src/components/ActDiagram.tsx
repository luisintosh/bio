import { Corner } from './decor/Decor'
import './ActDiagram.css'

const REVIEWERS = [1, 2, 3, 4, 5]

export function ActDiagram() {
  return (
    <figure className="diagram">
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />

      <ol className="diagram__flow">
        <li className="diagram__node">
          <strong>Content specialist</strong>
        </li>
        <li className="diagram__node">
          <strong>Next.js monorepo</strong>
          <span>
            React app and NestJS API: live progress over authenticated Socket.IO, job
            scheduling, audit log
          </span>
        </li>
        <li className="diagram__group">
          <p className="diagram__group-label">
            <strong>LangGraph orchestrator</strong>
            <span>Routes each request to its flow, with durable checkpoints</span>
          </p>

          <ol className="diagram__steps">
            <li>
              <strong>Question generation</strong>
              <span>Specialized prompt and rules</span>
            </li>
            <li>
              <strong>Question bank check</strong>
              <span>RAG similarity search</span>
              <em className="diagram__loop">80% similar or more: regenerate</em>
            </li>
            <li>
              <strong>Reviewers, in parallel</strong>
              <ul className="diagram__reviewers" aria-label="Five reviewers">
                {REVIEWERS.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </li>
            <li>
              <strong>Synthesize and apply feedback</strong>
              <span>All reviewer feedback in one place</span>
              <em className="diagram__loop">Feedback left: back to question generation</em>
            </li>
            <li>
              <strong>UI generation</strong>
              <span>Renders the question for review</span>
            </li>
          </ol>

          <p className="diagram__other">
            Other flows, such as passage generation with RAG over textbook PDFs, start from
            the same orchestrator.
          </p>
        </li>
        <li className="diagram__node diagram__node--gate">
          <strong>Specialist review</strong>
          <span>Marked ready for a content specialist, the human gate before an item is accepted</span>
        </li>
        <li className="diagram__node">
          <strong>IMS QTI export</strong>
          <span>To another platform</span>
        </li>
      </ol>
      <figcaption className="diagram__caption">
        How a new question moves through the platform
      </figcaption>
    </figure>
  )
}
