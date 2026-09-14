import { and, desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { withEmployerRls } from "@/db/rls";
import { applications, jobs } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { PageHero } from "@/components/preview/board";

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
    <main>
      <PageHero
        eyebrow="Přihlášky"
        title={data.job.title}
        lead="Vidíte jen přihlášky k vašim inzerátům (RLS)."
      >
        <a href="/firma" className="btn btn-secondary btn-square">
          Zpět →
        </a>
      </PageHero>
      <section className="section-band">
        <div className="board-pad">
          {data.apps.length === 0 ? (
            <p className="lead">Zatím nikdo. Až se někdo ozve, bude tady.</p>
          ) : (
            data.apps.map((app) => (
              <article key={app.id} className="app-row">
                <div>
                  <p>
                    <strong>{app.fullName}</strong>
                  </p>
                  <p className="muted">
                    Tel. {app.phone}
                    {app.email ? ` · ${app.email}` : ""}
                  </p>
                  {app.message ? <p className="lead" style={{ marginTop: "0.5rem" }}>{app.message}</p> : null}
                </div>
                {app.cvObjectKey ? (
                  <a className="btn btn-ghost btn-square" href={`/firma/nabidky/${data.job.id}/prihlasky/${app.id}/cv`}>
                    Stáhnout CV →
                  </a>
                ) : (
                  <span className="muted">Bez souboru</span>
                )}
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
