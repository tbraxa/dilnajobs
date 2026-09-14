import { FilterRail, JobList } from "@/components/v9/board";
import { loadFeaturedJobs } from "@/lib/jobs/search";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await loadFeaturedJobs(8);
  const jobs = catalog.ok ? catalog.rows : [];

  return (
    <main className="board">
      <FilterRail />
      <JobList jobs={jobs} unavailable={!catalog.ok} />
    </main>
  );
}
