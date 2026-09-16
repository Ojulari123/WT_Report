/*
 * Figure 3.1. An architecture diagram, which the report guidelines explicitly
 * encourage. This is a technical figure, not a decorative illustration and not a
 * simulated screenshot. The scheduler agent is the largest piece of the platform and
 * is the only element carrying the accent.
 */
export function IngestionFigure() {
  const channels = [
    { y: 41, label: 'Gmail' },
    { y: 83, label: 'Zoho IMAP' },
    { y: 125, label: 'Twilio WhatsApp' },
    { y: 167, label: 'Chat webhook' },
  ]

  const outputs = [
    { y: 41, label: 'Google Calendar' },
    { y: 83, label: 'Google Drive' },
    { y: 125, label: 'Google Sheets' },
    { y: 167, label: 'WhatsApp' },
  ]

  return (
    <svg viewBox="0 0 760 300" className="h-auto w-full" role="img" aria-label="Architecture of the Work Term 4 agent platform. Four inbound channels on the left, Gmail, Zoho IMAP, Twilio WhatsApp and a chat webhook, all feed a single router. The router keeps a sticky session in Postgres recording the last agent per sender, so a follow-up message reaches whichever agent the user was last talking to. The router dispatches to three agents: a scheduler agent of seven workflows, a researcher agent of one workflow and a marketing agent of two workflows, ten in total. Their outputs go to Google Calendar, Google Drive, Google Sheets and WhatsApp.">
      <defs>
        <marker id="wtr-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="var(--ink-3)" />
        </marker>
      </defs>

      {/* column labels */}
      {[
        { x: 64, label: 'INBOUND' },
        { x: 237, label: 'ROUTER' },
        { x: 422, label: 'AGENTS' },
        { x: 690, label: 'OUTPUTS' },
      ].map(col => (
        <text key={col.label} x={col.x} y="20" textAnchor="middle" fill="var(--ink-3)" style={{ fontSize: 10, fontFamily: 'var(--font-plex-mono)', letterSpacing: '0.09em' }}>
          {col.label}
        </text>
      ))}

      {/* inbound channels, gathered onto one bus */}
      {channels.map(row => (
        <g key={row.label}>
          <rect x="8" y={row.y} width="112" height="32" fill="var(--plate)" stroke="var(--rule)" strokeWidth="1" />
          <text x="64" y={row.y + 21} textAnchor="middle" fill="var(--ink-2)" style={{ fontSize: 11, fontFamily: 'var(--font-plex-sans)' }}>
            {row.label}
          </text>
          <line x1="120" y1={row.y + 16} x2="144" y2={row.y + 16} stroke="var(--ink-3)" strokeWidth="1" />
        </g>
      ))}
      <line x1="144" y1="57" x2="144" y2="183" stroke="var(--ink-3)" strokeWidth="1" />
      <line x1="144" y1="120" x2="176" y2="120" stroke="var(--ink-3)" strokeWidth="1" markerEnd="url(#wtr-tip)" />

      {/* router */}
      <rect x="178" y="88" width="118" height="64" fill="var(--ink)" />
      <text x="237" y="113" textAnchor="middle" fill="#ffffff" style={{ fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-plex-sans)' }}>
        Router
      </text>
      <text x="237" y="132" textAnchor="middle" fill="#b9bfc6" style={{ fontSize: 10, fontFamily: 'var(--font-plex-mono)' }}>
        sticky session
      </text>

      {/* the session store the router reads and writes */}
      <line x1="237" y1="152" x2="237" y2="174" stroke="var(--ink-3)" strokeWidth="1" markerEnd="url(#wtr-tip)" />
      <rect x="166" y="176" width="142" height="44" fill="none" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="4 3" />
      <text x="237" y="195" textAnchor="middle" fill="var(--ink-2)" style={{ fontSize: 11.5, fontWeight: 600, fontFamily: 'var(--font-plex-sans)' }}>
        Postgres
      </text>
      <text x="237" y="211" textAnchor="middle" fill="var(--ink-3)" style={{ fontSize: 9, fontFamily: 'var(--font-plex-mono)' }}>
        last agent per sender
      </text>

      {/* router out onto the dispatch bus */}
      <line x1="296" y1="120" x2="322" y2="120" stroke="var(--ink-3)" strokeWidth="1" />
      <line x1="322" y1="66" x2="322" y2="186" stroke="var(--ink-3)" strokeWidth="1" />
      {[66, 132, 186].map(y => (
        <line key={y} x1="322" y1={y} x2="350" y2={y} stroke="var(--ink-3)" strokeWidth="1" markerEnd="url(#wtr-tip)" />
      ))}

      {/* the largest piece of the platform */}
      <rect x="352" y="33" width="140" height="66" fill="var(--seal)" />
      <text x="422" y="58" textAnchor="middle" fill="#ffffff" style={{ fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-plex-sans)' }}>
        Scheduler agent
      </text>
      <text x="422" y="75" textAnchor="middle" fill="#f2cfd6" style={{ fontSize: 10, fontFamily: 'var(--font-plex-mono)' }}>
        seven workflows
      </text>
      <text x="422" y="90" textAnchor="middle" fill="#f2cfd6" style={{ fontSize: 10, fontFamily: 'var(--font-plex-mono)' }}>
        intake, slots, briefs
      </text>

      {/* the two smaller agents */}
      {[
        { y: 111, name: 'Researcher agent', sub: 'one workflow' },
        { y: 165, name: 'Marketing agent', sub: 'two workflows' },
      ].map(agent => (
        <g key={agent.name}>
          <rect x="352" y={agent.y} width="140" height="42" fill="var(--plate)" stroke="var(--rule)" strokeWidth="1" />
          <text x="422" y={agent.y + 18} textAnchor="middle" fill="var(--ink)" style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-plex-sans)' }}>
            {agent.name}
          </text>
          <text x="422" y={agent.y + 33} textAnchor="middle" fill="var(--ink-3)" style={{ fontSize: 10, fontFamily: 'var(--font-plex-mono)' }}>
            {agent.sub}
          </text>
        </g>
      ))}

      {/* agents out onto the delivery bus */}
      {[66, 132, 186].map(y => (
        <line key={y} x1="492" y1={y} x2="520" y2={y} stroke="var(--ink-3)" strokeWidth="1" />
      ))}
      <line x1="520" y1="57" x2="520" y2="186" stroke="var(--ink-3)" strokeWidth="1" />

      {/* outputs */}
      {outputs.map(row => (
        <g key={row.label}>
          <line x1="520" y1={row.y + 16} x2="626" y2={row.y + 16} stroke="var(--ink-3)" strokeWidth="1" markerEnd="url(#wtr-tip)" />
          <rect x="628" y={row.y} width="124" height="32" fill="none" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="4 3" />
          <text x="690" y={row.y + 21} textAnchor="middle" fill="var(--ink-2)" style={{ fontSize: 11, fontFamily: 'var(--font-plex-sans)' }}>
            {row.label}
          </text>
        </g>
      ))}

      {/* footnote rule and note */}
      <line x1="8" y1="248" x2="752" y2="248" stroke="var(--rule-2)" strokeWidth="1" />
      <text x="8" y="268" fill="var(--ink-3)" style={{ fontSize: 11, fontFamily: 'var(--font-plex-sans)' }}>
        The session is sticky per sender, so a follow-up message reaches whichever agent the user was last talking to rather than being re-routed.
      </text>
      <text x="8" y="285" fill="var(--ink-3)" style={{ fontSize: 11, fontFamily: 'var(--font-plex-sans)' }}>
        Ten workflows in total. The scheduler agent, marked in accent, is seven of them.
      </text>
    </svg>
  )
}
