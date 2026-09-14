import type { ReactNode } from "react";

export function AuthShell({
  eyebrow,
  heading,
  bullets,
  children,
}: {
  eyebrow: string;
  heading: string;
  bullets: string[];
  children: ReactNode;
}) {
  return (
    <main className="auth-shell">
      <div className="auth-layout">
        <aside className="auth-trust">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{heading}</h1>
          <ul>
            {bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
        <div className="auth-stack">{children}</div>
      </div>
    </main>
  );
}
