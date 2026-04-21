const items = [
  { sym: "NIFTY 50", px: "24,852.15", chg: "+0.42%" },
  { sym: "BANKNIFTY", px: "54,210.80", chg: "-0.18%" },
  { sym: "FINNIFTY", px: "25,430.55", chg: "+0.31%" },
  { sym: "RELIANCE", px: "2,945.20", chg: "+1.12%" },
  { sym: "HDFC BANK", px: "1,712.45", chg: "-0.22%" },
  { sym: "TCS", px: "4,128.90", chg: "+0.65%" },
  { sym: "INFY", px: "1,892.30", chg: "+0.88%" },
  { sym: "ICICIBANK", px: "1,245.60", chg: "+0.14%" },
];

export default function Ticker() {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-ink-border bg-ink-soft/40 py-3 mask-fade-r">
      <div className="flex gap-10 animate-ticker whitespace-nowrap">
        {doubled.map((it, i) => {
          const up = it.chg.startsWith("+");
          return (
            <div key={i} className="flex items-center gap-2.5 font-mono text-xs">
              <span className="text-cream-dim">{it.sym}</span>
              <span className="number-mono text-cream">{it.px}</span>
              <span className={up ? "text-signal-up" : "text-signal-down"}>{it.chg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
