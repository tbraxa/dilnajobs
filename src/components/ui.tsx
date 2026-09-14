import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ink" | "accent" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper-0 hover:bg-black border border-ink",
  ink: "bg-ink text-paper-0 hover:bg-black border border-ink",
  accent: "bg-accent text-white hover:bg-accent-hover border border-accent hover:border-accent-hover",
  ghost: "bg-transparent text-ink border border-line hover:bg-paper",
  danger: "bg-danger text-white hover:bg-black border border-danger",
};

const btn =
  "inline-flex items-center justify-center gap-2 rounded-none px-4 py-2.5 text-sm font-semibold tracking-wide disabled:opacity-50";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={`${btn} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${btn} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Field({
  label,
  name,
  children,
  hint,
}: {
  label: string;
  name: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5" htmlFor={name}>
      <span className="label">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-steel">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-none border border-line bg-paper-0 px-3 py-2.5 text-ink outline-none placeholder:text-steel-2 focus:border-ink";
