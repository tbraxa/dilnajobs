import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { JobsTable } from "@/components/preview/jobs";
import { QuickChips, SearchPanel } from "@/components/preview/search-panel";
import { loadFeaturedJobs } from "@/lib/jobs/search";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await loadFeaturedJobs(8);
  const jobs = catalog.ok ? catalog.rows : [];
  const count = jobs.length;
  const countLabel = count === 1 ? "nabídka" : count < 5 ? "nabídky" : "nabídek";

  return (
    <main>
      <section className="seek-board" aria-label="Hledat práci">
        <div className="seek-hero">
          <h1>Práce ve výrobě. Přímo od firem.</h1>
          <SearchPanel />
          <QuickChips />
        </div>

        <div className="results-meta">
          <span>
            {catalog.ok
              ? jobs.length > 0
                ? `${count} ${countLabel} teď online`
                : "Na nástěnce teď nic není"
              : "Nabídky teď nejsou k dispozici"}
          </span>
          <a href="/nabidky">Všechny nabídky →</a>
        </div>

        {!catalog.ok ? (
          <CatalogUnavailable />
        ) : jobs.length === 0 ? (
          <div className="empty-seek">
            <p className="lead">
              Hledání nahoře funguje — zkuste CNC nebo Ostravu. Hlídání nabídek ještě nemáme, když chcete vědět, až se něco objeví, napište na{" "}
              <a href="mailto:ahoj@dilnajobs.cz?subject=Upozornit%20m%C4%9B">ahoj@dilnajobs.cz</a>.
            </p>
          </div>
        ) : (
          <JobsTable jobs={jobs} goLabel="Otevřít →" />
        )}
      </section>

      <section className="hero-how" id="jak" aria-label="Jak to funguje">
        <div className="hero-how-intro">
          <p className="eyebrow">Jak to funguje</p>
          <p>Vyberete nabídku, odpovíte firmě — zavolají oni. Bez registrace.</p>
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
              <p>Jméno, telefon, volitelně CV.</p>
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

      <section className="employer-strip" aria-labelledby="firmy-title">
        <div className="es-copy">
          <p className="eyebrow">Pro firmy</p>
          <h2 id="firmy-title">Hledáte lidi do výroby?</h2>
          <p>Inzerujte tam, kde uchazeči filtrují podle profese a mzdy. Odpovědi jdou rovnou k vám.</p>
          <div className="hero-ctas">
            <a href="/firma/registrace" className="btn btn-accent btn-lg btn-square">
              Vystavit nabídku
            </a>
            <a href="/pro-firmy#cenik" className="btn btn-secondary btn-lg btn-square">
              Zobrazit ceník →
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
