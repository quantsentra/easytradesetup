import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tone?: "default" | "gold" | "signal";
  className?: string;
};

export default function Badge({ children, tone = "default", className = "" }: Props) {
  const tones: Record<string, string> = {
    default: "bg-ink-card border-ink-border text-cream-muted",
    gold: "bg-gold/10 border-gold/30 text-gold",
    signal: "bg-signal-up/10 border-signal-up/30 text-signal-up",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-mono ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
