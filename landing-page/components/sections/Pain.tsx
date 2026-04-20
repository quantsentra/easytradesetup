import FadeIn from '../ui/FadeIn'

const pains = [
  'You watch charts for hours but never know the right time to enter.',
  'You enter too early or too late and get stopped out every time.',
  "You've bought courses that gave theory but zero clear rules.",
  'You are profitable some weeks, then give it all back the next.',
]

export default function Pain() {
  return (
    <section className="py-14 sm:py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Sound Familiar?</h2>
          <p className="mt-3 text-ink-muted">Every F&amp;O trader has been here.</p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {pains.map((pain, i) => (
            <FadeIn key={pain} delay={0.1 + i * 0.09}>
              <div className="flex gap-3 items-start bg-bg-surface border border-border rounded-card p-5 group
                hover:border-accent-red/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-accent-red/5
                transition-all duration-300 cursor-default">
                <span className="mt-0.5 text-accent-red font-bold text-lg leading-none flex-shrink-0
                  group-hover:scale-110 transition-transform duration-200">✕</span>
                <p className="text-ink-muted text-sm leading-relaxed">{pain}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.45} className="mt-10 text-center">
          <p className="text-base font-semibold text-ink">
            You don&apos;t need more knowledge.{' '}
            <span className="text-accent-blue">You need a repeatable system.</span>
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
