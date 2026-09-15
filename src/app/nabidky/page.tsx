import type { Metadata } from "next";
import { JobCard } from "@/components/job-card";
import { JobFilters } from "@/components/job-filters";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { parseSearch, loadSearchJobs, loadSearchJobCount } from "@/lib/jobs/search";
import { copy } from "@/lib/copy";
import { PAGE_SIZE } from "@/lib/catalog";
import { searchHasFilters } from "@/lib/search-params";

export const metadata: Metadata = {
  title: { absolute: copy.nabidky.metaTitle },
  description: copy.nabidky.metaDescription,
};
export const dynamic = "force-dynamic";

function hrefWithPage(query: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const s = params.toString();
  return s ? `/nabidky?${s}` : "/nabidky";
}

export default async function NabidkyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = parseSearch(params);
  const [catalog, counted] = await Promise.all([loadSearchJobs(query), loadSearchJobCount(query)]);
  const jobs = catalog.ok ? catalog.rows : [];
  const total = counted.ok ? counted.rows : 0;
  const page = query.page ?? 1;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const compactQuery = {
    q: query.q,
    place: query.place,
    category: query.category,
    salaryMin: query.salaryMin != null ? String(query.salaryMin) : undefined,
    sort: query.sort !== "newest" ? query.sort : undefined,
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">{copy.nabidky.claim}</h1>
      <p className="mt-2 max-w-2xl text-sm text-steel">{copy.nabidky.helper}</p>
      <div className="mt-6">
        <JobFilters defaults={query} />
      </div>
      <p className="mt-4 text-sm text-steel">
        {catalog.ok
          ? `${copy.nabidky.sectionResults}: ${total}`
          : copy.nabidky.emptyErrorTitle}
      </p>
      <div className="mt-3 grid gap-3">
        {!catalog.ok ? (
          <CatalogUnavailable />
        ) : jobs.length === 0 ? (
          <div className="border border-line p-4 text-sm">
            <p className="font-semibold">
              {searchHasFilters(query) ? copy.nabidky.emptyNoResultsTitle : copy.nabidky.emptyNoQueryTitle}
            </p>
            <p className="mt-2 text-steel">
              {searchHasFilters(query) ? copy.nabidky.emptyNoResultsBody : copy.nabidky.emptyNoQueryBody}
            </p>
            <a href="/nabidky" className="mt-3 inline-block underline">
              {copy.nabidky.emptyNoResultsCta}
            </a>
          </div>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
      {catalog.ok && pages > 1 ? (
        <nav className="mt-6 flex items-center gap-4 text-sm" aria-label="Stránkování">
          {page > 1 ? (
            <a className="underline" href={hrefWithPage(compactQuery, page - 1)}>
              Předchozí
            </a>
          ) : null}
          <span>
            {page} / {pages}
          </span>
          {page < pages ? (
            <a className="underline" href={hrefWithPage(compactQuery, page + 1)}>
              Další
            </a>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}
