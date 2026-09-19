import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/apply-form";
import { JobCard } from "@/components/job-card";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { professionIcon } from "@/components/icons";
import { EMPLOYMENT_TYPES, professionByDb } from "@/lib/catalog";
import { copy } from "@/lib/copy";
import { loadFeaturedJobs, loadPublishedJobBySlug } from "@/lib/jobs/search";
import { formatSalary } from "@/lib/pricing";
import { companyInitials, formatSalaryShort } from "@/lib/salary-display";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await loadPublishedJobBySlug(slug);
  const row = catalog.ok ? catalog.rows : null;
  if (!row) return { title: "Nabídka" };
  // Template appends " · FairJobs"; do not include brand here (P1-C1).
  return { title: `${row.job.title} · ${row.companyName}` };
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const catalog = await loadPublishedJobBySlug(slug);
  if (!catalog.ok) {
    return (
      <main id="main" className="page">
        <CatalogUnavailable />
      </main>
    );
  }
  const row = catalog.rows;
  if (!row) notFound();

  const { job, companyName, companyCity, ico } = row;
  const Icon = professionIcon(job.profession);
  const profession = professionByDb(job.profession);
  const employment = EMPLOYMENT_TYPES.find((e) => e.slug === job.employmentType)?.label;
  const pay = formatSalaryShort(job.salaryMin, job.salaryMax, job.salaryNote);
  const salaryFull = formatSalary(job.salaryMin, job.salaryMax, job.salaryNote);

  const relatedCatalog = await loadFeaturedJobs(4);
  const related = relatedCatalog.ok
    ? relatedCatalog.rows.filter((j) => j.slug !== job.slug).slice(0, 3)
    : [];

  return (
    <>
      <main id="main" className="job-detail">
        <div>
          <div className="job-detail-head">
            <p className="muted" style={{ margin: 0 }}>
              <Link href="/nabidky">{copy.job.ctaBack}</Link>
            </p>
            <h1>{job.title}</h1>
            <p className="job-detail-pay" aria-label={copy.job.labelSalary}>
              {pay.primary}
              <span className="unit">{pay.unit}</span>
            </p>
            <p className="muted" style={{ margin: "0 0 8px", fontSize: 16 }}>
              {salaryFull}
            </p>
            <div className="job-detail-chips" aria-label="Parametry nabídky">
              <span className="chip">
                <Icon className="h-4 w-4" aria-hidden /> {profession?.label ?? "Pozice"}
              </span>
              <span className="chip">
                {copy.job.labelPlace}: {job.city}
              </span>
              {employment ? (
                <span className="chip">
                  {copy.job.labelContract}: {employment}
                </span>
              ) : null}
              {job.shiftNote ? <span className="chip">{job.shiftNote}</span> : null}
              {job.isTop ? <span className="chip active">{copy.job.badgeFeatured}</span> : null}
            </div>
          </div>

          <section className="job-section" aria-labelledby="sec-about">
            <h2 id="sec-about">{copy.job.sectionAbout}</h2>
            {job.description ? (
              <p className="whitespace-pre-wrap">{job.description}</p>
            ) : (
              <p className="muted">{copy.job.emptyAbout}</p>
            )}
          </section>

          {job.requirements ? (
            <section className="job-section" aria-labelledby="sec-req">
              <h2 id="sec-req">{copy.job.sectionRequirements}</h2>
              <p className="whitespace-pre-wrap">{job.requirements}</p>
            </section>
          ) : null}

          {job.benefits ? (
            <section className="job-section" aria-labelledby="sec-offer">
              <h2 id="sec-offer">{copy.job.sectionOffer}</h2>
              <p className="whitespace-pre-wrap">{job.benefits}</p>
            </section>
          ) : null}

          <section className="job-section" aria-labelledby="sec-co">
            <h2 id="sec-co">{copy.job.sectionCompany}</h2>
            <div className="company-card">
              <div className="job-logo blue" aria-hidden>
                {companyInitials(companyName)}
              </div>
              <div>
                <strong style={{ fontSize: 17 }}>{companyName}</strong>
                <p className="muted" style={{ margin: "4px 0 0", fontSize: 15 }}>
                  {[companyCity, ico ? `IČO ${ico}` : null].filter(Boolean).join(" · ")}
                </p>
                {ico ? (
                  <p className="trust">
                    <span className="verified">Ověřeno</span>
                    <span className="muted"> · IČO v ARES</span>
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          {related.length > 0 ? (
            <section className="related-jobs" aria-labelledby="sec-related">
              <h2 id="sec-related">{copy.job.sectionRelated}</h2>
              <div className="jobs" role="list">
                {related.map((j, i) => (
                  <JobCard key={j.id} job={j} index={i} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside>
          <div className="apply-panel" id="odpovedet">
            <h2>{copy.job.applyClaim}</h2>
            <p className="helper">{copy.job.applyHelper(companyName)}</p>
            <ApplyForm jobId={job.id} companyName={companyName} />
            <div className="soft-save" style={{ marginTop: 20 }}>
              <p className="label">{copy.job.softTitle}</p>
              <p className="muted" style={{ fontSize: 14, margin: "6px 0 12px" }}>
                {copy.job.softBody}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <Link className="btn btn-secondary btn-sm" href="/ucet/registrace">
                  {copy.job.softCta}
                </Link>
                <span className="muted" style={{ fontSize: 13 }}>
                  {copy.job.softDismiss}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </main>
      <div className="apply-bar-mobile">
        <a className="btn btn-primary" href="#odpovedet">
          {copy.job.ctaApply}
        </a>
      </div>
    </>
  );
}
