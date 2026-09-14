import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { JobsTable, LiveRows } from "@/components/preview/jobs";
import { loadFeaturedJobs } from "@/lib/jobs/search";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await loadFeaturedJobs(6);
  const jobs = catalog.ok ? catalog.rows : [];
  return (
    <main>
      <section className="hero-board" aria-label="Úvod">
        <div className="hero-main">
          <div>
            <p className="eyebrow">Výroba / CZ</p>
            <h1>
              Práce ve výrobě.
              <br />
              Přímo od <span className="hl">firem</span>.
            </h1>
            <p className="lead">
              CNC, svářeči, seřizovači a další technické pozice. Bez personálních agentur mezi vámi a dílnou.
            </p>
          </div>
          <div className="hero-ctas">
            <a href="/nabidky" className="btn btn-primary btn-lg btn-square">
              Prohlédnout nabídky →
            </a>
            <a href="/pro-firmy" className="btn btn-secondary btn-lg btn-square">
              Vystavit nabídku
            </a>
          </div>
        </div>
        <aside className="hero-live" aria-label="Živý přehled nabídek">
          <div className="live-head">
            <span className="live-label">Živé nabídky</span>
            <a href="/nabidky" className="btn btn-ghost btn-sm">
              Vše →
            </a>
          </div>
          {!catalog.ok ? (
            <CatalogUnavailable />
          ) : jobs.length === 0 ? (
            <p className="lead" style={{ padding: "1.15rem" }}>
              Na nástěnce teď nic není.
            </p>
          ) : (
            <LiveRows jobs={jobs.slice(0, 4)} />
          )}
        </aside>
      </section>

      <section className="hero-how" id="jak" aria-label="Jak to funguje">
        <div className="hero-how-intro">
          <p className="eyebrow">Jak to funguje</p>
          <p>Nabídky přímo od výrobních firem. Odpovíte jedním formulářem — firma vám zavolá sama.</p>
        </div>
        <div className="manifesto-steps">
          <div className="m-step">
            <span className="m-num">01</span>
            <div>
              <strong>Vyberete profesi</strong>
              <p>Filtr podle kraje, směn a mzdy.</p>
            </div>
          </div>
          <div className="m-step">
            <span className="m-num">02</span>
            <div>
              <strong>Odpovíte firmě</strong>
              <p>Jméno, telefon, volitelně CV. Bez registrace.</p>
            </div>
          </div>
          <div className="m-step">
            <span className="m-num">03</span>
            <div>
              <strong>Volají přímo oni</strong>
              <p>Žádná agentura mezi vámi.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band" aria-labelledby="openings-title">
        <div className="section-head">
          <div>
            <p className="eyebrow">Otevřené pozice</p>
            <h2 id="openings-title">Aktuální nabídky</h2>
          </div>
          <a href="/nabidky" className="btn btn-secondary btn-square">
            Všechny nabídky →
          </a>
        </div>
        {!catalog.ok ? (
          <CatalogUnavailable />
        ) : jobs.length === 0 ? (
          <p className="lead" style={{ padding: "1.25rem 2rem" }}>
            Na nástěnce teď nic není. Zkuste to později.
          </p>
        ) : (
          <JobsTable jobs={jobs} />
        )}
      </section>

      <section className="employer-strip" aria-labelledby="firmy-title">
        <div className="es-copy">
          <p className="eyebrow">Pro firmy</p>
          <h2 id="firmy-title">Hledáte lidi do výroby?</h2>
          <p>
            Inzerujte tam, kde uchazeči filtrují podle profese, směn a mzdy — ne podle „jakékoli brigády“. Odpovědi jdou
            rovnou k vám.
          </p>
          <div className="hero-ctas">
            <a href="/pro-firmy#cenik" className="btn btn-accent btn-lg btn-square">
              Zobrazit ceník →
            </a>
            <a href="/pro-firmy" className="btn btn-secondary btn-lg btn-square">
              Více pro firmy
            </a>
          </div>
        </div>
        <div className="es-price">
          <div className="tier">
            <span>Zkušební</span>
            <strong>0&nbsp;Kč</strong>
          </div>
          <div className="tier">
            <span>Inzerát · 30 dní</span>
            <strong>2&nbsp;990&nbsp;Kč</strong>
          </div>
          <div className="tier">
            <span>Basic · měsíc</span>
            <strong>8&nbsp;900&nbsp;Kč</strong>
          </div>
          <div className="tier">
            <span>Standard · měsíc</span>
            <strong>19&nbsp;900&nbsp;Kč</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
