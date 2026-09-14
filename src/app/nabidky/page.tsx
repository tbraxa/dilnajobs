import type { Metadata } from "next";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { FilterHq } from "@/components/preview/filter-hq";
import { JobsTable } from "@/components/preview/jobs";
import { parseSearch, loadSearchJobs } from "@/lib/jobs/search";
import { hasActiveFilters } from "@/lib/search-params";

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
  const filtered = hasActiveFilters(query);

  return (
    <main>
      <section className="seek-head">
        <div>
          <p className="eyebrow">Nabídky / CZ</p>
          <h1>Nabídky</h1>
        </div>
        <a href="/pro-firmy" className="btn btn-ghost btn-square">
          Jste firma?
        </a>
      </section>

      <FilterHq defaults={query} />

      <div className="results-meta">
        <span>
          {catalog.ok
            ? `${count} ${countLabel}${filtered ? "" : " · řazeno od nejnovějších"}`
            : "Nabídky teď nejsou k dispozici."}
        </span>
        {filtered ? (
          <a href="/nabidky">Zrušit filtry</a>
        ) : (
          <span>Přímo od firem</span>
        )}
      </div>

      <section className="section-band" aria-label="Výsledky">
        {!catalog.ok ? (
          <CatalogUnavailable />
        ) : jobs.length === 0 ? (
          <div className="empty-seek">
            <p className="lead">
              Na tento filtr teď nic nemáme. Zkuste jiné město nebo pozici, nebo{" "}
              <a href="/nabidky">zrušte filtry</a>. Hlídání nabídek ještě nemáme — když chcete vědět, až se něco objeví, napište na{" "}
              <a href="mailto:ahoj@dilnajobs.cz?subject=Upozornit%20m%C4%9B">ahoj@dilnajobs.cz</a>.
            </p>
          </div>
        ) : (
          <JobsTable jobs={jobs} goLabel="Otevřít →" />
        )}
      </section>

      <section className="cta-panel">
        <div>
          <h2>Nenašli jste svou profesi?</h2>
          <p>Napište, co hledáte. Až se objeví odpovídající nabídka, dáme vědět — bez spamu.</p>
        </div>
        <a href="mailto:ahoj@dilnajobs.cz?subject=Hledám%20profesi" className="btn btn-accent btn-lg btn-square">
          Napsat →
        </a>
      </section>
    </main>
  );
}
