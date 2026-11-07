import { Corner } from './decor/Decor'
import './ActDiagram.css'

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
          <strong>Next.js and React</strong>
          <span>Live progress over authenticated Socket.IO</span>
        </li>
        <li className="diagram__node">
          <strong>NestJS API</strong>
          <span>Job scheduling, collision detection, audit log</span>
        </li>
        <li className="diagram__group">
          <p className="diagram__group-label">
            <strong>LangGraph orchestration</strong>
            <span>Durable checkpoints</span>
          </p>
          <ul className="diagram__agents">
            <li>
              <strong>Passage generation</strong>
              <span>RAG over textbook PDFs</span>
            </li>
            <li>
              <strong>Question generation</strong>
              <span>Specialized prompt and rules</span>
            </li>
            <li>
              <strong>Question review</strong>
              <span>Specialized prompt and rules</span>
            </li>
            <li>
              <strong>Question bank check</strong>
              <span>
                RAG similarity search. At 80% similar or more: regenerate, then flag
                to a specialist in round two
              </span>
            </li>
          </ul>
        </li>
        <li className="diagram__node diagram__node--gate">
          <strong>Specialist review</strong>
          <span>Human gate before an item is accepted</span>
        </li>
        <li className="diagram__node">
          <strong>IMS QTI export</strong>
        </li>
      </ol>
      <figcaption className="diagram__caption">
        How a question moves through the platform
      </figcaption>
    </figure>
  )
}
