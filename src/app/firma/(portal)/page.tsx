import Link from "next/link";
import { getSession } from "@/lib/auth";
import {
  applicationStatusLabels,
  jobStatusLabels,
  loadEmployerConsoleData,
  workModeLabel,
} from "@/lib/employer-console";
import { cleanUiText } from "@/lib/fairjobs-visual";
import { formatSalary } from "@/lib/pricing";

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export default async function FirmaHome({
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
  const orderState = typeof params.objednavka === "string" ? params.objednavka : "";
  const activeJobs = data.jobs.filter((job) => job.status === "published");
  const newApplications = data.applications.filter((application) => application.status === "new");
  const interviews = data.applications.filter((application) => application.status === "interview");
  const openPipeline = data.applications.filter(
    (application) => !["hired", "rejected"].includes(application.status),
  );
  const jobById = new Map(data.jobs.map((job) => [job.id, job]));
  const applicationCount = new Map<string, number>();
  for (const application of data.applications) {
    applicationCount.set(application.jobId, (applicationCount.get(application.jobId) ?? 0) + 1);
  }

  const notice =
    orderState === "ok"
      ? "Platba proběhla. Nový balíček připíšeme po potvrzení platby."
      : orderState === "zruseno"
        ? "Platba byla zrušena. Balíček můžete vybrat znovu v nastavení."
        : orderState === "aktivovano"
          ? "Zkušební balíček je aktivní."
          : orderState === "evidovano" || orderState === "stub"
            ? "Objednávku evidujeme. Potvrzení pošleme na firemní e-mail."
            : "";

  return (
    <main className="fj-console-page">
      <header className="fj-console-page-head">
        <div>
          <p>Dobrý den, {session.name.split(/\s+/)[0]}</p>
          <h1>Přehled náboru</h1>
          <span>Co potřebuje vaši pozornost právě teď.</span>
        </div>
        <Link href="/firma/nabidky/nova" className="fj-console-button primary">Vytvořit nabídku</Link>
      </header>

      {notice ? <div className="fj-console-notice">{notice}</div> : null}

      <section className="fj-console-metrics" aria-label="Souhrn náboru">
        <Link href="/firma/nabidky?stav=published">
          <span>Aktivní nabídky</span>
          <strong>{activeJobs.length}</strong>
          <small>{activeJobs.length ? "Zveřejněné na FairJobs" : "Založte první nabídku"}</small>
        </Link>
        <Link href="/firma/prihlasky?stav=new">
          <span>Nové odpovědi</span>
          <strong>{newApplications.length}</strong>
          <small>{newApplications.length ? "Čekají na první reakci" : "Vše je zpracované"}</small>
        </Link>
        <Link href="/firma/prihlasky?stav=interview">
          <span>Pohovory</span>
          <strong>{interviews.length}</strong>
          <small>V aktuálním výběru</small>
        </Link>
        <Link href="/firma/prihlasky">
          <span>Otevřený výběr</span>
          <strong>{openPipeline.length}</strong>
          <small>Aktivní kandidáti</small>
        </Link>
      </section>

      <div className="fj-console-dashboard-grid">
        <section className="fj-console-panel fj-console-attention">
          <div className="fj-console-panel-head">
            <div><h2>Odpovědi k posouzení</h2><p>Nejnovější kandidáti napříč nabídkami.</p></div>
            <Link href="/firma/prihlasky">Celá doručená pošta →</Link>
          </div>
          <div className="fj-console-candidate-list">
            {data.applications.length === 0 ? (
              <div className="fj-console-empty">
                <strong>Zatím žádné odpovědi</strong>
                <p>Jakmile někdo odpoví na nabídku, objeví se tady.</p>
              </div>
            ) : (
              data.applications.slice(0, 4).map((application) => {
                const job = jobById.get(application.jobId);
                return (
                  <Link href={`/firma/prihlasky?vybrat=${application.id}`} key={application.id}>
                    <span className="fj-console-avatar">{initials(application.fullName)}</span>
                    <div>
                      <strong>{cleanUiText(application.fullName)}</strong>
                      <small>{cleanUiText(job?.title) || "Nabídka práce"}</small>
                    </div>
                    <span className={`fj-console-status status-${application.status}`}>
                      {applicationStatusLabels[application.status] ?? application.status}
                    </span>
                    <time dateTime={application.createdAt.toISOString()}>
                      {application.createdAt.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" })}
                    </time>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        <aside className="fj-console-next">
          <h2>Další krok</h2>
          {newApplications.length ? (
            <>
              <strong>Odpovězte novým kandidátům</strong>
              <p>{newApplications.length} {newApplications.length === 1 ? "odpověď čeká" : "odpovědi čekají"} na posouzení.</p>
              <Link href="/firma/prihlasky?stav=new">Otevřít kandidáty</Link>
            </>
          ) : activeJobs.length ? (
            <>
              <strong>Výběr je pod kontrolou</strong>
              <p>Nemáte žádnou novou odpověď bez reakce.</p>
              <Link href="/firma/nabidky">Zkontrolovat nabídky</Link>
            </>
          ) : (
            <>
              <strong>Publikujte první nabídku</strong>
              <p>Vyplníte mzdu, místo, režim práce a podmínky.</p>
              <Link href="/firma/nabidky/nova">Začít s nabídkou</Link>
            </>
          )}
        </aside>
      </div>

      <section className="fj-console-panel fj-console-jobs-overview">
        <div className="fj-console-panel-head">
          <div><h2>Vaše nabídky</h2><p>Výkon a stav posledních náborů.</p></div>
          <Link href="/firma/nabidky">Spravovat nabídky →</Link>
        </div>
        <div className="fj-console-job-table">
          <div className="fj-console-table-head">
            <span>Pozice</span><span>Stav</span><span>Odpovědi</span><span>Mzda</span><span />
          </div>
          {data.jobs.length === 0 ? (
            <div className="fj-console-empty">
              <strong>Nemáte žádnou nabídku</strong>
              <p>Novou pozici vytvoříte během několika minut.</p>
            </div>
          ) : (
            data.jobs.slice(0, 5).map((job) => (
              <div className="fj-console-job-row" key={job.id}>
                <div><strong>{cleanUiText(job.title)}</strong><small>{cleanUiText(job.city)} · {workModeLabel(job.workMode)}</small></div>
                <span className={`fj-console-status status-${job.status}`}>{jobStatusLabels[job.status] ?? job.status}</span>
                <b>{applicationCount.get(job.id) ?? 0}</b>
                <span>{cleanUiText(formatSalary(job.salaryMin, job.salaryMax, job.salaryNote))}</span>
                <Link href={`/firma/nabidky/${job.id}/prihlasky`} aria-label={`Otevřít ${cleanUiText(job.title)}`}>→</Link>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
