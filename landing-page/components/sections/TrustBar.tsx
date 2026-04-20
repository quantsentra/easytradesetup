const items = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <path d="M8 1.5L2 4v4c0 3.31 2.58 6.41 6 7 3.42-.59 6-3.69 6-7V4L8 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M5.5 8l1.5 1.5L10.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: '3-Confirmation System',
    sub: 'All 3 must agree',
    color: 'text-accent-blue',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    label: '15-Min Timeframe',
    sub: 'Nifty & BankNifty',
    color: 'text-accent-green',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M6 9l1.5 1.5L10 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Rule-Based Entry',
    sub: 'Zero interpretation',
    color: 'text-accent-orange',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
        <path d="M8 2C5 2 2 5 2 8s3 6 6 6 6-3 6-6-3-6-6-6z" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 5v3l2 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M5.5 2.5l-2-1.5M10.5 2.5l2-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    label: 'NSE-Only Focus',
    sub: 'Built for India',
    color: 'text-accent-blue',
  },
]

export default function TrustBar() {
  return (
    <section className="border-y border-border bg-bg-surface/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
          {items.map(({ icon, label, sub, color }) => (
            <div key={label} className="flex items-center gap-2.5 px-4 first:pl-0 last:pr-0 py-2">
              <span className={color}>{icon}</span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-ink truncate">{label}</div>
                <div className="text-[10px] text-ink-faint truncate">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
