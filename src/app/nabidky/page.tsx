import type { Metadata } from "next";
import { JobsFilterTray } from "@/components/jobs-filter-tray";
import { JobsSplitView } from "@/components/jobs-split-view";
import { JsonLd } from "@/components/json-ld";
import { PendingFavorite } from "@/components/pending-favorite";
import {
  loadSearchJobCount,
  loadSearchJobs,
  parseSearch,
} from "@/lib/jobs/search";
import { getFavoriteJobIds } from "@/lib/seeker-account";
import { getSeekerSession } from "@/lib/seeker-auth";
import { jobsHref } from "@/lib/search-params";
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
  const returnTo = jobsHref(query);

  return (
    <main className="gx-serp-page">
      {pendingJobId ? (
        <PendingFavorite id={pendingJobId} kind="job" returnTo={returnTo} />
      ) : null}
      <JsonLd
        id="fairjobs-jobs-collection"
        data={collectionPageJsonLd({
          name: "Nabídky práce FairJobs",
          description,
          path: "/nabidky",
        })}
      />
      <h1 className="sr-only">Nabídky práce</h1>
      <div className="gx-serp-shell">
        <JobsFilterTray query={query} resultCount={count} />
        {!catalog.ok ? (
          <section className="gx-serp-state">
            <strong>Katalog se teď nepodařilo načíst.</strong>
            <p>Zkuste stránku obnovit za chvíli.</p>
          </section>
        ) : jobs.length === 0 ? (
          <section className="gx-serp-state">
            <strong>Na tento výběr teď nic nemáme.</strong>
            <p>Zkuste jiné město, nižší mzdu nebo širší název pozice.</p>
            <a href="/nabidky">Zobrazit všechny nabídky</a>
          </section>
        ) : (
          <JobsSplitView
            jobs={jobs}
            favoriteIds={[...favoriteIds]}
            returnTo={returnTo}
          />
        )}
      </div>
    </main>
  );
}
