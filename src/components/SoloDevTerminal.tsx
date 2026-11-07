import './SoloDevTerminal.css'

/** Real commands and flow from the SoloDev README. */
export function SoloDevTerminal() {
  return (
    <pre className="terminal">
      <code>
        <span className="terminal__command">$ npx skills add luisintosh/solodev</span>
        {'\n\n'}
        <span className="terminal__command">/mission Add CSV export to the accounts page</span>
        {'\n\n'}
        {'Spec. You approve it.\nImplement. Tests first.\nReview. Fresh context.\nPR. You merge.'}
      </code>
    </pre>
  )
}
