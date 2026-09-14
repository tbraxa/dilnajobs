import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ink" | "accent" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "btn btn-primary",
  ink: "btn btn-primary",
  accent: "btn btn-primary",
  ghost: "btn btn-ghost",
  danger: "btn btn-primary",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={`${variants[variant]} ${className}`.trim()} {...props}>
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
    <Link href={href} className={`${variants[variant]} ${className}`.trim()}>
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
    <div className="form-group">
      <label htmlFor={name}>
        {label}
        {hint ? <span className="opt"> ({hint})</span> : null}
      </label>
      {children}
    </div>
  );
}

export const inputClass = "";
