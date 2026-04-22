import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "dark" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "text-caption px-3 py-1.5",
  md: "text-[14px] px-4 py-2",
  lg: "text-[15px] px-6 py-3",
};

const variants: Record<Variant, string> = {
  primary: "btn btn-primary",
  dark:    "btn bg-panel text-ink border border-rule-2 hover:border-rule-3",
  ghost:   "btn btn-ghost",
  outline: "btn btn-outline",
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
  const cls = `${variants[variant]} ${sizes[size]} ${className}`.trim();
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
