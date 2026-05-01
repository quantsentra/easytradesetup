"use client";

import { useEffect, useState } from "react";

// Course-style interactive replacement for the static indicator-basics
// doc body. Native <details> drives the accordion (works without JS,
// keyboard-accessible, perfect on mobile). React state handles the
// "Got it" progress tracker (localStorage-persisted) and the end-of-
// course quiz.
//
// Constraints:
//   - Mobile-first: 44px+ tap targets, 16px base font (no iOS zoom)
//   - No external deps: zero animation libs, no chart embeds
//   - localStorage for progress (cross-device sync is post-launch)

const STORAGE_KEY = "ets_basics_progress_v1";

type Section = {
  id: string;
  title: string;
  emoji: string;
  intro: string;
  body: React.ReactNode;
};

const SECTIONS: Section[] = [
  {
    id: "overview",
    emoji: "✨",
    title: "What this indicator does for you",
    intro: "Keeps your chart honest. Plots only the four things every disciplined trader checks before clicking buy or sell.",
    body: (
      <>
        <p>The job of this indicator is to keep your chart honest. It plots only the four things every disciplined trader checks before clicking buy or sell — <strong>trend, key levels, momentum, traps</strong>. Nothing repaints. Nothing flashes alerts at you. You decide every trade.</p>
        <p>You will spend most of your time looking at four things: candle colour, Lifeline, Magnetic Zone, and Big Buyer / Seller boxes. Everything else is context.</p>
      </>
    ),
  },
  {
    id: "candles",
    emoji: "🕯️",
    title: "Candle colours — your one-glance read",
    intro: "Blue, Black, and Yellow each say something specific. Default green / red bars are just normal price action.",
    body: <CandleColours />,
  },
  {
    id: "lifeline",
    emoji: "📈",
    title: "The Lifeline — smart trend filter",
    intro: "A single line that traces dominant intraday trend. Use it as a one-glance bias filter.",
    body: (
      <>
        <p>Mathematically a McGinley Dynamic — smoother and more responsive than a regular EMA. Three states only:</p>
        <ul className="basics-list">
          <li><strong>Price above the Lifeline</strong> → up bias dominant. Look for buys, fade the sells.</li>
          <li><strong>Price below the Lifeline</strong> → down bias dominant. Look for sells, fade the buys.</li>
          <li><strong>Price chopping across</strong> → no clean bias. Stand aside or trade range setups only.</li>
        </ul>
      </>
    ),
  },
  {
    id: "magnetic",
    emoji: "🧲",
    title: "Daily Magnetic Zone (CPR)",
    intro: "Three purple lines locked at session start with a soft-pink fill. Where price gravitates on range days.",
    body: (
      <>
        <p>Three purple lines (Top Central, Pivot, Bottom Central) locked at session start. The pink-fill band between TC and BC reads <em>“Magnetic Zone”</em> because price gravitates here on range days.</p>
        <ul className="basics-list">
          <li><strong>Wide band</strong> → range day expected. Trade reversals at the edges.</li>
          <li><strong>Narrow band</strong> (TC and BC close together) → trend day setup. Breakouts above TC or below BC tend to continue.</li>
          <li>R1-R4 in red above, S1-S4 in green below. Inline price tags on the right edge — no need to hover.</li>
        </ul>
      </>
    ),
  },
  {
    id: "powermove",
    emoji: "⚡",
    title: "Power Move Zones (CD bands)",
    intro: "Two soft bands marked “Huge Selling Expected” / “Huge Buying Expected”. Statistical day-range exhaustion.",
    body: (
      <>
        <p>Two coloured bands above and below the day&apos;s open. Marked <strong>“Huge Selling Expected”</strong> at the top and <strong>“Huge Buying Expected”</strong> at the bottom. They mark the historical 5-day and 10-day Average Daily Range boundaries.</p>
        <ul className="basics-list">
          <li>Price reaching the top band → day&apos;s upside is statistically exhausted. Be careful with new longs.</li>
          <li>Price reaching the bottom band → mirror logic. Reversal trades start to make sense; new shorts get poor RR.</li>
          <li>The band is <em>context</em>, not a signal. Combine with regime + candle colour before acting.</li>
        </ul>
      </>
    ),
  },
  {
    id: "signals",
    emoji: "🎯",
    title: "Buy / Sell signals — B and S labels",
    intro: "Trend-line break detector. Bar-close confirmed only — no mid-bar repaints.",
    body: (
      <>
        <p>When price breaks above a recent down-trendline, a green <strong>“B”</strong> label drops at the breakout. Below an up-trendline, a red <strong>“S”</strong> label.</p>
        <ul className="basics-list">
          <li>Use the label as an <em>alert</em>, not an order. Confirm with regime + Lifeline before entering.</li>
          <li>Best signals: B in clear up-regime, near a Magnetic Zone or Big Buyer level. S is the mirror.</li>
          <li>Filter: skip B/S signals on the same bar a Yellow trap candle fires — that bar is warning of a reversal.</li>
        </ul>
      </>
    ),
  },
  {
    id: "traps",
    emoji: "⚠️",
    title: "Trap Alerts — the yellow “!” flag",
    intro: "Volume divergence. Body went one way, micro-volume went the other. Three valid responses.",
    body: (
      <>
        <p>A yellow “!” flag above a candle = volume divergence. The body went one way but the dominant micro-volume went the other. The indicator&apos;s most important warning signal. Three valid responses:</p>
        <ul className="basics-list">
          <li><strong>Already in a trade?</strong> Tighten stop to break-even or trail it. Market may flip.</li>
          <li><strong>About to enter?</strong> Wait one more bar. If it prints opposite, bias is shifting.</li>
          <li><strong>Flat?</strong> Note the price level. Reversal trades from this point have higher hit rates than continuations.</li>
        </ul>
      </>
    ),
  },
  {
    id: "zones",
    emoji: "📦",
    title: "Big Buyer / Big Seller Zones",
    intro: "Pink and green boxes at recent swing highs and lows. Where the orders cluster.",
    body: (
      <>
        <p>Soft pink boxes mark <em>resistance</em> — where the market last sold off from. Soft green boxes mark <em>support</em> — where it last rallied from.</p>
        <p>When price returns to one of these zones, it usually reacts. Look for B / S signals or yellow trap candles AT a Big Buyer or Big Seller zone — those <strong>confluence trades</strong> are the cleanest setups in the playbook.</p>
      </>
    ),
  },
  {
    id: "htf",
    emoji: "🗓️",
    title: "Higher-timeframe levels",
    intro: "PDH, PDL, PWH, PWL, PMH, PML. The levels every desk has marked.",
    body: (
      <>
        <p>Dashed blue lines at:</p>
        <ul className="basics-list">
          <li><strong>PDH / PDL</strong> — previous day&apos;s high / low. Intraday support and resistance.</li>
          <li><strong>PWH / PWL</strong> — previous week. Swing-level, dominant on Mondays.</li>
          <li><strong>PMH / PML</strong> — previous month. Position-level. React there because every desk has them marked.</li>
        </ul>
      </>
    ),
  },
  {
    id: "decision",
    emoji: "🧭",
    title: "The 30-second decision tree",
    intro: "Read every chart in five steps. Three or more aligned = high-quality setup.",
    body: (
      <>
        <ol className="basics-list">
          <li>Where is price relative to the Lifeline? Up bias or down bias.</li>
          <li>Inside, above, or below the Magnetic Zone? Range or trend day signal.</li>
          <li>Near a Big Buyer / Big Seller / PDH / PDL? Are the orders nearby?</li>
          <li>What colour is the most recent candle? Aggressive flow or warning.</li>
          <li>Has a B / S signal fired? A yellow flag? Confirmation or wait.</li>
        </ol>
        <p>Three or more aligned = high-quality setup. Two aligned = decent. One alone = stand aside.</p>
      </>
    ),
  },
  {
    id: "profile",
    emoji: "🎚️",
    title: "Recommended Setup Profile to start",
    intro: "Pick Beginner for the first two weeks. Don't enable everything on day one.",
    body: (
      <>
        <p>The very first dropdown in indicator settings is <strong>🎯 Setup Profile</strong>. Pick <strong>Beginner</strong> for your first two weeks. It shows only Lifeline, candle colours, Buy/Sell signals, and the legend.</p>
        <p>Once those are second-nature, switch to <strong>Pro</strong> to unlock zones and higher-timeframe levels. Don&apos;t enable everything on day one — you will drown in lines.</p>
      </>
    ),
  },
];

