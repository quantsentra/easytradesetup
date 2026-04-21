import FadeIn from '../ui/FadeIn'

const pains = [
  { num: '01', text: 'You watch charts for hours but never know the right time to enter.' },
  { num: '02', text: 'You enter too early or too late and get stopped out every time.' },
  { num: '03', text: "You've bought courses that gave theory but zero clear rules." },
  { num: '04', text: 'You are profitable some weeks, then give it all back the next.' },
]

export default function Pain() {
  return (
    <section className="py-20 sm:py-32 border-t border-[rgba(255,255,255,0.07)]">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">

        <FadeIn className="mb-14">
          <span className="label text-ink-faint">The Problem</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-[-0.03em]">Sound Familiar?</h2>
          <p className="mt-2 text-ink-muted text-[15px]">Every F&amp;O trader has been here.</p>
        </FadeIn>

        <div className="max-w-2xl">
          {pains.map(({ num, text }, i) => (
            <FadeIn key={num} delay={0.06 * i}>
              <div className={`flex items-start gap-8 py-6 ${i < pains.length - 1 ? 'border-b border-[rgba(255,255,255,0.07)]' : ''}`}>
                <span className="text-3xl font-black text-ink-faint/30 font-mono leading-none flex-shrink-0 w-10 pt-0.5">
                  {num}
                </span>
                <p className="text-[15px] text-ink-muted leading-[1.7]">{text}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3} className="mt-12">
          <div className="inline-flex items-center gap-3 border border-[rgba(255,255,255,0.08)] rounded-lg px-5 py-3 bg-bg-surface">
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-soft flex-shrink-0" />
            <p className="text-[13px] text-ink-muted">
              You don&apos;t need more knowledge.{' '}
              <span className="text-ink">You need a repeatable system.</span>
            </p>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
