import { copy } from "@/lib/copy";
import type { Metadata } from "next";
import { Suspense } from "react";
import { JobCard } from "@/components/job-card";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { SearchHero } from "@/components/search-hero";
import { ActiveFilterChips, FilterBar } from "@/components/filter-drawer";
import { parseSearch, loadSearchJobs } from "@/lib/jobs/search";

export const metadata: Metadata = { title: "Nabídky práce" };
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
  const filterBits = [query.city, query.q].filter(Boolean).join(" · ");

  return (
    <main id="main">
      <SearchHero
        compact
        title={copy.listings.claim}
        lead={copy.listings.helper}
        defaults={{ q: query.q, city: query.city }}
      />

      <div className="page">
        <div className="results-meta">
          <p className="count">
            {catalog.ok ? (
              <>
                <b>{jobs.length}</b>{" "}
                {jobs.length === 1 ? "nabídka" : jobs.length < 5 ? "nabídky" : "nabídek"}
                {filterBits ? (
                  <>
                    {" · "}
                    <span className="mono">{filterBits}</span>
                  </>
                ) : null}
              </>
            ) : (
              "Katalog je dočasně nedostupný."
            )}
          </p>
          <Suspense fallback={null}>
            <FilterBar sort={query.sort} />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <ActiveFilterChips />
        </Suspense>

        <div className="jobs" role="list">
          {!catalog.ok ? (
            <CatalogUnavailable />
          ) : jobs.length === 0 ? (
            <p className="empty-soft">{copy.listings.emptyBody}</p>
          ) : (
            jobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)
          )}
        </div>
      </div>
    </main>
  );
}
