import { desc, eq } from "drizzle-orm";
import { withEmployerRls } from "@/db/rls";
import { jobs } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { startCheckoutAction } from "@/lib/actions/jobs";
import { paymentsEnabled } from "@/lib/env";
import { PACKAGES, formatCzk } from "@/lib/pricing";
import { Notice, PageHero } from "@/components/preview/board";

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
    return tx.select().from(jobs).where(eq(jobs.employerId, session.employerId)).orderBy(desc(jobs.createdAt));
  });

  return (
    <main>
      <PageHero
        eyebrow="Firma"
        title={session.companyName}
        lead={`${session.email} · plán ${session.planCode} · ověření: ${session.verificationStatus}`}
      >
        <div className="hero-ctas">
          <a href="/firma/nabidky/nova" className="btn btn-accent btn-square">
            Nová nabídka →
          </a>
          <form action={logoutAction}>
            <button className="btn btn-secondary btn-square" type="submit">
              Odhlásit
            </button>
          </form>
        </div>
      </PageHero>

      <section className="section-band" aria-labelledby="ads-title">
        <div className="section-head">
          <div>
            <p className="eyebrow">Inzeráty</p>
            <h2 id="ads-title">Vaše nabídky</h2>
          </div>
        </div>
        <div className="board-pad" style={{ paddingTop: 0 }}>
          {orderState === "stub" ? (
            <Notice>Platba kartou teď není zapnutá. Ozveme se na e-mail.</Notice>
          ) : null}
          {orderState === "ok" ? (
            <Notice>Platba proběhla. Balíček se připíše, jakmile Stripe potvrdí webhook (obvykle okamžitě).</Notice>
          ) : null}
          {orderState === "zruseno" ? <Notice>Platbu jste zrušili. Můžete to zkusit znovu.</Notice> : null}
          {orderState === "aktivovano" ? <Notice>Zkušební balíček je aktivní.</Notice> : null}
          {ownJobs.length === 0 ? (
            <p className="lead">Zatím žádný inzerát.</p>
          ) : (
            ownJobs.map((job) => (
              <div key={job.id} className="app-row">
                <div>
                  <p>
                    <strong>{job.title}</strong>
                  </p>
                  <p className="muted">
                    {job.city} · {job.status}
                  </p>
                </div>
                <a className="btn btn-ghost btn-square" href={`/firma/nabidky/${job.id}/prihlasky`}>
                  Přihlášky →
                </a>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="modular-grid" aria-labelledby="pack-title">
        <div className="mod span-12" style={{ padding: "2rem 2.5rem", background: "var(--cream)" }}>
          <p className="eyebrow">Balíčky</p>
          <h2 id="pack-title" className="h2">
            {stripeOn ? "Platba kartou. Ceny bez DPH." : "Platba kartou teď není zapnutá. Objednávku vezmeme a ozveme se na e-mail."}
          </h2>
        </div>
        {PACKAGES.map((pkg) => {
          const action = startCheckoutAction.bind(null, pkg.code);
          const tone =
            pkg.code === "standard" ? " is-blue-bg" : pkg.code === "basic" ? " is-dark" : "";
          const span = pkg.code === "basic" ? "span-7" : pkg.code === "standard" ? "span-5" : "span-4";
          return (
            <form key={pkg.code} action={action} className={`mod ${span}${tone}`}>
              <span className="mod-tag">{pkg.name}</span>
              <h3>{pkg.priceCzkExVat === 0 ? "0 Kč" : formatCzk(pkg.priceCzkExVat)}</h3>
              <p className="mod-desc">{pkg.blurb}</p>
              <button type="submit" className={`btn btn-square ${pkg.code === "standard" ? "btn-primary" : "btn-accent"}`}>
                {pkg.priceCzkExVat === 0 ? "Aktivovat" : stripeOn ? "Zaplatit kartou" : "Objednat"}
              </button>
            </form>
          );
        })}
      </section>
    </main>
  );
}
