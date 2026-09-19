import Link from "next/link";
import { ConsoleShell } from "@/components/console/console-shell";
import { SeedBadge } from "@/components/console/seed-charts";

export default function Page() {
  return (
    <ConsoleShell
      railLabel="Můj účet"
      railItems={[
        { href: "/ucet", label: "Přehled", active: true },
        { href: "/ucet/ulozene", label: "Uložené" },
        { href: "/ucet/profil", label: "Firmy" },
        { href: "/ucet/zivotopis", label: "Životopis" },
        { href: "/ucet/nastaveni", label: "Nastavení" }
      ]}
      railFoot={
        <Link href="/" style={{ fontSize: 13, color: "var(--ink-muted)" }}>
          ← Veřejný web
        </Link>
      }
      topActions={
        <Link className="btn btn-secondary btn-sm" href="/nabidky">
          Hledat práci
        </Link>
      }
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <h1 className="page-title">Přehled</h1>
        <SeedBadge />
      </div>
      <p className="muted">
        Shell připravený podle Design SoT. Data a seeker auth doplníme v další iteraci.
      </p>
      <Link className="btn btn-secondary btn-sm" href="/ucet" style={{ marginTop: 16 }}>
        ← Zpět na přehled
      </Link>
    </ConsoleShell>
  );
}
