import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ink" | "ghost" | "danger" | "secondary" | "onDark" | "outlineLight";

const variants: Record<Variant, string> = {
  primary: "btn btn-primary",
  ink: "btn btn-primary",
  ghost: "btn btn-ghost",
  danger: "btn btn-danger",
  secondary: "btn btn-secondary",
  onDark: "btn btn-on-dark",
  outlineLight: "btn btn-outline-light",
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
  required,
}: {
  label: string;
  name: string;
  children: ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required ? <span className="req"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

export const inputClass = "";
