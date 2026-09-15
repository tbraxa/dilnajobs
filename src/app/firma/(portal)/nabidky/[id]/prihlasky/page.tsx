import { and, desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { withEmployerRls } from "@/db/rls";
import { applications, jobs } from "@/db/schema";
import { getSession } from "@/lib/auth";

export default async function PrihlaskyPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;
  const { id } = await params;

  const data = await withEmployerRls(session.employerId, async (tx) => {
    const [job] = await tx
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.employerId, session.employerId)))
      .limit(1);
    if (!job) return null;
    const apps = await tx
      .select()
      .from(applications)
      .where(eq(applications.jobId, job.id))
      .orderBy(desc(applications.createdAt));
    return { job, apps };
  });

  if (!data) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Přihlášky</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{data.job.title}</h1>
      <p className="mt-2 text-sm text-slate-600">Vidíte jen přihlášky k vašim inzerátům (RLS).</p>
      <div className="mt-6 grid gap-3">
        {data.apps.length === 0 ? (
          <p className="border border-slate-200 p-4 text-sm">Zatím nikdo. Až se někdo ozve, bude tady.</p>
        ) : (
          data.apps.map((app) => (
            <article key={app.id} className="border border-slate-200 p-4">
              <p className="font-semibold">{app.fullName}</p>
              <p className="text-sm">
                Tel. {app.phone}
                {app.email ? ` · ${app.email}` : ""}
              </p>
              {app.message ? <p className="mt-2 text-sm text-slate-600">{app.message}</p> : null}
              {app.cvObjectKey ? (
                <a
                  className="mt-3 inline-block text-sm underline"
                  href={`/firma/nabidky/${data.job.id}/prihlasky/${app.id}/cv`}
                >
                  Stáhnout životopis
                </a>
              ) : (
                <p className="mt-2 text-xs text-slate-600">Bez souboru</p>
              )}
            </article>
          ))
        )}
      </div>
    </main>
  );
}
