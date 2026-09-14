import type { ReactNode } from "react";

export function AuthShell({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <main className="auth">
      <h1>{title}</h1>
      {note ? <p className="note">{note}</p> : null}
      {children}
    </main>
  );
}