const QUIZ: Array<{ q: string; options: string[]; correct: number; explain: string }> = [
  {
    q: "Which candle is the indicator's strongest warning of a possible reversal?",
    options: ["Blue", "Black", "Yellow", "Default green / red"],
    correct: 2,
    explain: "Yellow = volume divergence. Body went one way, micro-volume went the other. Treat as a trap signal — tighten SL or wait one bar.",
  },
  {
    q: "On a wide Magnetic Zone day, what does the band most likely indicate?",
    options: ["Trend day — breakouts continue", "Range day — fade the edges", "Volatility crash", "News event imminent"],
    correct: 1,
    explain: "Wide band = range day expected. Price gravitates inside the band; reversals at the TC / BC edges are the cleanest setups.",
  },
  {
    q: "A B / S signal fires on the SAME bar as a Yellow trap flag. What's the right call?",
    options: [
      "Take the B / S immediately",
      "Skip — the trap signal overrides",
      "Take half size",
      "Reverse direction",
    ],
    correct: 1,
    explain: "Yellow has the highest precedence. The bar is warning a reversal — taking the B / S on this bar usually catches the trap, not the move.",
  },
];

export default function IndicatorBasicsCourse() {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data?.progress) setProgress(data.progress);
        if (data?.quizAnswers) setQuizAnswers(data.quizAnswers);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function persist(next: { progress?: typeof progress; quizAnswers?: typeof quizAnswers }) {
    const payload = {
      progress: next.progress ?? progress,
      quizAnswers: next.quizAnswers ?? quizAnswers,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }

  function markRead(id: string) {
    const next = { ...progress, [id]: !progress[id] };
    setProgress(next);
    persist({ progress: next });
  }

  function answerQuiz(idx: number, choice: number) {
    if (quizAnswers[idx] !== undefined) return; // lock once answered
    const next = { ...quizAnswers, [idx]: choice };
    setQuizAnswers(next);
    persist({ quizAnswers: next });
  }

  const completedSections = Object.values(progress).filter(Boolean).length;
  const totalSections = SECTIONS.length;
  const pct = Math.round((completedSections / totalSections) * 100);

  return (
    <div className="basics-course">
      {/* Progress strip */}
      <div className="basics-progress">
        <div className="basics-progress-row">
          <span className="basics-progress-label">Your progress</span>
          <span className="basics-progress-count">
            {hydrated ? `${completedSections} / ${totalSections} sections` : `${totalSections} sections`}
          </span>
        </div>
        <div className="basics-progress-bar">
          <div
            className="basics-progress-fill"
            style={{ width: hydrated ? `${pct}%` : "0%" }}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="basics-sections">
        {SECTIONS.map((s, i) => {
          const isRead = !!progress[s.id];
          return (
            <details
              key={s.id}
              open={i === 0}
              className={`basics-section${isRead ? " is-read" : ""}`}
            >
              <summary className="basics-summary">
                <span className="basics-emoji" aria-hidden>
                  {s.emoji}
                </span>
                <span className="basics-title">
                  <span className="basics-title-text">{s.title}</span>
                  <span className="basics-intro">{s.intro}</span>
                </span>
                <span className="basics-state" aria-hidden>
                  {isRead ? "✓" : "›"}
                </span>
              </summary>
              <div className="basics-body">
                {s.body}
                <button
                  type="button"
                  onClick={() => markRead(s.id)}
                  className={`basics-mark-btn${isRead ? " is-read" : ""}`}
                >
                  {isRead ? "Mark as unread" : "Got it ✓"}
                </button>
              </div>
            </details>
          );
        })}
      </div>

      {/* Quiz */}
      <section className="basics-quiz">
        <header>
          <h3>Quick check — 3 questions</h3>
          <p>No score, no gamification. Just a quick reality-check before you start trading.</p>
        </header>
        <div className="basics-quiz-questions">
          {QUIZ.map((q, i) => {
            const answered = quizAnswers[i] !== undefined;
            const userChoice = quizAnswers[i];
            return (
              <div key={i} className="basics-quiz-card">
                <div className="basics-quiz-q">
                  <span className="basics-quiz-num">{i + 1}</span>
                  <span>{q.q}</span>
                </div>
                <div className="basics-quiz-options">
                  {q.options.map((opt, j) => {
                    const isCorrect = j === q.correct;
                    const isUser = userChoice === j;
                    let cls = "basics-quiz-opt";
                    if (answered) {
                      if (isCorrect) cls += " is-correct";
                      else if (isUser) cls += " is-wrong";
                      else cls += " is-faded";
                    }
                    return (
                      <button
                        key={j}
                        type="button"
                        onClick={() => answerQuiz(i, j)}
                        disabled={answered}
                        className={cls}
                      >
                        <span className="basics-quiz-opt-letter">
                          {String.fromCharCode(65 + j)}
                        </span>
                        <span className="basics-quiz-opt-text">{opt}</span>
                        {answered && isCorrect && (
                          <span aria-hidden className="basics-quiz-opt-mark">
                            ✓
                          </span>
                        )}
                        {answered && isUser && !isCorrect && (
                          <span aria-hidden className="basics-quiz-opt-mark">
                            ✗
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <div className="basics-quiz-explain">
                    {userChoice === q.correct ? "Correct. " : "Not quite. "}
                    {q.explain}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CandleColours() {
  const rows: Array<{ swatch: string; name: string; meaning: string; note: string }> = [
    {
      swatch: "#5e7eff",
      name: "Blue (light periwinkle)",
      meaning: "Aggressive Buying.",
      note: "Body covers most of the bar's true range and closed up. Buyers stepped in with conviction. Confirms up bias.",
    },
    {
      swatch: "#2c2c2c",
      name: "Black (dark gray)",
      meaning: "Aggressive Selling.",
      note: "Mirror of blue. Sellers in control on this bar. Confirms down bias.",
    },
    {
      swatch: "#FFC107",
      name: "Yellow",
      meaning: "Careful candle — possible trap.",
      note: "Volume context contradicts the body direction. Tighten stop. Slow down. Market may be about to reverse.",
    },
    {
      swatch: "transparent",
      name: "Default green / red",
      meaning: "Ordinary bar.",
      note: "No special signal. Read context from the rest of the indicator.",
    },
  ];

  return (
    <div className="basics-candles">
      <p>Each bar&apos;s colour is a quick read:</p>
      <div className="basics-candle-rows">
        {rows.map((r) => (
          <div key={r.name} className="basics-candle-row">
            <div
              className="basics-candle-swatch"
              style={{
                background: r.swatch === "transparent" ? "transparent" : r.swatch,
                border:
                  r.swatch === "transparent"
                    ? "1.5px dashed var(--tz-rule, #d0d4dc)"
                    : "1px solid rgba(0,0,0,0.08)",
              }}
              aria-hidden
            />
            <div className="basics-candle-text">
              <div className="basics-candle-head">
                <strong>{r.name}</strong>
                <span> — {r.meaning}</span>
              </div>
              <p className="basics-candle-note">{r.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
