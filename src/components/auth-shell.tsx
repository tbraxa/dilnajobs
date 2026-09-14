import type { ReactNode } from "react";

export function AuthShell({
  title,
  note,
  children,
  wide,
  footer,
}: {
  title: string;
  note?: string;
  children: ReactNode;
  wide?: boolean;
  footer?: ReactNode;
}) {
  return (
    <main className="auth-page">
      <div className={`auth-card ${wide ? "auth-card-wide" : "auth-card-narrow"}`}>
        <h1>{title}</h1>
        {note ? <p className="sub">{note}</p> : null}
        {children}
        {footer}
      </div>
    </main>
  );
}
