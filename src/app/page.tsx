import Link from "next/link";
import { JobCard } from "@/components/job-card";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { SearchHero } from "@/components/search-hero";
import { loadFeaturedJobs } from "@/lib/jobs/search";
import { BRAND_CLAIM } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await loadFeaturedJobs(6);
  const jobs = catalog.ok ? catalog.rows : [];

  return (
    <main id="main">
      <SearchHero
        title="Najděte férovou práci"
        lead="Transparentní mzdy. Ověřené firmy. Jedno hledání — jako na Jobs.cz, bez šumu."
        showHints
      />

      <div className="page">
        <div className="facts" aria-label="Proč FairJobs">
          <div className="fact">
            <b>Mzda na první pohled</b>
            <span>Každá nabídka ukazuje odměnu — nebo upřímné „Neuvedeno“.</span>
          </div>
          <div className="fact">
            <b>Ověřené firmy</b>
            <span>Verified značka u firem s potvrzenou identitou a aktivními nabídkami.</span>
          </div>
          <div className="fact">
            <b>Jedno hledání</b>
            <span>Klíčové slovo + lokalita. Filtry v draweru — ne polovina obrazovky.</span>
          </div>
        </div>

        <div className="section-head" style={{ marginTop: 40 }}>
          <h2>Vybrané nabídky</h2>
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
              <p className="kicker">Poradna</p>
              <h2 className="h2">Rady, které sedí na realitu</h2>
              <p>Jak vyjednat mzdu, změnit obor, nebo se připravit na pohovor — bez clickbaitů.</p>
              <Link href="/#poradna">Otevřít poradnu →</Link>
            </div>
            <div className="cell" id="kurzy">
              <p className="kicker">Kurzy</p>
              <h2 className="h2">Rekvalifikace a skill upgrade</h2>
              <p>Kurzy podle oboru, online i prezenční. Transparentní cesty k financování.</p>
              <Link href="/#kurzy">Procházet kurzy →</Link>
            </div>
            <div className="cell" id="nastroje">
              <p className="kicker">Nástroje</p>
              <h2 className="h2">Kalkulačky a checklisty</h2>
              <p>Čistá mzda, srovnání platů, checklist pohovoru — rychlé nástroje bez účtu.</p>
              <Link href="/#nastroje">Všechny nástroje →</Link>
            </div>
          </div>
        </div>

        <div className="band band-pad" style={{ marginTop: 16 }} id="pro-firmy">
          <div className="employer-cta">
            <div>
              <p className="kicker" style={{ margin: "0 0 8px" }}>
                Pro firmy
              </p>
              <h2 className="h2" style={{ fontSize: 20, marginBottom: 6 }}>
                Najímejte s funnel metrikami, ne s dohady
              </h2>
              <p className="muted" style={{ margin: 0, maxWidth: 480, fontSize: 14 }}>
                {BRAND_CLAIM} Přehled, kandidáti, line/area grafy. Konzole ve stylu Vercel — bez pastelového šumu.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/firma/prihlaseni">
                Vyzkoušet konzoli
              </Link>
              <Link className="btn btn-secondary" href="/pro-firmy">
                Ceník
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
