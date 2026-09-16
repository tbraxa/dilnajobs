import Link from "next/link";
import { getSession } from "@/lib/auth";
import {
  applicationStatusLabels,
  loadEmployerConsoleData,
} from "@/lib/employer-console";
import { updateApplicationStatusAction } from "@/lib/actions/employer-console";
import { cleanUiText } from "@/lib/fairjobs-visual";

const pipeline = [
  { value: "all", label: "Všichni" },
  { value: "new", label: "Noví" },
  { value: "reviewing", label: "Posouzení" },
  { value: "interview", label: "Pohovor" },
  { value: "hired", label: "Přijatí" },
] as const;

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export default async function EmployerApplicationsPage({
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
  const status = typeof params.stav === "string" ? params.stav : "all";
  const positionId = typeof params.pozice === "string" ? params.pozice : undefined;
  const positionApplications = positionId
    ? data.applications.filter((application) => application.jobId === positionId)
    : data.applications;
  const visible = status === "all"
    ? positionApplications
    : positionApplications.filter((application) => application.status === status);
  const selectedId = typeof params.vybrat === "string" ? params.vybrat : visible[0]?.id;
  const selected = data.applications.find((application) => application.id === selectedId) ?? visible[0];
  const jobById = new Map(data.jobs.map((job) => [job.id, job]));
  const selectedJob = selected ? jobById.get(selected.jobId) : undefined;
  const positionJob = positionId ? jobById.get(positionId) : undefined;

  return (
    <main className="fj-console-page fj-console-inbox-page">
      <header className="fj-console-page-head">
        <div>
          <p>Doručená pošta</p>
          <h1>{positionJob ? cleanUiText(positionJob.title) : "Kandidáti"}</h1>
          <span>{positionJob ? "Kandidáti pro vybranou nabídku." : "Odpovědi, kontakty a stav výběru na jednom místě."}</span>
        </div>
      </header>

      <nav className="fj-console-tabs" aria-label="Filtrovat kandidáty">
        {pipeline.map((item) => {
          const count = item.value === "all"
            ? positionApplications.length
            : positionApplications.filter((application) => application.status === item.value).length;
          const query = new URLSearchParams({
            ...(positionId ? { pozice: positionId } : {}),
            ...(item.value !== "all" ? { stav: item.value } : {}),
          });
          return (
            <Link
              href={query.size ? `/firma/prihlasky?${query}` : "/firma/prihlasky"}
              className={status === item.value ? "active" : ""}
              key={item.value}
            >
              {item.label} <span>{count}</span>
            </Link>
          );
        })}
      </nav>

      <div className="fj-console-inbox">
        <section className="fj-console-inbox-list" aria-label="Seznam kandidátů">
          {visible.length === 0 ? (
            <div className="fj-console-empty">
              <strong>V tomto kroku nikdo není</strong>
              <p>Zvolte jinou část výběru.</p>
            </div>
          ) : (
            visible.map((application) => {
              const job = jobById.get(application.jobId);
              const href = `/firma/prihlasky?${new URLSearchParams({
                ...(status !== "all" ? { stav: status } : {}),
                ...(positionId ? { pozice: positionId } : {}),
                vybrat: application.id,
              })}`;
              return (
                <Link href={href} className={selected?.id === application.id ? "active" : ""} key={application.id}>
                  <span className="fj-console-avatar">{initials(application.fullName)}</span>
                  <div>
                    <strong>{cleanUiText(application.fullName)}</strong>
                    <small>{cleanUiText(job?.title) || "Nabídka práce"}</small>
                    <time dateTime={application.createdAt.toISOString()}>
                      {application.createdAt.toLocaleDateString("cs-CZ", { day: "numeric", month: "long" })}
                    </time>
                  </div>
                  <span className={`fj-console-status status-${application.status}`}>
                    {applicationStatusLabels[application.status] ?? application.status}
                  </span>
                </Link>
              );
            })
          )}
        </section>

        <section className="fj-console-candidate-detail">
          {!selected ? (
            <div className="fj-console-empty">
              <strong>Vyberte kandidáta</strong>
              <p>Detail odpovědi se zobrazí tady.</p>
            </div>
          ) : (
            <>
              <header>
                <span className="fj-console-avatar large">{initials(selected.fullName)}</span>
                <div>
                  <p>{cleanUiText(selectedJob?.title) || "Nabídka práce"}</p>
                  <h2>{cleanUiText(selected.fullName)}</h2>
                  <span className={`fj-console-status status-${selected.status}`}>
                    {applicationStatusLabels[selected.status] ?? selected.status}
                  </span>
                </div>
              </header>

              <div className="fj-console-contact-grid">
                <a href={`tel:${selected.phone}`}><span>Telefon</span><strong>{selected.phone}</strong></a>
                {selected.email ? (
                  <a href={`mailto:${selected.email}`}><span>E-mail</span><strong>{selected.email}</strong></a>
                ) : (
                  <div><span>E-mail</span><strong>Neuveden</strong></div>
                )}
              </div>

              <div className="fj-console-message">
                <span>Zpráva kandidáta</span>
                <p>{cleanUiText(selected.message) || "Kandidát neposlal doprovodnou zprávu."}</p>
              </div>

              <div className="fj-console-document">
                <div>
                  <span>Životopis</span>
                  <strong>{selected.cvFileName ?? "Bez přiloženého souboru"}</strong>
                </div>
                {selected.cvObjectKey ? (
                  <a href={`/firma/nabidky/${selected.jobId}/prihlasky/${selected.id}/cv`}>Stáhnout CV</a>
                ) : null}
              </div>

              <div className="fj-console-pipeline-actions">
                <span>Posunout ve výběru</span>
                <div>
                  {(["reviewing", "interview", "hired", "rejected"] as const).map((nextStatus) => {
                    const action = updateApplicationStatusAction.bind(null, selected.id, selected.jobId);
                    return (
                      <form action={action} key={nextStatus}>
                        <input type="hidden" name="status" value={nextStatus} />
                        <button type="submit" className={selected.status === nextStatus ? "active" : ""}>
                          {applicationStatusLabels[nextStatus]}
                        </button>
                      </form>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
