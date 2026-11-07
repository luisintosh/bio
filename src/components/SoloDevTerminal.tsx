import './SoloDevTerminal.css'

/** The real setup and first mission from the SoloDev README. */
export function SoloDevTerminal() {
  return (
    <pre className="terminal">
      <code>
        <span className="terminal__command">$ npx skills add luisintosh/solodev</span>
        {'\n\n'}
        <span className="terminal__command">/mission init</span>
        {'\nOnce in each coding tool, then start a new session.\n\n'}
        <span className="terminal__command">/mission Add CSV export to the accounts page</span>
      </code>
    </pre>
  )
}
