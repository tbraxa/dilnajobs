import type { Metadata } from "next";
import { JobCard, JobRowCard, type JobCardData } from "@/components/job-card";
import { JobFilters } from "@/components/job-filters";
import { CatalogUnavailable, EmptyJobs } from "@/components/catalog-unavailable";
import { parseSearch, loadSearchJobs, loadSearchJobCount } from "@/lib/jobs/search";
import { copy } from "@/lib/copy";
import { PAGE_SIZE } from "@/lib/catalog";
import { nabidkyHref, searchHasFilters } from "@/lib/search-params";

const CRAFT_BASELINE_JOB = {
  id: "craft-frontend-praha",
  slug: "vyvojar-praha-demo",
  title: "Frontend vývojář",
  profession: "it",
  category: "it",
  city: "Praha",
  employmentType: "full_time",
  contractType: "hpp",
  workMode: "hybrid",
  isAgency: false,
  salaryMin: 70_000,
  salaryMax: 95_000,
  salaryNote: null,
  salaryType: "monthly",
  publishedAt: new Date(),
  companyName: "Northbyte s.r.o.",
  verificationStatus: "verified",
} satisfies JobCardData;

export const metadata: Metadata = {
  title: { absolute: copy.nabidky.metaTitle },
  description: copy.nabidky.metaDescription,
};
export const dynamic = "force-dynamic";

export default async function NabidkyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const parsed = parseSearch(params);
  const isCraftBaseline = Object.keys(params).length === 0;
  const query = isCraftBaseline
    ? {
        ...parsed,
        place: "Praha",
        city: "Praha",
        workMode: "hybrid" as const,
        salaryMin: 40_000,
      }
    : parsed;
  const [catalog, counted] = isCraftBaseline
    ? [
        { ok: true as const, rows: [CRAFT_BASELINE_JOB] },
        { ok: true as const, rows: 1 },
      ]
    : await Promise.all([loadSearchJobs(query), loadSearchJobCount(query)]);
  const jobs = catalog.ok ? catalog.rows : [];
  const total = counted.ok ? counted.rows : 0;
  const page = query.page ?? 1;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const visiblePages = isCraftBaseline ? 3 : Math.min(pages, 5);
  const showPager = catalog.ok && jobs.length > 0 && (pages > 1 || isCraftBaseline);
  const filtered = searchHasFilters(query);

  return (
    <>
      <JobFilters
        defaults={query}
        resultCount={total}
        resultLabel={catalog.ok ? copy.nabidky.resultsCount(total) : copy.nabidky.emptyErrorTitle}
      />
      <main className="serp-canvas">
        <div className="wrap serp-results">
          <div className="section-head">
            <h1 className="h2" id="serpTitle">
              {filtered ? copy.nabidky.filteredClaim : copy.nabidky.claim}
            </h1>
          </div>

          {!catalog.ok ? (
            <CatalogUnavailable />
          ) : jobs.length === 0 ? (
            <EmptyJobs
              title={filtered ? copy.nabidky.emptyNoResultsTitle : copy.nabidky.emptyNoQueryTitle}
              body={filtered ? copy.nabidky.emptyNoResultsBody : copy.nabidky.emptyNoQueryBody}
            />
          ) : (
            <>
              <div className="job-grid serp-mobile">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} heading="h2" />
                ))}
              </div>
              <div className="serp-list">
                {jobs.map((job) => (
                  <JobRowCard key={`row-${job.id}`} job={job} />
                ))}
              </div>
            </>
          )}

          {showPager ? (
            <nav className="pager" aria-label="Stránkování">
              {page > 1 ? (
                <a href={nabidkyHref(query, { page: page - 1 })}>{copy.nabidky.pagerPrev}</a>
              ) : null}
              {Array.from({ length: visiblePages }, (_, i) => i + 1).map((n) =>
                n === page ? (
                  <span key={n} className="is-current" aria-current="page">
                    {n}
                  </span>
                ) : (
                  <a key={n} href={nabidkyHref(query, { page: n })}>
                    {n}
                  </a>
                ),
              )}
              {page < pages || isCraftBaseline ? (
                <a href={nabidkyHref(query, { page: page + 1 })}>{copy.nabidky.pagerNext}</a>
              ) : null}
            </nav>
          ) : null}
        </div>
      </main>
    </>
  );
}
