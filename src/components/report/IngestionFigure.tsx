/*
 * Figure 3.1. An architecture diagram, which the report guidelines explicitly
 * encourage. This is a technical figure, not a decorative illustration and not a
 * simulated screenshot. The owned component is the only element carrying the accent.
 */
export function IngestionFigure() {
  return (
    <svg viewBox="0 0 760 250" className="h-auto w-full" role="img" aria-label="Carrier systems publish shipment status events into an event queue, which may contain duplicates. The queue feeds a deduplication layer keyed on an idempotency key. The deduplication layer writes one row per event to the event store, which serves the public API to customers.">
      <defs>
        <marker id="wtr-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="var(--ink-3)" />
        </marker>
      </defs>

      {/* zone label for the owned work */}
      <rect x="330" y="30" width="132" height="152" fill="none" stroke="var(--seal)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <text x="396" y="22" textAnchor="middle" fill="var(--seal)" style={{ fontSize: 10, fontFamily: 'var(--font-plex-mono)', letterSpacing: '0.09em' }}>
        SCOPE OF THIS TERM
      </text>

      {/* carriers */}
      {[
        { y: 46, label: 'Carrier A' },
        { y: 92, label: 'Carrier B' },
        { y: 138, label: 'Carrier C' },
      ].map(row => (
        <g key={row.label}>
          <rect x="8" y={row.y} width="118" height="34" fill="var(--plate)" stroke="var(--rule)" strokeWidth="1" />
          <text x="67" y={row.y + 22} textAnchor="middle" fill="var(--ink-2)" style={{ fontSize: 11.5, fontFamily: 'var(--font-plex-sans)' }}>
            {row.label}
          </text>
          <line x1="126" y1={row.y + 17} x2="188" y2={row.y + 17} stroke="var(--ink-3)" strokeWidth="1" markerEnd="url(#wtr-tip)" />
        </g>
      ))}

      {/* queue */}
      <rect x="190" y="62" width="116" height="94" fill="var(--plate)" stroke="var(--rule)" strokeWidth="1" />
      <text x="248" y="98" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-plex-sans)' }}>
        Event queue
      </text>
      <text x="248" y="118" textAnchor="middle" fill="var(--ink-3)" style={{ fontSize: 10.5, fontFamily: 'var(--font-plex-mono)' }}>
        duplicates present
      </text>
      <line x1="306" y1="109" x2="342" y2="109" stroke="var(--ink-3)" strokeWidth="1" markerEnd="url(#wtr-tip)" />

      {/* the owned component */}
      <rect x="344" y="62" width="104" height="94" fill="var(--ink)" />
      <text x="396" y="96" textAnchor="middle" fill="#ffffff" style={{ fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-plex-sans)' }}>
        Dedup layer
      </text>
      <text x="396" y="115" textAnchor="middle" fill="#b9bfc6" style={{ fontSize: 10, fontFamily: 'var(--font-plex-mono)' }}>
        idempotency
      </text>
      <text x="396" y="129" textAnchor="middle" fill="#b9bfc6" style={{ fontSize: 10, fontFamily: 'var(--font-plex-mono)' }}>
        key
      </text>
      <line x1="448" y1="109" x2="486" y2="109" stroke="var(--ink-3)" strokeWidth="1" markerEnd="url(#wtr-tip)" />

      {/* store */}
      <rect x="488" y="62" width="116" height="94" fill="var(--plate)" stroke="var(--rule)" strokeWidth="1" />
      <text x="546" y="98" textAnchor="middle" fill="var(--ink)" style={{ fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-plex-sans)' }}>
        Event store
      </text>
      <text x="546" y="118" textAnchor="middle" fill="var(--ink-3)" style={{ fontSize: 10.5, fontFamily: 'var(--font-plex-mono)' }}>
        one row per event
      </text>
      <line x1="604" y1="109" x2="640" y2="109" stroke="var(--ink-3)" strokeWidth="1" markerEnd="url(#wtr-tip)" />

      {/* public api */}
      <rect x="642" y="62" width="110" height="94" fill="none" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="4 3" />
      <text x="697" y="98" textAnchor="middle" fill="var(--ink-2)" style={{ fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-plex-sans)' }}>
        Public API
      </text>
      <text x="697" y="118" textAnchor="middle" fill="var(--ink-3)" style={{ fontSize: 10.5, fontFamily: 'var(--font-plex-mono)' }}>
        customers
      </text>

      {/* footnote rule and note */}
      <line x1="8" y1="204" x2="752" y2="204" stroke="var(--rule-2)" strokeWidth="1" />
      <text x="8" y="224" fill="var(--ink-3)" style={{ fontSize: 11, fontFamily: 'var(--font-plex-sans)' }}>
        Before this term, a resent status event was stored again, and a shipment appeared to change state on its own.
      </text>
    </svg>
  )
}
