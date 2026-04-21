import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-all duration-200 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-cream text-ink hover:bg-gold",
  secondary: "bg-ink-card text-cream border border-ink-border hover:border-cream/40",
  ghost: "text-cream-muted hover:text-cream",
  gold: "bg-gold-gradient text-ink hover:brightness-110 shadow-[0_0_40px_-10px_rgba(240,192,90,0.5)]",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-6 py-3",
};

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<"button">, "children" | "className">;

export default function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  ...rest
}: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
