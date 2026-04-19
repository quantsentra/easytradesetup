const pains = [
  'You watch charts for hours but never know the right time to enter.',
  'You enter too early or too late and get stopped out every time.',
  "You've bought courses that gave theory but zero clear rules.",
  'You are profitable some weeks, then give it all back the next.',
]

export default function Pain() {
  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Sound Familiar?</h2>
          <p className="mt-3 text-ink-muted">Every F&amp;O trader has been here.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {pains.map((pain) => (
            <div
              key={pain}
              className="flex gap-3 items-start bg-bg-surface border border-border rounded-card p-5 hover:border-accent-red/30 transition-colors duration-200"
            >
              <span className="mt-0.5 text-accent-red font-bold text-lg leading-none flex-shrink-0">✕</span>
              <p className="text-ink-muted text-sm leading-relaxed">{pain}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-base font-semibold text-ink">
          You don&apos;t need more knowledge.{' '}
          <span className="text-accent-blue">You need a repeatable system.</span>
        </p>
      </div>
    </section>
  )
}
