import type { ReactNode } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import { FairJobsLockup } from "@/components/fairjobs-brand";

export type EmployerConsoleSection = "overview" | "jobs" | "candidates" | "settings";

const navigation = [
  { id: "overview", label: "Přehled", icon: "home" },
  { id: "jobs", label: "Nabídky", icon: "jobs" },
  { id: "candidates", label: "Kandidáti", icon: "people" },
  { id: "settings", label: "Nastavení", icon: "settings" },
] as const;

function ConsoleIcon({ name }: { name: string }) {
  if (name === "jobs") {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 5.5h12v11H4zM7 5.5V3.8h6v1.7M7 9h6M7 12h4" /></svg>;
  }
  if (name === "people") {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8" cy="7" r="3" /><path d="M2.8 16c.5-3.2 2.2-4.8 5.2-4.8s4.7 1.6 5.2 4.8M13 6.2a2.5 2.5 0 0 1 0 4.7M14.2 12c1.8.5 2.8 1.8 3.1 4" /></svg>;
  }
  if (name === "settings") {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3" /><path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4" /></svg>;
  }
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m3 9 7-6 7 6v8H5V9M8 17v-5h4v5" /></svg>;
}

function sectionHref(section: EmployerConsoleSection, demo: boolean) {
  if (demo) return `/firma/demo?sekce=${section === "overview" ? "prehled" : section === "jobs" ? "nabidky" : section === "candidates" ? "kandidati" : "nastaveni"}`;
  if (section === "overview") return "/firma";
  if (section === "jobs") return "/firma/nabidky";
  if (section === "candidates") return "/firma/prihlasky";
  return "/firma/nastaveni";
}

export function EmployerConsoleShell({
  children,
  active,
  companyName,
  userName,
  email,
  planName,
  usage,
  candidateCount = 0,
  demo = false,
}: {
  children: ReactNode;
  active: EmployerConsoleSection;
  companyName: string;
  userName: string;
  email: string;
  planName: string;
  usage: { used: number; limit: number | null };
  candidateCount?: number;
  demo?: boolean;
}) {
  const usageLabel = usage.limit == null ? `${usage.used} zveřejněných nabídek` : `${usage.used} z ${usage.limit} nabídek`;

  return (
    <div className="fj-console-shell">
      <aside className="fj-console-sidebar">
        <Link href={demo ? "/firma/demo" : "/firma"} className="fj-console-brand">
          <FairJobsLockup inverse />
        </Link>
        <nav aria-label="Firemní navigace">
          {navigation.map((item) => (
            <Link
              key={item.id}
              href={sectionHref(item.id, demo)}
              className={active === item.id ? "active" : ""}
              aria-current={active === item.id ? "page" : undefined}
            >
              <ConsoleIcon name={item.icon} />
              <span>{item.label}</span>
              {item.id === "candidates" && candidateCount > 0 ? <b>{candidateCount}</b> : null}
            </Link>
          ))}
        </nav>
        <div className="fj-console-plan">
          <div><span>Plán {planName}</span><strong>{usageLabel}</strong></div>
          {usage.limit ? <div className="fj-console-plan-track"><span style={{ width: `${Math.min(100, (usage.used / usage.limit) * 100)}%` }} /></div> : null}
          <Link href="/pro-firmy#cenik">Spravovat plán</Link>
        </div>
        <div className="fj-console-user">
          <span>{userName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
          <div><strong>{userName}</strong><small>{email}</small></div>
          {demo ? (
            <Link href="/firma/prihlaseni" aria-label="Přejít k přihlášení">↗</Link>
          ) : (
            <form action={logoutAction}>
              <button type="submit" aria-label="Odhlásit">↗</button>
            </form>
          )}
        </div>
      </aside>

      <div className="fj-console-workspace">
        <header className="fj-console-topbar">
          <details className="fj-console-mobile-nav">
            <summary>Menu</summary>
            <nav aria-label="Mobilní firemní navigace">
              {navigation.map((item) => (
                <Link key={item.id} href={sectionHref(item.id, demo)}>{item.label}</Link>
              ))}
            </nav>
          </details>
          <div>
            <span>{companyName}</span>
            {demo ? <small>Ukázková konzole</small> : <small>Firemní účet</small>}
          </div>
          <nav aria-label="Rychlé akce">
            <Link href="/" target="_blank">Veřejný web ↗</Link>
            <Link href={demo ? "/firma/demo?sekce=nabidky" : "/firma/nabidky/nova"} className="fj-console-primary-action">
              + Nová nabídka
            </Link>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
