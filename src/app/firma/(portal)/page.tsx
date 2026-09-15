import { desc, eq } from "drizzle-orm";
import { Button, ButtonLink } from "@/components/ui";
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
    return tx.select().from(jobs).where(eq(jobs.employerId, session.employerId)).orderBy(desc(jobs.createdAt));
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Firma</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{session.companyName}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {session.email} · plán {session.planCode} · ověření: {session.verificationStatus}
          </p>
        </div>
        <div className="flex gap-2">
          <ButtonLink href="/firma/nabidky/nova">Nová nabídka</ButtonLink>
          <form action={logoutAction}>
            <button className="rounded-md border border-slate-300 px-4 py-2.5 text-sm" type="submit">
              Odhlásit
            </button>
          </form>
        </div>
      </div>
      {orderState === "evidovano" || orderState === "stub" ? (
        <p className="mt-4 border border-slate-200 bg-slate-50 p-3 text-sm">
          Objednávka je evidovaná. Ozveme se na e-mail.
        </p>
      ) : null}
      {orderState === "ok" ? (
        <p className="mt-4 border border-slate-200 bg-slate-50 p-3 text-sm">
          Platba proběhla. Balíček se připíše, jakmile Stripe potvrdí webhook (obvykle okamžitě).
        </p>
      ) : null}
      {orderState === "zruseno" ? (
        <p className="mt-4 border border-slate-200 bg-slate-50 p-3 text-sm">Platbu jste zrušili. Můžete to zkusit znovu.</p>
      ) : null}
      {orderState === "aktivovano" ? (
        <p className="mt-4 border border-slate-200 bg-slate-50 p-3 text-sm">Zkušební balíček je aktivní.</p>
      ) : null}
      <h2 className="mt-8 text-xl font-semibold tracking-tight">Vaše inzeráty</h2>
      <div className="mt-3 grid gap-2">
        {ownJobs.length === 0 ? (
          <p className="border border-slate-200 p-4 text-sm">Zatím žádný inzerát.</p>
        ) : (
          ownJobs.map((job) => (
            <div key={job.id} className="flex flex-wrap items-center justify-between gap-2 border border-slate-200 p-4">
              <div>
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm text-slate-600">
                  {job.city} · {job.status}
                </p>
              </div>
              <a className="text-sm underline" href={`/firma/nabidky/${job.id}/prihlasky`}>
                Přihlášky
              </a>
            </div>
          ))
        )}
      </div>
      <h2 className="mt-10 text-xl font-semibold tracking-tight">Balíčky</h2>
      <p className="mt-1 text-sm text-slate-600">
        {stripeOn
          ? "Platba kartou. Ceny bez DPH."
          : "Ceny bez DPH. Po objednávce se ozveme na e-mail."}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PACKAGES.map((pkg) => {
          const action = startCheckoutAction.bind(null, pkg.code);
          return (
            <form key={pkg.code} action={action} className="flex flex-col border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">{pkg.name}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {pkg.priceCzkExVat === 0 ? "0 Kč" : formatCzk(pkg.priceCzkExVat)}
              </p>
              <p className="mt-2 flex-1 text-sm text-slate-600">{pkg.blurb}</p>
              <Button type="submit" className="mt-4">
                {pkg.priceCzkExVat === 0 ? "Aktivovat" : stripeOn ? "Zaplatit kartou" : "Objednat"}
              </Button>
            </form>
          );
        })}
      </div>
    </main>
  );
}
