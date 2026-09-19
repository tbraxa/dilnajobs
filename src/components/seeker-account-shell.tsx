import type { ReactNode } from "react";
import Link from "next/link";
import { FairJobsLockup } from "@/components/fairjobs-brand";
import { logoutSeekerAction } from "@/lib/actions/seeker-auth";

export type SeekerSection = "overview" | "favorites" | "profile";

const navigation = [
  { id: "overview", label: "Přehled", href: "/ucet/prehled" },
  { id: "applications", label: "Moje odpovědi", href: "/ucet/prehled#odpovedi" },
  { id: "favorites", label: "Uložené nabídky", href: "/ucet/oblibene" },
  { id: "companies", label: "Oblíbené firmy", href: "/ucet/oblibene#firmy" },
  { id: "cv", label: "Životopis", href: "/zivotopis" },
  { id: "profile", label: "Profil a nastavení", href: "/ucet/profil" },
] as const;

function RailIcon({ id }: { id: string }) {
  if (id === "applications") {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14v10H3zM3.5 5.5 10 11l6.5-5.5" /></svg>;
  }
  if (id === "favorites") {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15.8 3.8a4 4 0 0 0-5.7 0L10 4l-.2-.2a4 4 0 1 0-5.6 5.7L10 15l5.8-5.5a4 4 0 0 0 0-5.7Z" /></svg>;
  }
  if (id === "companies") {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 17V6l7-3v14M10 8h7v9M6 8h1M6 11h1M6 14h1M13 11h1M13 14h1M2 17h16" /></svg>;
  }
  if (id === "cv") {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 2.5h7l3 3V17H5zM12 2.5V6h3M8 10h4M8 13h4" /></svg>;
  }
  if (id === "profile") {
    return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="7" r="3" /><path d="M4 17c.6-3.7 2.6-5.6 6-5.6s5.4 1.9 6 5.6" /></svg>;
  }
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m3 9 7-6 7 6v8H5V9M8 17v-5h4v5" /></svg>;
}

export function SeekerAccountShell({
  children,
  active,
  name,
  email,
  savedJobs,
}: {
  children: ReactNode;
  active: SeekerSection;
  name: string;
  email: string;
  savedJobs: number;
}) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="fj-seeker-shell">
      <aside className="fj-seeker-rail">
        <Link href="/ucet/prehled" className="fj-seeker-brand">
          <FairJobsLockup />
        </Link>
        <nav aria-label="Navigace účtu">
          {navigation.map((item) => {
            const selected = item.id === active;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={selected ? "active" : ""}
                aria-current={selected ? "page" : undefined}
              >
                <RailIcon id={item.id} />
                <span>{item.label}</span>
                {item.id === "favorites" && savedJobs ? <b>{savedJobs}</b> : null}
              </Link>
            );
          })}
        </nav>
        <div className="fj-seeker-rail-note">
          <span>Rychlý tip</span>
          <strong>Doplňte kontakt jednou.</strong>
          <p>Při odpovědi na nabídku ho pak jen zkontrolujete.</p>
          <Link href="/ucet/profil">Doplnit profil →</Link>
        </div>
        <div className="fj-seeker-user">
          <span>{initials}</span>
          <div><strong>{name}</strong><small>{email}</small></div>
          <form action={logoutSeekerAction}>
            <button type="submit" aria-label="Odhlásit">↗</button>
          </form>
        </div>
      </aside>

      <div className="fj-seeker-workspace">
        <header className="fj-seeker-topbar">
          <Link href="/nabidky">← Zpět na nabídky</Link>
          <span>Účet uchazeče</span>
          <Link href="/nabidky" className="fj-seeker-topbar-primary">Hledat práci</Link>
        </header>
        {children}
      </div>
    </div>
  );
}
