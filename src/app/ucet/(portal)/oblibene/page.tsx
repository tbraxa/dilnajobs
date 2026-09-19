import Link from "next/link";
import { redirect } from "next/navigation";
import { CompanyLogo } from "@/components/company-logo";
import {
  FavoriteCompanyButton,
  FavoriteJobButton,
} from "@/components/favorite-controls";
import { loadSeekerAccountData } from "@/lib/seeker-account";
import { getSeekerSession } from "@/lib/seeker-auth";
import { formatSalary } from "@/lib/pricing";

function workMode(value: string) {
  if (value === "remote") return "Na dálku";
  if (value === "hybrid") return "Hybrid";
  return "Na místě";
}

export default async function SeekerFavoritesPage() {
  const session = await getSeekerSession();
  if (!session) redirect("/ucet/prihlaseni?next=/ucet/oblibene");
  const data = await loadSeekerAccountData(session.userId);

  return (
    <main className="fj-seeker-page">
      <header className="fj-seeker-page-head">
        <div>
          <p>Váš výběr</p>
          <h1>Oblíbené</h1>
          <span>Nabídky a firmy, ke kterým se chcete vrátit.</span>
        </div>
        <Link href="/nabidky" className="fj-primary-button fj-primary-button-blue">Přidat nabídku</Link>
      </header>

      <nav className="fj-seeker-anchor-nav" aria-label="Sekce oblíbených">
        <a href="#nabidky">Uložené nabídky <span>{data.savedJobs.length}</span></a>
        <a href="#firmy">Oblíbené firmy <span>{data.savedCompanies.length}</span></a>
      </nav>

      <section className="fj-seeker-panel fj-seeker-favorites-panel" id="nabidky">
        <header>
          <div><h2>Uložené nabídky</h2><p>Mzda a místo jsou vidět bez dalšího kliknutí.</p></div>
        </header>
        {data.savedJobs.length ? (
          <div className="fj-seeker-favorite-jobs">
            {data.savedJobs.map((job) => (
              <article key={job.id}>
                <CompanyLogo companyName={job.companyName} className="fj-seeker-company-logo" />
                <div>
                  <span>{job.companyName}</span>
                  <h3><Link href={`/nabidka/${job.slug}`}>{job.title}</Link></h3>
                  <small>{job.city} · {job.region} · {workMode(job.workMode)}</small>
                </div>
                <div className="fj-seeker-favorite-salary">
                  <span>Měsíční mzda</span>
                  <strong>{formatSalary(job.salaryMin, job.salaryMax, job.salaryNote)}</strong>
                </div>
                <FavoriteJobButton
                  jobId={job.id}
                  initialSaved
                  returnTo="/ucet/oblibene"
                  label={`nabídku ${job.title}`}
                />
              </article>
            ))}
          </div>
        ) : (
          <div className="fj-seeker-empty">
            <strong>Žádné uložené nabídky.</strong>
            <p>V seznamu nabídek použijte srdce vpravo.</p>
            <Link href="/nabidky">Najít nabídky →</Link>
          </div>
        )}
      </section>

      <section className="fj-seeker-panel fj-seeker-favorites-panel" id="firmy">
        <header>
          <div><h2>Oblíbené firmy</h2><p>Sledujte firmy, u kterých chcete pracovat.</p></div>
        </header>
        {data.savedCompanies.length ? (
          <div className="fj-seeker-favorite-companies">
            {data.savedCompanies.map((company) => (
              <article key={company.id}>
                <CompanyLogo companyName={company.companyName} className="fj-seeker-company-logo" />
                <div>
                  <span>{company.verificationStatus === "verified" ? "✓ Ověřená firma" : "Firemní profil"}</span>
                  <h3>{company.companyName}</h3>
                  <small>{company.city || "Česko"} · {company.liveJobs} aktivních nabídek</small>
                </div>
                <Link href={`/nabidky?q=${encodeURIComponent(company.companyName)}`}>Zobrazit nabídky →</Link>
                <FavoriteCompanyButton
                  employerId={company.id}
                  initialSaved
                  returnTo="/ucet/oblibene#firmy"
                  label={`firmu ${company.companyName}`}
                />
              </article>
            ))}
          </div>
        ) : (
          <div className="fj-seeker-empty">
            <strong>Zatím nesledujete žádnou firmu.</strong>
            <p>Firmu uložíte na detailu její nabídky.</p>
            <Link href="/nabidky">Procházet firmy v nabídkách →</Link>
          </div>
        )}
      </section>
    </main>
  );
}
