// Founder welcome note — single one-time read for new buyers.
// Replaces the old "daily market notes" framing. Static server component,
// no interactivity needed; the value is the path itself, plainly stated.

const STEPS: Array<{
  n: string;
  title: string;
  body: string;
  emoji: string;
}> = [
  {
    n: "01",
    emoji: "📥",
    title: "Install it · ~90 seconds",
    body: "Copy the Pine v5 source from your portal Downloads page and add it to any TradingView chart. The install guide walks you through every click.",
  },
  {
    n: "02",
    emoji: "🎓",
    title: "Take the course + quiz · ~30 minutes",
    body: "Eleven mobile-friendly lessons explain every line, zone, color and signal on your chart. End with a short quiz. Don't skip — every trade decision later assumes you know this.",
  },
  {
    n: "03",
    emoji: "📚",
    title: "Study the strategies · one evening",
    body: "Each setup page in your portal walks through the logic, the entry, the stop, the target, and the failure mode. Read them all. Don't memorize — internalize.",
  },
  {
    n: "04",
    emoji: "🧪",
    title: "Demo trade for one week",
    body: "No exceptions. One week, paper account, zero capital at risk. Take every signal that fits a setup. Yes, even when it feels obvious. Especially then.",
  },
  {
    n: "05",
    emoji: "🧩",
    title: "Find your combination",
    body: "The indicator has multiple layers. Some traders thrive on regime + structure. Others need supply zones first. Test combinations against your style. There's no \"right\" stack — only what survives your psychology.",
  },
  {
    n: "06",
    emoji: "💼",
    title: "Trade small first",
    body: "One contract. Minimum lots. Real capital, but small enough that the loss doesn't sting. Build a journal. Track R-multiples, not P&L. When the math compounds, scale.",
  },
];

export default function FounderWelcome() {
  return (
    <div className="founder-welcome">
      {/* Hero */}
      <div className="fw-hero">
        <span className="fw-eyebrow">
          <span className="fw-eyebrow-dot" />
          A note from the founder
        </span>
        <h1 className="fw-title">
          Welcome to <span className="fw-grad">Golden Indicator.</span>
        </h1>
        <div className="fw-intro">
          <p>
            Most trading tools fail you at the same place: they hand you a script and walk away.
            Charts get noisy. Signals contradict. You hesitate at the edge of every entry —
            <em> was that a real setup or just a candle that looked like one?</em>
          </p>
          <p>
            Golden Indicator was built to fix that. <strong>One pane. One read.</strong>
            {" "}Trend regime, key levels, supply zones, and momentum — stitched into a single
            decision layer that calculates on bar close. No repaint. No magic. No promise of
            profit.
          </p>
          <p className="fw-intro-emph">
            But a tool is only as good as the trader holding it. So before you risk real
            capital, follow this path:
          </p>
        </div>
      </div>

      {/* Flow */}
      <ol className="fw-flow" aria-label="6-step onboarding path">
        {STEPS.map((s) => (
          <li key={s.n} className="fw-step">
            <div className="fw-step-rail" aria-hidden>
              <span className="fw-step-num">{s.n}</span>
            </div>
            <div className="fw-step-card">
              <div className="fw-step-head">
                <span className="fw-step-emoji" aria-hidden>{s.emoji}</span>
                <h3 className="fw-step-title">{s.title}</h3>
              </div>
              <p className="fw-step-body">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Closing */}
      <div className="fw-closing">
        <p className="fw-closing-line">
          No shortcut. No quick path to consistency. Traders who follow this sequence end up
          <em> reading</em> the chart, not chasing it.
        </p>
        <p className="fw-closing-line">
          Stuck on anything — install error, weird output, a signal you can't read?{" "}
          Open a support ticket. I read every one.
        </p>
        <div className="fw-sign">
          <div className="fw-sign-mark" aria-hidden>—</div>
          <div>
            <div className="fw-sign-name">Thomas</div>
            <div className="fw-sign-role">Founder · EasyTradeSetup</div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="fw-ctas">
        <a href="/portal/downloads" className="fw-cta fw-cta-primary">
          <span>Get the indicator</span>
          <span aria-hidden>→</span>
        </a>
        <a href="/portal/docs/indicator-basics" className="fw-cta fw-cta-ghost">
          <span>Start the course</span>
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
