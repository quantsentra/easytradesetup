import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "dark" | "pill" | "pill-solid" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-1 font-text transition-all whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-blue text-white hover:brightness-110 rounded-lg",
  dark: "bg-ink text-white hover:brightness-110 rounded-lg",
  pill: "text-blue-link border border-blue-link hover:bg-blue-link/5 rounded-pill",
  "pill-solid": "bg-blue text-white hover:brightness-110 rounded-pill",
  ghost: "text-blue-link hover:underline underline-offset-2",
};

const sizes: Record<Size, string> = {
  sm: "text-caption px-3 py-1.5",
  md: "text-body px-4 py-2",
  lg: "text-body px-6 py-3",
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
