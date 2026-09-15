import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ink" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "border border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700",
  ink: "border border-slate-950 bg-slate-950 text-white hover:bg-black",
  ghost: "border border-slate-300 bg-transparent text-slate-950 hover:bg-slate-50",
  danger: "border border-red-700 bg-red-700 text-white hover:bg-red-900",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[2px] px-4 py-2.5 text-sm font-semibold tracking-wide disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
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
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-[2px] px-4 py-2.5 text-sm font-semibold tracking-wide ${variants[variant]} ${className}`}
    >
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
      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-slate-600">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-950 placeholder:text-slate-400";
