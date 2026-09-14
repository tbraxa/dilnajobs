import type { Metadata } from "next";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { PreviewFilters } from "@/components/preview/filters";
import { PreviewJobRow } from "@/components/preview/job-row";
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
    <main className="wrap">
      <header className="page-title">
        <p className="micro">Katalog</p>
        <h1 className="display">Nabídky práce</h1>
        <p>Řazení a filtry berou data z databáze. Agenturní inzeráty tady nejsou — a nebudou.</p>
      </header>
      <PreviewFilters defaults={query} />
      <p className="micro count">
        {catalog.ok
          ? `${jobs.length} ${jobs.length === 1 ? "nabídka" : jobs.length < 5 ? "nabídky" : "nabídek"}`
          : "Katalog je dočasně nedostupný."}
      </p>
      <div className="job-list">
        {!catalog.ok ? (
          <CatalogUnavailable />
        ) : jobs.length === 0 ? (
          <p className="empty">Na tento filtr teď nic nemáme. Zkuste jiné město nebo pozici.</p>
        ) : (
          jobs.map((job) => <PreviewJobRow key={job.id} job={job} />)
        )}
      </div>
    </main>
  );
}
