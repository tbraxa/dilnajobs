import Link from "next/link";
import type { ReactNode } from "react";
import { ConsoleTop } from "@/components/site-chrome";

export type RailItem = { href: string; label: string; active?: boolean };

export function ConsoleShell({
  topActions,
  railLabel,
  railItems,
  railFoot,
  children,
}: {
  topActions?: ReactNode;
  railLabel: string;
  railItems: RailItem[];
  railFoot?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <ConsoleTop>{topActions}</ConsoleTop>
      <div className="shell">
        <aside className="rail" aria-label={railLabel}>
          <p className="label">{railLabel}</p>
          {railItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={item.active ? "active" : undefined}
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          {railFoot ? <div className="rail-foot">{railFoot}</div> : null}
        </aside>
        <main className="main" id="main">
          {children}
        </main>
      </div>
    </>
  );
}
