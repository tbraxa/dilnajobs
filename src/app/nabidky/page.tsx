import type { Metadata } from "next";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { FilterChips } from "@/components/preview/filters";
import { JobsTable } from "@/components/preview/jobs";
import { parseSearch, loadSearchJobs } from "@/lib/jobs/search";

export const metadata: Metadata = { title: "Nabídky" };
export const dynamic = "force-dynamic";

export default async function NabidkyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = parseSearch(params);
  const catalog = await loadSearchJobs(query);
  const jobs = catalog.ok ? catalog.rows : [];
  const count = jobs.length;
  const countLabel = count === 1 ? "výsledek" : count < 5 ? "výsledky" : "výsledků";

  return (
    <main>
      <section className="page-hero">
        <div>
          <p className="eyebrow">Katalog / CZ</p>
          <h1>Nabídky</h1>
          <p className="lead">
            Filtrujte podle profese a města. Na mobilu karty, na desktopu přehledná tabulka. Agenturní inzeráty tady
            nejsou.
          </p>
        </div>
        <a href="/pro-firmy" className="btn btn-secondary btn-square">
          Jste firma? →
        </a>
      </section>

      <FilterChips defaults={query} />

      <div className="results-meta">
        <span>
          {catalog.ok ? `${count} ${countLabel} · řazeno: ${query.sort === "salary" ? "mzda" : "nejnovější"}` : "Katalog je dočasně nedostupný."}
        </span>
        <span>Živá databáze</span>
      </div>

      <section className="section-band" aria-label="Výsledky">
        {!catalog.ok ? (
          <CatalogUnavailable />
        ) : jobs.length === 0 ? (
          <p className="lead" style={{ padding: "1.25rem 1.5rem" }}>
            Na tento filtr teď nic nemáme. Zkuste jiné město nebo pozici.
          </p>
        ) : (
          <JobsTable jobs={jobs} goLabel="Otevřít →" />
        )}
      </section>

      <section className="cta-panel">
        <div>
          <h2>Nenašli jste svou profesi?</h2>
          <p>Napište nám, co hledáte. Až se objeví odpovídající nabídka, dáme vědět — bez spamu.</p>
        </div>
        <a href="mailto:ahoj@dilnajobs.cz?subject=Hledám%20profesi" className="btn btn-accent btn-lg btn-square">
          Napsat →
        </a>
      </section>
    </main>
  );
}
