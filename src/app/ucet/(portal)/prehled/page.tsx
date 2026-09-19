import Link from "next/link";
import { redirect } from "next/navigation";
import { FavoriteJobButton } from "@/components/favorite-controls";
import { loadSeekerAccountData } from "@/lib/seeker-account";
import { getSeekerSession } from "@/lib/seeker-auth";
import { formatSalary } from "@/lib/pricing";

const applicationStatusLabels: Record<string, string> = {
  new: "Odesláno",
  reviewing: "Firma prohlíží",
  interview: "Pohovor",
  hired: "Přijato",
  rejected: "Uzavřeno",
};

export default async function SeekerOverviewPage() {
  const session = await getSeekerSession();
  if (!session) redirect("/ucet/prihlaseni?next=/ucet/prehled");
  const data = await loadSeekerAccountData(session.userId);
  const profile = data.profile;
  const profileFields = [
    profile?.name,
    profile?.phone,
    profile?.city,
    profile?.desiredRole,
    profile?.bio,
  ];
  const completeness = Math.round(
    (profileFields.filter((value) => Boolean(value)).length / profileFields.length) * 100,
  );

  return (
    <main className="fj-seeker-page">
      <header className="fj-seeker-page-head">
        <div>
          <p>Dobrý den, {session.name.split(/\s+/)[0]}</p>
          <h1>Přehled</h1>
          <span>Uložené příležitosti a další krok na jednom místě.</span>
        </div>
        <Link href="/nabidky" className="fj-primary-button fj-primary-button-blue">Najít další práci</Link>
      </header>

      <section className="fj-seeker-metrics" aria-label="Souhrn účtu">
        <a href="#odpovedi">
          <span>Odeslané odpovědi</span>
          <strong>{data.applicationHistory.length}</strong>
          <small>Historie odpovědí z vašeho účtu</small>
        </a>
        <Link href="/ucet/oblibene">
          <span>Uložené nabídky</span>
          <strong>{data.savedJobs.length}</strong>
          <small>Mzda je vždy vidět v seznamu</small>
        </Link>
        <Link href="/ucet/oblibene#firmy">
          <span>Oblíbené firmy</span>
          <strong>{data.savedCompanies.length}</strong>
          <small>Firmy, ke kterým se chcete vrátit</small>
        </Link>
        <Link href="/ucet/profil">
          <span>Dokončení profilu</span>
          <strong>{completeness} %</strong>
          <small>{completeness === 100 ? "Profil je připravený" : "Doplňte kontakt a zaměření"}</small>
        </Link>
      </section>

      <div className="fj-seeker-dashboard-grid">
        <section className="fj-seeker-panel">
          <header>
            <div><h2>Poslední uložené nabídky</h2><p>Kompenzace bez otevírání detailu.</p></div>
            <Link href="/ucet/oblibene">Všechny →</Link>
          </header>
          {data.savedJobs.length ? (
            <div className="fj-seeker-saved-list">
              {data.savedJobs.slice(0, 4).map((job) => (
                <article key={job.id}>
                  <div>
                    <span>{job.companyName} · {job.city}</span>
                    <h3><Link href={`/nabidka/${job.slug}`}>{job.title}</Link></h3>
                  </div>
                  <strong>{formatSalary(job.salaryMin, job.salaryMax, job.salaryNote)}</strong>
                  <FavoriteJobButton
                    jobId={job.id}
                    initialSaved
                    returnTo="/ucet/prehled"
                    label={`nabídku ${job.title}`}
                  />
                </article>
              ))}
            </div>
          ) : (
            <div className="fj-seeker-empty">
              <strong>Zatím nemáte uloženou nabídku.</strong>
              <p>Srdce v seznamu nabídek ji přidá sem.</p>
              <Link href="/nabidky">Projít nabídky →</Link>
            </div>
          )}
        </section>

        <aside className="fj-seeker-quickstart">
          <span>Další krok</span>
          <h2>{completeness < 100 ? "Doplňte profil pro rychlejší odpověď." : "Profil je připravený."}</h2>
          <p>
            Jméno a kontakt předvyplníme do odpovědi. Před odesláním je vždy můžete změnit.
          </p>
          <Link href="/ucet/profil">{completeness < 100 ? "Doplnit profil" : "Zkontrolovat profil"} →</Link>
        </aside>
      </div>

      <section className="fj-seeker-panel fj-seeker-application-history" id="odpovedi">
        <header>
          <div>
            <h2>Moje odpovědi</h2>
            <p>Historie přihlášek odeslaných z přihlášeného účtu.</p>
          </div>
        </header>
        {data.applicationHistory.length ? (
          <div className="fj-seeker-application-list">
            {data.applicationHistory.map((application) => (
              <article key={application.id}>
                <div>
                  <span>{application.companyName} · {application.city}</span>
                  <h3>
                    {application.jobStatus === "published" ? (
                      <Link href={`/nabidka/${application.slug}`}>{application.title}</Link>
                    ) : (
                      application.title
                    )}
                  </h3>
                </div>
                <time dateTime={application.createdAt.toISOString()}>
                  {application.createdAt.toLocaleDateString("cs-CZ", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </time>
                <span className={`fj-seeker-application-status status-${application.status}`}>
                  {applicationStatusLabels[application.status] ?? application.status}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <div className="fj-seeker-empty">
            <strong>Z účtu jste zatím neodpověděli.</strong>
            <p>Odpovědi bez přihlášení zůstávají záměrně oddělené.</p>
            <Link href="/nabidky">Najít nabídku →</Link>
          </div>
        )}
      </section>
    </main>
  );
}
