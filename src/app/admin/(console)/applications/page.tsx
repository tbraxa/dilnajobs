import { desc, eq } from "drizzle-orm";
import { withAdminRls } from "@/db/rls";
import { applications, employers, jobs } from "@/db/schema";
import { maskPhone } from "@/lib/mask";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const rows = await withAdminRls(async (tx) => {
    return tx
      .select({
        id: applications.id,
        fullName: applications.fullName,
        phone: applications.phone,
        email: applications.email,
        createdAt: applications.createdAt,
        jobTitle: jobs.title,
        companyName: employers.companyName,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(employers, eq(applications.employerId, employers.id))
      .orderBy(desc(applications.createdAt))
      .limit(100);
  });

  return (
    <main>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Moderace</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Přihlášky</h1>
      <p className="mt-2 text-sm text-slate-600">
        Přehled napříč firmami. Telefon v seznamu částečně maskujeme. Životopisy stahují jen firmy ve svém portálu.
      </p>
      <div className="mt-6 grid gap-3">
        {rows.length === 0 ? (
          <p className="border border-slate-200 p-4 text-sm">Zatím žádné přihlášky.</p>
        ) : (
          rows.map((row) => (
            <article key={row.id} className="border border-slate-200 bg-white p-4">
              <h2 className="font-semibold">{row.fullName}</h2>
              <p className="text-sm text-slate-600">
                {row.jobTitle} · {row.companyName}
              </p>
              <p className="mt-1 text-sm">
                Tel. {maskPhone(row.phone)}
                {row.email ? ` · ${row.email}` : ""}
              </p>
              <p className="mt-1 text-xs text-slate-600">{row.createdAt.toLocaleString("cs-CZ")}</p>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
