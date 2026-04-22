import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tone?: "default" | "blue" | "muted";
  className?: string;
};

export default function Badge({ children, tone = "default", className = "" }: Props) {
  const tones: Record<string, string> = {
    default: "bg-white/5 text-ink border border-rule-2",
    blue:    "bg-blue/15 text-cyan border border-blue/30",
    muted:   "bg-bg-2 text-ink-60 border border-rule",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-nano font-semibold uppercase tracking-widest ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
