import Link from "next/link";
import { ConsoleShell } from "@/components/console/console-shell";
import { ActivityLineChart, SeedBadge, Sparkline } from "@/components/console/seed-charts";

export default function UcetOverviewPage() {
  return (
    <ConsoleShell
      railLabel="Můj účet"
      railItems={[
        { href: "/ucet", label: "Přehled", active: true },
        { href: "/ucet/ulozene", label: "Uložené" },
        { href: "/ucet/profil", label: "Firmy" },
        { href: "/ucet/zivotopis", label: "Životopis" },
        { href: "/ucet/nastaveni", label: "Nastavení" },
      ]}
      railFoot={
        <>
          <p className="mono" style={{ margin: "0 0 4px" }}>
            tomas@example.cz
          </p>
          <Link href="/" style={{ fontSize: 13, color: "var(--ink-muted)" }}>
            Odhlásit
          </Link>
        </>
      }
      topActions={
        <>
          <Link className="btn btn-secondary btn-sm" href="/nabidky">
            Hledat práci
          </Link>
          <span className="btn btn-ghost btn-sm" aria-label="Profil">
            TB
          </span>
        </>
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 className="page-title">Přehled</h1>
          <p className="muted" style={{ margin: 0, fontSize: 14 }}>
            Uložené nabídky, odpovědi a aktivita hledání
          </p>
        </div>
        <SeedBadge />
      </div>

      <div className="profile-card" style={{ marginTop: 20 }}>
        <div className="avatar" aria-hidden="true">
          TB
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ letterSpacing: "-0.02em" }}>Tomáš Braxatoris</strong>
          <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
            Produktový manažer · Praha / hybrid
          </div>
        </div>
        <Link className="btn btn-secondary btn-sm" href="/ucet/profil">
          Upravit profil
        </Link>
      </div>

      <div className="kpi-row" aria-label="KPI uchazeče">
        <div className="kpi">
          <div className="label">Uložené</div>
          <b>14</b>
          <div className="delta up">+3 · 7d</div>
        </div>
        <div className="kpi">
          <div className="label">Odeslané</div>
          <b>7</b>
          <div className="delta flat">0 · 7d</div>
        </div>
        <div className="kpi">
          <div className="label">Odpovědi</div>
          <b>3</b>
          <div className="delta up">+1 · 7d</div>
        </div>
        <div className="kpi">
          <div className="label">Pohovory</div>
          <b>1</b>
          <div className="delta flat"> · </div>
        </div>
      </div>

      <div className="charts">
        <ActivityLineChart
          title="Aktivita hledání"
          subtitle="Ukázková data · uložené + odpovědi"
          ariaLabel="Čárový graf aktivity za 30 dní"
        />
        <section className="chart" aria-labelledby="pulse-title">
          <div className="chart-head">
            <div>
              <h2 className="chart-title" id="pulse-title">
                Trh  ·  pulse
              </h2>
              <p className="seed" style={{ marginTop: 4 }}>
                Ukázková data · PM · Praha
              </p>
            </div>
          </div>
          <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--ink-muted)" }}>
            Medián inzerované mzdy (role × lokalita)
          </p>
          <p
            style={{
              margin: "0 0 12px",
              fontFamily: "var(--mono)",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            92 tis. Kč
          </p>
          <Sparkline d="M0,30 L40,28 L80,32 L120,26 L160,24 L200,20 L240,18 L280,14" />
          <p className="seed" style={{ marginTop: 12 }}>
            N=128 nabídek · metodika: medián horní hranice pásma
          </p>
          <Link href="/nabidky?loc=Praha" className="btn btn-secondary btn-sm" style={{ marginTop: 14 }}>
            Otevřít nabídky v Praze
          </Link>
        </section>
      </div>

      <div className="section-head" style={{ marginTop: 28 }}>
        <h2>Uložené nabídky</h2>
        <Link href="/ucet/ulozene">Všechny →</Link>
      </div>
      <div className="saved-list">
        <Link className="saved-item" href="/nabidky">
          <div>
            <div className="title">Senior Product Manager</div>
            <div className="meta">Twisto · Praha · Hybrid</div>
          </div>
          <div className="pay">110-140 tis.</div>
        </Link>
        <Link className="saved-item" href="/nabidky">
          <div>
            <div className="title">Backend Engineer (Go)</div>
            <div className="meta">Gen Digital · Na dálku (CZ)</div>
          </div>
          <div className="pay">120-160 tis.</div>
        </Link>
        <Link className="saved-item" href="/nabidky">
          <div>
            <div className="title">Product Manager  ·  Growth</div>
            <div className="meta">Seznam.cz · Praha</div>
          </div>
          <div className="pay">90-120 tis.</div>
        </Link>
      </div>

      <div className="empty-soft" style={{ marginTop: 16 }}>
        <strong>Životopis ještě není hotový</strong>
        Doplňte zkušenosti  ·  firmy uvidí silnější profil při odpovědi.
        <div style={{ marginTop: 12 }}>
          <Link className="btn btn-primary btn-sm" href="/ucet/zivotopis">
            Pokračovat v životopisu
          </Link>
        </div>
      </div>
    </ConsoleShell>
  );
}
