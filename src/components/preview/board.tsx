import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function BoardPad({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <section className="section-band" aria-label={label}>
      <div className="board-pad">{children}</div>
    </section>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return <p className="notice">{children}</p>;
}
