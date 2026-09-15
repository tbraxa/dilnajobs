import type { Metadata } from "next";
import { JobCard } from "@/components/job-card";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { ButtonLink } from "@/components/ui";
import { copy } from "@/lib/copy";
import { loadFeaturedJobs } from "@/lib/jobs/search";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: copy.home.metaTitle,
  description: copy.home.metaDescription,
};

export default async function HomePage() {
  const catalog = await loadFeaturedJobs(6);
  const jobs = catalog.ok ? catalog.rows : [];
  return (
    <main>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{copy.claim}</h1>
          <p className="mt-4 max-w-xl text-base text-steel sm:text-lg">{copy.home.helper}</p>
          <form action="/nabidky" method="get" className="mt-7 grid gap-3 sm:grid-cols-12">
            <label className="sm:col-span-5">
              <span className="label">{copy.home.labelQuery}</span>
              <input
                name="q"
                placeholder={copy.home.placeholderQuery}
                className="mt-1 w-full rounded-[2px] border border-line bg-paper px-3 py-2.5"
              />
            </label>
            <label className="sm:col-span-4">
              <span className="label">{copy.home.labelPlace}</span>
              <input
                name="place"
                placeholder={copy.home.placeholderPlace}
                className="mt-1 w-full rounded-[2px] border border-line bg-paper px-3 py-2.5"
              />
            </label>
            <div className="flex items-end sm:col-span-3">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-[2px] bg-accent px-4 py-2.5 text-sm font-semibold text-white"
              >
                {copy.home.ctaSearch}
              </button>
            </div>
          </form>
          <div className="mt-5">
            <ButtonLink href="/pro-firmy" variant="ghost">
              {copy.home.ctaEmployers}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">{copy.home.sectionLatest}</h2>
          <a href="/nabidky" className="text-sm underline">
            {copy.nav.nabidky}
          </a>
        </div>
        <div className="mt-4 grid gap-3">
          {!catalog.ok ? (
            <CatalogUnavailable title={copy.nabidky.emptyErrorTitle} detail={copy.nabidky.emptyErrorBody} />
          ) : jobs.length === 0 ? (
            <p className="border border-line p-4 text-sm text-steel">{copy.nabidky.emptyNoResultsBody}</p>
          ) : (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>
      </section>
    </main>
  );
}
