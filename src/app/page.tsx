import type { Metadata } from "next";
import Link from "next/link";
import { CategoryRail, SearchShell } from "@/components/job-filters";
import { JobCard } from "@/components/job-card";
import { CatalogUnavailable, EmptyJobs } from "@/components/catalog-unavailable";
import { EmployerBand } from "@/components/employer-band";
import { HeroMosaic } from "@/components/hero-mosaic";
import { TrustStrip } from "@/components/trust-strip";
import { copy } from "@/lib/copy";
import { loadFeaturedJobs } from "@/lib/jobs/search";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: copy.home.metaTitle },
  description: copy.home.metaDescription,
};

export default async function HomePage() {
  const catalog = await loadFeaturedJobs(6);
  const jobs = catalog.ok ? catalog.rows : [];
  return (
    <main>
      <section className="hero">
        <div className="wrap hero-layout">
          <div className="hero-copy">
            <h1 className="h1 hero-claim">{copy.claim}</h1>
            <p className="hero-sub">{copy.home.helper}</p>
            <SearchShell includeMode />
          </div>
          <HeroMosaic />
        </div>
      </section>

      <section className="section" aria-labelledby="cats">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2 className="h2" id="cats">
                {copy.home.sectionCats}
              </h2>
              <p className="meta section-helper">
                {copy.home.sectionCatsHelper}
              </p>
            </div>
          </div>
          <CategoryRail />
        </div>
      </section>

      <section className="section section-wash" aria-labelledby="latest">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2 className="h2" id="latest">
                {copy.home.sectionLatest}
              </h2>
              <p className="meta section-helper">
                {copy.home.sectionLatestHelper}
              </p>
            </div>
            <Link className="btn btn-ghost" href="/nabidky">
              {copy.home.ctaAllJobs}
            </Link>
          </div>
          <div className="job-grid home job-grid-home">
            {!catalog.ok ? (
              <CatalogUnavailable />
            ) : jobs.length === 0 ? (
              <EmptyJobs title={copy.nabidky.emptyNoResultsTitle} body={copy.nabidky.emptyNoResultsBody} />
            ) : (
              jobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>
        </div>
      </section>

      <TrustStrip />
      <EmployerBand />
    </main>
  );
}
