import Link from "next/link";
import { getSession } from "@/lib/auth";
import { loadEmployerConsoleData, jobStatusLabels, workModeLabel } from "@/lib/employer-console";
import { updateJobLifecycleAction } from "@/lib/actions/employer-console";
import { cleanUiText } from "@/lib/fairjobs-visual";
import { formatSalary } from "@/lib/pricing";

const filters = [
  { value: "all", label: "Všechny" },
  { value: "published", label: "Aktivní" },
  { value: "pending_review", label: "Kontrola" },
  { value: "closed", label: "Uzavřené" },
] as const;

export default async function EmployerJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getSession();
  if (!session) return null;
  const [params, data] = await Promise.all([
    searchParams,
    loadEmployerConsoleData(session.employerId),
  ]);
  const selected = typeof params.stav === "string" ? params.stav : "all";
  const visibleJobs = selected === "all" ? data.jobs : data.jobs.filter((job) => job.status === selected);
  const applicationCount = new Map<string, number>();
  for (const application of data.applications) {
    applicationCount.set(application.jobId, (applicationCount.get(application.jobId) ?? 0) + 1);
  }

  return (
    <main className="fj-console-page">
      <header className="fj-console-page-head">
        <div>
          <p>Správa inzerce</p>
          <h1>Nabídky</h1>
          <span>Stav, odpovědi a platnost všech otevřených pozic.</span>
        </div>
        <Link href="/firma/nabidky/nova" className="fj-console-button primary">+ Nová nabídka</Link>
      </header>

      <nav className="fj-console-tabs" aria-label="Filtrovat nabídky">
        {filters.map((filter) => {
          const count = filter.value === "all"
            ? data.jobs.length
            : data.jobs.filter((job) => job.status === filter.value).length;
          return (
            <Link
              href={filter.value === "all" ? "/firma/nabidky" : `/firma/nabidky?stav=${filter.value}`}
              className={selected === filter.value ? "active" : ""}
              key={filter.value}
            >
              {filter.label} <span>{count}</span>
            </Link>
          );
        })}
      </nav>

      <section className="fj-console-panel fj-console-jobs-page">
        <div className="fj-console-job-table">
          <div className="fj-console-table-head">
            <span>Pozice</span><span>Stav</span><span>Odpovědi</span><span>Platnost</span><span />
          </div>
          {visibleJobs.length === 0 ? (
            <div className="fj-console-empty">
              <strong>V tomto výběru nic není</strong>
              <p>Zkuste jiný stav nebo vytvořte novou nabídku.</p>
            </div>
          ) : (
            visibleJobs.map((job) => {
              const closeAction = updateJobLifecycleAction.bind(null, job.id, "close");
              const renewAction = updateJobLifecycleAction.bind(null, job.id, "renew");
              return (
                <article className="fj-console-job-card" key={job.id}>
                  <div className="fj-console-job-card-main">
                    <div>
                      <span className={`fj-console-status status-${job.status}`}>{jobStatusLabels[job.status] ?? job.status}</span>
                      <h2>{cleanUiText(job.title)}</h2>
                      <p>{cleanUiText(job.city)} · {workModeLabel(job.workMode)} · {cleanUiText(formatSalary(job.salaryMin, job.salaryMax, job.salaryNote))}</p>
                    </div>
                    <div className="fj-console-job-card-stat">
                      <strong>{applicationCount.get(job.id) ?? 0}</strong>
                      <span>odpovědí</span>
                    </div>
                    <div className="fj-console-job-card-stat">
                      <strong>{job.expiresAt ? job.expiresAt.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" }) : "Bez data"}</strong>
                      <span>platnost</span>
                    </div>
                  </div>
                  <footer>
                    <Link href={`/nabidka/${job.slug}`} target="_blank">Veřejný náhled ↗</Link>
                    <Link href={`/firma/nabidky/${job.id}/prihlasky`}>Zobrazit kandidáty</Link>
                    {job.status === "published" ? (
                      <form action={closeAction}><button type="submit">Uzavřít nabídku</button></form>
                    ) : job.status === "closed" ? (
                      <form action={renewAction}><button type="submit">Obnovit nabídku</button></form>
                    ) : null}
                  </footer>
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
