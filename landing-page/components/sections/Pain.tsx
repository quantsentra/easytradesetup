import FadeIn from '../ui/FadeIn'

const pains = [
  { num: '01', text: 'You watch charts for hours but never know the right time to enter.' },
  { num: '02', text: 'You enter too early or too late and get stopped out every time.' },
  { num: '03', text: "You've bought courses that gave theory but zero clear rules." },
  { num: '04', text: 'You are profitable some weeks, then give it all back the next.' },
]

export default function Pain() {
  return (
    <section className="py-14 sm:py-24 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 aurora-blue opacity-60 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-accent-red/70 mb-3">The Problem</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Sound Familiar?</h2>
          <p className="mt-3 text-ink-muted">Every F&amp;O trader has been here.</p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {pains.map(({ num, text }, i) => (
            <FadeIn key={num} delay={0.08 + i * 0.08}>
              <div className="glass rounded-xl p-5 flex gap-4 items-start group
                hover:border-accent-red/25 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-accent-red/5
                transition-all duration-300 cursor-default h-full">
                <span className="text-3xl font-black text-accent-red/15 leading-none flex-shrink-0 font-mono
                  group-hover:text-accent-red/35 transition-colors duration-300 mt-0.5">{num}</span>
                <p className="text-ink-muted text-sm leading-relaxed pt-1">{text}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.42} className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 glass rounded-full px-6 py-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse-soft" />
            <p className="text-sm font-medium text-ink">
              You don&apos;t need more knowledge.{' '}
              <span className="text-accent-blue">You need a repeatable system.</span>
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
