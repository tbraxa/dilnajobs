import Link from "next/link";
import { JobCard } from "@/components/job-card";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { SearchHero } from "@/components/search-hero";
import { loadFeaturedJobs } from "@/lib/jobs/search";
import { copy } from "@/lib/copy";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await loadFeaturedJobs(6);
  const jobs = catalog.ok ? catalog.rows : [];

  return (
    <main id="main">
      <SearchHero
        title={copy.home.claim}
        lead={copy.home.helper}
        showHints
      />

      <div className="page">
        <div className="facts" aria-label="Proč FairJobs">
          <div className="fact">
            <b>{copy.home.fact1Title}</b>
            <span>{copy.home.fact1Body}</span>
          </div>
          <div className="fact">
            <b>{copy.home.fact2Title}</b>
            <span>{copy.home.fact2Body}</span>
          </div>
          <div className="fact">
            <b>{copy.home.fact3Title}</b>
            <span>{copy.home.fact3Body}</span>
          </div>
        </div>

        <div className="section-head" style={{ marginTop: 40 }}>
          <h2>{copy.home.sectionLatest}</h2>
          <Link href="/nabidky">Všechny nabídky →</Link>
        </div>

        <div className="jobs" role="list">
          {!catalog.ok ? (
            <CatalogUnavailable />
          ) : jobs.length === 0 ? (
            <p className="empty-soft">Na nástěnce teď nic není. Zkuste to později.</p>
          ) : (
            jobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)
          )}
        </div>

        <div className="band" style={{ marginTop: 40 }} id="poradna">
          <div className="grid-3">
            <div className="cell" id="poradna">
              <h2 className="h2">{copy.home.hubPoradna}</h2>
              <p>{copy.home.hubPoradnaBody}</p>
              <Link href="/#poradna">Otevřít poradnu →</Link>
            </div>
            <div className="cell" id="kurzy">
              <h2 className="h2">{copy.home.hubKurzy}</h2>
              <p>{copy.home.hubKurzyBody}</p>
              <Link href="/#kurzy">Procházet kurzy →</Link>
            </div>
            <div className="cell" id="nastroje">
              <h2 className="h2">{copy.home.hubNastroje}</h2>
              <p>{copy.home.hubNastrojeBody}</p>
              <Link href="/#nastroje">Všechny nástroje →</Link>
            </div>
          </div>
        </div>

        <div className="band band-pad" style={{ marginTop: 16 }} id="pro-firmy">
          <div className="employer-cta">
            <div>
              <h2 className="h2" style={{ fontSize: 20, marginBottom: 6 }}>
                {copy.home.employerTitle}
              </h2>
              <p className="muted" style={{ margin: 0, maxWidth: 480, fontSize: 14 }}>
                {copy.home.employerBody}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/firma/prihlaseni">
                {copy.home.employerCta}
              </Link>
              <Link className="btn btn-secondary" href="/pro-firmy">
                {copy.home.employerSecondary}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
