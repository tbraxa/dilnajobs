import { desc, eq } from "drizzle-orm";
import { ButtonLink } from "@/components/ui";
import { withEmployerRls } from "@/db/rls";
import { jobs } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { startCheckoutAction } from "@/lib/actions/jobs";

export default async function FirmaHome({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getSession();
  if (!session) return null;
  const params = await searchParams;
  const stubOrder = params.objednavka === "stub";

  const ownJobs = await withEmployerRls(session.employerId, async (tx) => {
    return tx.select().from(jobs).where(eq(jobs.employerId, session.employerId)).orderBy(desc(jobs.createdAt));
  });

  const orderStandard = startCheckoutAction.bind(null, "standard");

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label">Firma</p>
          <h1 className="display mt-1 text-3xl font-semibold">{session.companyName}</h1>
          <p className="mt-1 text-sm text-steel">
            {session.email} · plán {session.planCode} · ověření: {session.verificationStatus}
          </p>
        </div>
        <div className="flex gap-2">
          <ButtonLink href="/firma/nabidky/nova">Nová nabídka</ButtonLink>
          <form action={logoutAction}>
            <button className="rounded-[2px] border border-line px-4 py-2.5 text-sm" type="submit">
              Odhlásit
            </button>
          </form>
        </div>
      </div>
      {stubOrder ? (
        <p className="mt-4 border border-line bg-paper-2 p-3 text-sm">
          Objednávka je ve stavu stub — platební brána není zapnutá. Ozveme se na e-mail.
        </p>
      ) : null}
      <h2 className="display mt-8 text-xl font-semibold">Vaše inzeráty</h2>
      <div className="mt-3 grid gap-2">
        {ownJobs.length === 0 ? (
          <p className="border border-line p-4 text-sm">Zatím žádný inzerát.</p>
        ) : (
          ownJobs.map((job) => (
            <div key={job.id} className="flex flex-wrap items-center justify-between gap-2 border border-line p-4">
              <div>
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm text-steel">
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
      <h2 className="display mt-10 text-xl font-semibold">Balíčky</h2>
      <p className="mt-1 text-sm text-steel">Platba je v1 stub, pokud chybí klíče Stripe / GoPay.</p>
      <form action={orderStandard} className="mt-3">
        <button className="rounded-[2px] bg-accent px-4 py-2.5 text-sm font-semibold text-white" type="submit">
          Objednat Standard (stub)
        </button>
      </form>
    </main>
  );
}
