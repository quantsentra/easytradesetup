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
    <div className="relative overflow-hidden hairline-t hairline-b bg-surface py-2.5">
      <style>{`
        @keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-track { animation: ticker-scroll 40s linear infinite; }
      `}</style>
      <div className="ticker-track flex gap-10 whitespace-nowrap">
        {doubled.map((it, i) => {
          const up = it.chg.startsWith("+");
          return (
            <div key={i} className="flex items-center gap-2 text-micro">
              <span className="text-muted-faint">{it.sym}</span>
              <span className="text-ink tabular-nums">{it.px}</span>
              <span className={up ? "text-[#2da44e]" : "text-[#d13438]"}>{it.chg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
