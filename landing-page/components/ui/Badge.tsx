import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tone?: "default" | "blue" | "muted";
  className?: string;
};

export default function Badge({ children, tone = "default", className = "" }: Props) {
  const tones: Record<string, string> = {
    default: "bg-surface-alt text-ink",
    blue: "bg-blue/10 text-blue-link",
    muted: "bg-page text-muted",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-micro font-medium tracking-tight ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
