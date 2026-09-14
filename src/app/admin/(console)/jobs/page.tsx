import { desc, eq } from "drizzle-orm";
import { Button } from "@/components/ui";
import { withAdminRls } from "@/db/rls";
import { employers, jobs } from "@/db/schema";
import { publishJobAction, rejectJobAction, unpublishJobAction } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

const STATUS_CS: Record<string, string> = {
  draft: "koncept",
  pending_review: "ke schválení",
  published: "zveřejněno",
  expired: "expirované",
  unpublished: "staženo",
};

export default async function AdminJobsPage() {
  const rows = await withAdminRls(async (tx) => {
    return tx
      .select({
        id: jobs.id,
        title: jobs.title,
        city: jobs.city,
        status: jobs.status,
        createdAt: jobs.createdAt,
        companyName: employers.companyName,
      })
      .from(jobs)
      .innerJoin(employers, eq(jobs.employerId, employers.id))
      .orderBy(desc(jobs.createdAt));
  });

  return (
    <main>
      <p className="label">Moderace</p>
      <h1 className="display mt-1 text-3xl font-semibold">Inzeráty</h1>
      <p className="mt-2 text-sm text-steel">
        První inzeráty firem čekají ve stavu ke schválení. Zamítnutí inzerát stáhne (unpublished).
      </p>
      <div className="mt-6 grid gap-3">
        {rows.map((row) => (
          <article key={row.id} className="border border-line bg-paper p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{row.title}</h2>
                <p className="text-sm text-steel">
                  {row.companyName} · {row.city} · {STATUS_CS[row.status] ?? row.status}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {row.status === "pending_review" || row.status === "unpublished" || row.status === "draft" ? (
                  <form action={publishJobAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <Button type="submit">Zveřejnit</Button>
                  </form>
                ) : null}
                {row.status === "pending_review" ? (
                  <form action={rejectJobAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <Button type="submit" variant="ghost">
                      Zamítnout
                    </Button>
                  </form>
                ) : null}
                {row.status === "published" ? (
                  <form action={unpublishJobAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <Button type="submit" variant="ghost">
                      Stáhnout
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
