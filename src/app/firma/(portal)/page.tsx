import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ConsoleShell } from "@/components/console/console-shell";
import {
  ActivityLineChart,
  HiringFunnel,
  SeedBadge,
  Sparkline,
} from "@/components/console/seed-charts";
import { withEmployerRls } from "@/db/rls";
import { jobs } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { startCheckoutAction } from "@/lib/actions/jobs";
import { paymentsEnabled } from "@/lib/env";
import { PACKAGES, formatCzk } from "@/lib/pricing";

export default async function FirmaHome({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getSession();
  if (!session) return null;
  const params = await searchParams;
  const orderState = typeof params.objednavka === "string" ? params.objednavka : "";
  const stripeOn = paymentsEnabled();

  const ownJobs = await withEmployerRls(session.employerId, async (tx) => {
    return tx
      .select()
      .from(jobs)
      .where(eq(jobs.employerId, session.employerId))
      .orderBy(desc(jobs.createdAt));
  });

  const initials = session.companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

  return (
    <ConsoleShell
      railLabel="Firma"
      railItems={[
        { href: "/firma", label: "Přehled", active: true },
        { href: "/firma/nabidky/nova", label: "Nabídky" },
        { href: "/firma", label: "Kandidáti" },
        { href: "/firma", label: "Zprávy" },
        { href: "/firma", label: "Fakturace" },
        { href: "/firma", label: "Nastavení" },
      ]}
      railFoot={
        <>
          <p className="mono" style={{ margin: "0 0 8px" }}>
            {session.companyName}
          </p>
          <form action={logoutAction}>
            <button type="submit" className="btn btn-ghost btn-sm">
              Odhlásit
            </button>
          </form>
          <Link href="/" style={{ fontSize: 13, color: "var(--ink-muted)", display: "block", marginTop: 8 }}>
            ← Veřejný web
          </Link>
        </>
      }
      topActions={
        <>
          <Link className="btn btn-primary btn-sm" href="/firma/nabidky/nova">
            + Nová nabídka
          </Link>
          <span className="btn btn-ghost btn-sm" aria-label="Účet firmy">
            {initials || "F"}
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
            {session.email} · plán {session.planCode} · ověření: {session.verificationStatus}
          </p>
        </div>
        <SeedBadge />
      </div>

      {orderState === "evidovano" || orderState === "stub" ? (
        <p className="empty-soft" style={{ marginTop: 16 }}>
          Objednávka je evidovaná. Ozveme se na e-mail.
        </p>
      ) : null}
      {orderState === "ok" ? (
        <p className="empty-soft" style={{ marginTop: 16 }}>
          Platba proběhla. Balíček se připíše po potvrzení webhooku.
        </p>
      ) : null}
      {orderState === "zruseno" ? (
        <p className="empty-soft" style={{ marginTop: 16 }}>
          Platbu jste zrušili. Můžete to zkusit znovu.
        </p>
      ) : null}
      {orderState === "aktivovano" ? (
        <p className="empty-soft" style={{ marginTop: 16 }}>
          Zkušební balíček je aktivní.
        </p>
      ) : null}

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
              Živá data z vašeho účtu · sparkline je ukázkový
            </p>
          </div>
          <Link className="btn btn-secondary btn-sm" href="/firma/nabidky/nova">
            Nová nabídka
          </Link>
        </div>
        {ownJobs.length === 0 ? (
          <p className="empty-soft">Zatím žádný inzerát.</p>
        ) : (
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
              {ownJobs.map((job) => (
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
                    <Sparkline d="M0,28 L20,26 L40,22 L60,18 L80,14 L100,12 L120,8" />
                  </td>
                  <td>
                    <Link className="btn btn-ghost btn-sm" href={`/firma/nabidky/${job.id}/prihlasky`}>
                      Přihlášky
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="chart full" style={{ marginTop: 12 }} aria-labelledby="packages-title">
        <div className="chart-head">
          <div>
            <h2 className="chart-title" id="packages-title">
              Balíčky
            </h2>
            <p className="seed" style={{ marginTop: 4 }}>
              {stripeOn
                ? "Platba kartou. Ceny bez DPH."
                : "Ceny bez DPH. Po objednávce se ozveme na e-mail. Live Stripe je vypnutý."}
            </p>
          </div>
        </div>
        <div
          className="kpi-row"
          style={{ gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))" }}
        >
          {PACKAGES.map((pkg) => {
            const action = startCheckoutAction.bind(null, pkg.code);
            return (
              <form
                key={pkg.code}
                action={action}
                className="kpi"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div className="label">{pkg.name}</div>
                <b style={{ fontSize: 22 }}>
                  {pkg.priceCzkExVat === 0 ? "0 Kč" : formatCzk(pkg.priceCzkExVat)}
                </b>
                <p className="muted" style={{ fontSize: 13, flex: 1 }}>
                  {pkg.blurb}
                </p>
                <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                  {pkg.priceCzkExVat === 0 ? "Aktivovat" : stripeOn ? "Zaplatit kartou" : "Objednat"}
                </button>
              </form>
            );
          })}
        </div>
      </section>
    </ConsoleShell>
  );
}
