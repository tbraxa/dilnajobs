import type { Metadata } from "next";
import { JobCard } from "@/components/job-card";
import { JobFilters } from "@/components/job-filters";
import { parseSearch, searchJobs } from "@/lib/jobs/search";

export const metadata: Metadata = { title: "Nabídky práce" };
export const dynamic = "force-dynamic";

export default async function NabidkyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = parseSearch(params);
  const jobs = await searchJobs(query);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <p className="label">Katalog</p>
      <h1 className="display mt-2 text-3xl font-semibold sm:text-4xl">Nabídky práce</h1>
      <p className="mt-2 max-w-2xl text-sm text-steel">
        Řazení a filtry berou data z databáze. Agenturní inzeráty tady nejsou — a nebudou.
      </p>
      <div className="mt-6">
        <JobFilters defaults={query} />
      </div>
      <p className="mt-4 text-sm text-steel">
        {jobs.length} {jobs.length === 1 ? "nabídka" : jobs.length < 5 ? "nabídky" : "nabídek"}
      </p>
      <div className="mt-3 grid gap-3">
        {jobs.length === 0 ? (
          <p className="border border-line p-4 text-sm">Na tento filtr teď nic nemáme. Zkuste jiné město nebo pozici.</p>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </main>
  );
}
