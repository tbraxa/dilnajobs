import Link from "next/link";
import { ConsoleShell } from "@/components/console/console-shell";
import {
  ActivityLineChart,
  HiringFunnel,
  SeedBadge,
  Sparkline,
} from "@/components/console/seed-charts";

/** Ungated SoT firma dashboard for design audit — outside (portal) auth layout. */
export default function FirmaDemoPage() {
  const sampleJobs = [
    {
      id: "1",
      title: "Senior Frontend Engineer",
      city: "Praha",
      slug: "senior-frontend-engineer",
      status: "published",
      spark: "M0,28 L20,26 L40,22 L60,18 L80,14 L100,12 L120,8",
    },
    {
      id: "2",
      title: "Product Designer",
      city: "Brno",
      slug: "product-designer",
      status: "published",
      spark: "M0,22 L20,20 L40,24 L60,18 L80,16 L100,14 L120,10",
    },
    {
      id: "3",
      title: "Backend Engineer (Node)",
      city: "Remote CZ",
      slug: "backend-engineer-node",
      status: "draft",
      spark: "M0,30 L20,28 L40,26 L60,24 L80,22 L100,20 L120,18",
    },
  ];

  return (
    <ConsoleShell
      railLabel="Firma demo"
      railItems={[
        { href: "/firma/demo", label: "Přehled", active: true },
        { href: "/firma/demo", label: "Nabídky" },
        { href: "/firma/demo", label: "Kandidáti" },
        { href: "/firma/demo", label: "Zprávy" },
        { href: "/firma/demo", label: "Fakturace" },
        { href: "/firma/demo", label: "Nastavení" },
      ]}
      railFoot={
        <>
          <p className="mono" style={{ margin: "0 0 8px" }}>
            Klarna Studio CZ
          </p>
          <p className="muted" style={{ margin: "0 0 8px", fontSize: 12 }}>
            Ukázková data · bez přihlášení
          </p>
          <Link href="/" style={{ fontSize: 13, color: "var(--ink-muted)", display: "block" }}>
            ← Veřejný web
          </Link>
        </>
      }
      topActions={
        <>
          <span className="btn btn-primary btn-sm" aria-disabled="true">
            + Nová nabídka
          </span>
          <span className="btn btn-ghost btn-sm" aria-label="Účet firmy">
            KS
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
            Náborový funnel a aktivita nabídek · posledních 30 dní
          </p>
          <p className="muted" style={{ margin: "6px 0 0", fontSize: 13 }}>
            Design SoT demo — produkční /firma zůstává za autentizací
          </p>
        </div>
        <SeedBadge />
      </div>

      <div className="kpi-row" aria-label="KPI">
        <div className="kpi">
          <div className="label">Zobrazení</div>
          <b>12&nbsp;480</b>
          <div className="delta up">+18% · 30d</div>
        </div>
        <div className="kpi">
          <div className="label">Přihlášky</div>
          <b>346</b>
          <div className="delta up">+9% · 30d</div>
        </div>
        <div className="kpi">
          <div className="label">Shortlist</div>
          <b>48</b>
          <div className="delta flat">0% · 30d</div>
        </div>
        <div className="kpi">
          <div className="label">Najatí</div>
          <b>6</b>
          <div className="delta up">+2 · 30d</div>
        </div>
      </div>

      <div className="charts">
        <ActivityLineChart
          title="Aktivita nabídek"
          subtitle="Ukázková data · views / applies"
          ariaLabel="Čárový graf: zobrazení a přihlášky za 30 dní"
        />
        <HiringFunnel />
      </div>

      <section className="chart full" style={{ marginTop: 12 }} aria-labelledby="jobs-spark-title">
        <div className="chart-head">
          <div>
            <h2 className="chart-title" id="jobs-spark-title">
              Aktivní nabídky
            </h2>
            <p className="seed" style={{ marginTop: 4 }}>
              Ukázková data · sparkline je seedovaný
            </p>
          </div>
          <span className="btn btn-secondary btn-sm" aria-disabled="true">
            Nová nabídka
          </span>
        </div>
        <table className="table-clean">
          <thead>
            <tr>
              <th>Pozice</th>
              <th>Stav</th>
              <th>Trend</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sampleJobs.map((job) => (
              <tr key={job.id}>
                <td>
                  <strong>{job.title}</strong>
                  <div className="mono">
                    {job.city} · {job.slug}
                  </div>
                </td>
                <td>
                  <span className="tag">{job.status}</span>
                </td>
                <td style={{ width: 120 }}>
                  <Sparkline d={job.spark} />
                </td>
                <td>
                  <span className="btn btn-ghost btn-sm" aria-disabled="true">
                    Přihlášky
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </ConsoleShell>
  );
}
