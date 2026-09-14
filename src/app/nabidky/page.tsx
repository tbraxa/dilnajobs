import type { Metadata } from "next";
import { JobCard } from "@/components/job-card";
import { JobFilters } from "@/components/job-filters";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
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

  return (
    <main className="shell py-8 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <header className="lg:col-span-12">
          <p className="label">Katalog</p>
          <h1 className="display mt-2 text-3xl leading-[0.95] sm:text-5xl">Nabídky práce</h1>
          <p className="mt-3 max-w-2xl text-sm text-steel">
            Řazení a filtry berou data z databáze. Agenturní inzeráty tady nejsou — a nebudou.
          </p>
        </header>
        <div className="lg:col-span-12">
          <JobFilters defaults={query} />
        </div>
        <p className="label lg:col-span-12">
          {catalog.ok
            ? `${jobs.length} ${jobs.length === 1 ? "nabídka" : jobs.length < 5 ? "nabídky" : "nabídek"}`
            : "Katalog je dočasně nedostupný."}
        </p>
        <div className="grid gap-2 lg:col-span-12">
          {!catalog.ok ? (
            <CatalogUnavailable />
          ) : jobs.length === 0 ? (
            <p className="border border-line bg-paper p-4 text-sm">
              Na tento filtr teď nic nemáme. Zkuste jiné město nebo pozici.
            </p>
          ) : (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>
      </div>
    </main>
  );
}
