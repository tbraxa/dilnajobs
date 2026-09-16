import { desc } from "drizzle-orm";
import { Button } from "@/components/ui";
import { withAdminRls } from "@/db/rls";
import { employers } from "@/db/schema";
import {
  flagAgencyAction,
  rejectEmployerAction,
  verifyEmployerAction,
} from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

const STATUS_CS: Record<string, string> = {
  pending: "čeká na ověření",
  verified: "ověřeno",
  rejected: "zamítnuto",
};

export default async function AdminEmployersPage() {
  const rows = await withAdminRls(async (tx) => {
    return tx.select().from(employers).orderBy(desc(employers.createdAt));
  });

  return (
    <main>
      <p className="text-sm font-semibold text-slate-600">Moderace</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Firmy</h1>
      <p className="mt-2 text-sm text-slate-600">
        Ověření je ruční. Označení agentury firmu zamítne. Agentury práce neregistrujeme.
      </p>
      <div className="mt-6 grid gap-3">
        {rows.map((row) => (
          <article key={row.id} className="border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{row.companyName}</h2>
                <p className="text-sm text-slate-600">
                  IČO {row.ico} · {row.city ?? "Neuvedeno"} · {STATUS_CS[row.verificationStatus] ?? row.verificationStatus}
                  {row.isAgency ? " · agentura" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {row.verificationStatus !== "verified" ? (
                  <form action={verifyEmployerAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <Button type="submit">Ověřit</Button>
                  </form>
                ) : null}
                {row.verificationStatus !== "rejected" ? (
                  <form action={rejectEmployerAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <Button type="submit" variant="ghost">
                      Zamítnout
                    </Button>
                  </form>
                ) : null}
                {!row.isAgency ? (
                  <form action={flagAgencyAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <Button type="submit" variant="danger">
                      Označit agenturu
                    </Button>
                  </form>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
