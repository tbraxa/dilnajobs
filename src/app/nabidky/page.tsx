import type { Metadata } from "next";
import Link from "next/link";
import { FavoriteLoginContinuation } from "@/components/favorite-login-continuation";
import { JobResultRow } from "@/components/fairjobs-job-row";
import { JobSearchPanel } from "@/components/job-search-panel";
import { JsonLd } from "@/components/json-ld";
import {
  JOBS_PAGE_SIZE,
  loadSearchJobCount,
  loadSearchJobs,
  parseSearch,
} from "@/lib/jobs/search";
import { getFavoriteJobIds } from "@/lib/seeker-account";
import { getSeekerSession } from "@/lib/seeker-auth";
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
  const pendingJobId =
    typeof params.ulozit === "string" && /^[0-9a-f-]{36}$/i.test(params.ulozit)
      ? params.ulozit
      : null;
  const query = parseSearch(params);
  const [catalog, countCatalog, seeker] = await Promise.all([
    loadSearchJobs(query),
    loadSearchJobCount(query),
    getSeekerSession(),
  ]);
  const jobs = catalog.ok ? catalog.rows : [];
  const favoriteIds = seeker
    ? await getFavoriteJobIds(seeker.userId, jobs.map((job) => job.id))
    : new Set<string>();
  const count = countCatalog.ok ? countCatalog.rows : jobs.length;
  const currentPage = query.page ?? 1;
  const pageCount = Math.max(1, Math.ceil(count / JOBS_PAGE_SIZE));

  return (
    <main className="fj-jobs-explorer">
      {pendingJobId ? (
        <FavoriteLoginContinuation
          id={pendingJobId}
          kind="job"
          returnTo={jobsHref(query)}
        />
      ) : null}
      <JsonLd
        id="fairjobs-jobs-collection"
        data={collectionPageJsonLd({
          name: "Nabídky práce FairJobs",
          description,
          path: "/nabidky",
        })}
      />
      <section className="fj-jobs-workbench">
        <header className="fj-jobs-workbench-head">
          <div>
            <span>FairJobs / Nabídky</span>
            <h1>Nabídky práce</h1>
          </div>
          <p>Mzda, firma a podmínky přehledně před otevřením detailu.</p>
          <Link href="/ucet/oblibene">Uložené nabídky →</Link>
        </header>
        <JobSearchPanel query={query} resultCount={count} />
      </section>

      <section className="fj-jobs-results" aria-labelledby="results-title">
        <header className="fj-jobs-results-head">
          <div>
            <h2 id="results-title">
              {catalog.ok ? `${count} ${count === 1 ? "nabídka" : count < 5 ? "nabídky" : "nabídek"}` : "Nabídky"}
            </h2>
            <p>
              {searchHasFilters(query)
                ? "Výsledky podle vašich filtrů"
                : "Firma · role · lokalita · měsíční mzda"}
            </p>
          </div>
          {searchHasFilters(query) ? (
            <Link href="/nabidky" className="fj-clear-results">
              Zrušit filtry
            </Link>
          ) : null}
        </header>

        <div className="fj-jobs-feed">
          <div className="fj-jobs-feed-head" aria-hidden="true">
            <span>Firma / pozice</span>
            <span>Místo</span>
            <span>Kompenzace</span>
            <span />
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
            jobs.map((job) => (
              <JobResultRow
                key={job.id}
                job={job}
                isFavorite={favoriteIds.has(job.id)}
                returnTo={jobsHref(query)}
              />
            ))
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

      <div className="fj-jobs-footer-note">
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
