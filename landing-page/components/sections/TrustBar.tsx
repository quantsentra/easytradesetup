const items = [
  { label: '3-Confirmation System', sub: 'All signals must agree' },
  { label: '15-Min Timeframe',      sub: 'Nifty & BankNifty' },
  { label: 'Rule-Based Entry',      sub: 'Zero interpretation' },
  { label: 'Built for NSE',         sub: 'India-focused setup' },
]

export default function TrustBar() {
  return (
    <section className="border-y border-line bg-subtle">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-2.5">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-line">
          {items.map(({ label, sub }) => (
            <div key={label} className="px-4 py-3 text-center">
              <div className="text-[12px] font-semibold text-ink">{label}</div>
              <div className="text-[11px] text-ink-faint mt-0.5 font-mono">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
