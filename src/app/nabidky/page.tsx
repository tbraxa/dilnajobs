import type { Metadata } from "next";
import Link from "next/link";
import { JobResultRow } from "@/components/fairjobs-job-row";
import { JobSearchPanel } from "@/components/job-search-panel";
import { JsonLd } from "@/components/json-ld";
import {
  JOBS_PAGE_SIZE,
  loadSearchJobCount,
  loadSearchJobs,
  parseSearch,
} from "@/lib/jobs/search";
import { jobsHref, searchHasFilters } from "@/lib/search-params";
import { collectionPageJsonLd } from "@/lib/structured-data";

const description = "Aktuální nabídky práce v Česku s jasnou mzdou, lokalitou a ověřenou identitou firmy.";

export const metadata: Metadata = { title: "Nabídky práce", description };
export const dynamic = "force-dynamic";

export default async function NabidkyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = parseSearch(params);
  const [catalog, countCatalog] = await Promise.all([
    loadSearchJobs(query),
    loadSearchJobCount(query),
  ]);
  const jobs = catalog.ok ? catalog.rows : [];
  const count = countCatalog.ok ? countCatalog.rows : jobs.length;
  const currentPage = query.page ?? 1;
  const pageCount = Math.max(1, Math.ceil(count / JOBS_PAGE_SIZE));

  return (
    <main className="fj-serp-page">
      <JsonLd
        id="fairjobs-jobs-collection"
        data={collectionPageJsonLd({
          name: "Nabídky práce FairJobs",
          description,
          path: "/nabidky",
        })}
      />
      <section className="fj-serp-banner">
        <div>
          <h1 className="fj-display">Nabídky práce</h1>
          <p>Mzda, firma a podmínky přehledně před otevřením detailu.</p>
        </div>
        <Link href="/ucet/oblibene">Vaše uložené nabídky →</Link>
      </section>

      <div className="fj-serp-shell">
        <JobSearchPanel query={query} resultCount={count} />

        <section className="fj-results-region" aria-labelledby="results-title">
          <div className="fj-results-head">
            <div>
              <h2 id="results-title">
                {catalog.ok ? `${count} ${count === 1 ? "nabídka" : count < 5 ? "nabídky" : "nabídek"}` : "Nabídky"}
              </h2>
              <p>
                {searchHasFilters(query)
                  ? "Výsledky podle vašich filtrů"
                  : "Firma · role · lokalita · mzda"}
              </p>
            </div>
            {searchHasFilters(query) ? (
              <Link href="/nabidky" className="fj-clear-results">
                Zrušit filtry
              </Link>
            ) : null}
          </div>

          <div className="fj-job-ledger">
            <div className="fj-job-ledger-head" aria-hidden="true">
              <span>Firma a pozice</span>
              <span>Lokalita</span>
              <span>Odměna</span>
            </div>

            {!catalog.ok ? (
              <div className="fj-empty-results">
                <strong>Katalog se teď nepodařilo načíst.</strong>
                <p>Zkuste stránku obnovit za chvíli.</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="fj-empty-results">
                <strong>Na tento výběr teď nic nemáme.</strong>
                <p>Zkuste jiné město, nižší mzdu nebo širší název pozice.</p>
                <Link href="/nabidky" className="fj-secondary-button">Zobrazit všechny nabídky</Link>
              </div>
            ) : (
              jobs.map((job) => <JobResultRow key={job.id} job={job} />)
            )}
          </div>

          {catalog.ok && pageCount > 1 ? (
            <nav className="fj-pagination" aria-label="Stránkování nabídek">
              {currentPage > 1 ? (
                <Link href={jobsHref(query, { page: currentPage - 1 })}>← Předchozí</Link>
              ) : <span />}
              <p>Strana {currentPage} z {pageCount}</p>
              {currentPage < pageCount ? (
                <Link href={jobsHref(query, { page: currentPage + 1 })}>Další →</Link>
              ) : <span />}
            </nav>
          ) : null}
        </section>

        <aside className="fj-serp-note">
          <div>
            <span aria-hidden="true">✓</span>
            <p><strong>Ověřená firma</strong> znamená, že jsme zkontrolovali její IČO a identitu.</p>
          </div>
          <Link href="/pro-firmy">Jste zaměstnavatel? Vložit nabídku →</Link>
        </aside>
      </div>
    </main>
  );
}
