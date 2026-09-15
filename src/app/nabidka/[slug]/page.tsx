import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/apply-form";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { CompanyMark, VerifiedBadge } from "@/components/craft-marks";
import { loadPublishedJobBySlug } from "@/lib/jobs/search";
import { displayJobSalary } from "@/lib/pricing";
import { companyInitial, companyMarkClass, isNewJob, publishedLabel } from "@/lib/craft";
import { PHOTOS } from "@/lib/photos";
import { contractLabel, copy, workModeLabel } from "@/lib/copy";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await loadPublishedJobBySlug(slug);
  const row = catalog.ok ? catalog.rows : null;
  if (!row) return { title: "Nabídka" };
  return { title: `${row.job.title} · ${row.job.city}` };
}

function splitLines(text: string | null | undefined) {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const catalog = await loadPublishedJobBySlug(slug);
  if (!catalog.ok) {
    return (
      <main className="wrap" style={{ padding: "40px 0 72px" }}>
        <CatalogUnavailable title={copy.nabidky.emptyErrorTitle} detail={copy.nabidky.emptyErrorBody} />
      </main>
    );
  }
  const row = catalog.rows;
  if (!row) notFound();
  const { job } = row;
  const contract = contractLabel(job.contractType || job.employmentType);
  const mode = workModeLabel(job.workMode);
  const verified = row.verificationStatus === "verified";
  const requirements = splitLines(job.requirements);
  const offer = splitLines(job.benefits);
  const mark = companyInitial(row.companyName);
  const tone = companyMarkClass(row.companyName);
  const posted = publishedLabel(job.publishedAt).replace(/^Zveřejněno\s+/i, "");
  const metaBits = [row.ico ? `${copy.detail.labelIco} ${row.ico}` : null, job.city, mode, contract].filter(Boolean);

  return (
    <main>
      <div className="listing-photo" aria-hidden="true">
        <Image src={PHOTOS.officeWide.src} alt="" fill sizes="100vw" priority style={{ objectFit: "cover" }} />
      </div>
      <div className="wrap detail-hero">
        <p className="meta" style={{ margin: "0 0 16px" }}>
          <Link href="/nabidky" style={{ color: "var(--ink-muted)" }}>
            {copy.detail.ctaBack}
          </Link>
        </p>
        <div className="detail-hero-inner">
          <CompanyMark name={mark} tone={tone} large />
          <div>
            <h1 className="h1" style={{ fontSize: "clamp(1.75rem,3vw,2.35rem)", maxWidth: "18ch" }}>
              {job.title}
            </h1>
            <div className="job-company" style={{ marginTop: 8 }}>
              {copy.card.metaCompany(row.companyName)}
              {verified ? <VerifiedBadge label={copy.card.badgeVerified} /> : null}
              {isNewJob(job.publishedAt) ? <span className="badge-new">{copy.card.badgeNew}</span> : null}
              {job.isAgency ? <span className="chip">{copy.card.badgeAgency}</span> : null}
            </div>
            {metaBits.length ? (
              <p className="meta" style={{ margin: "8px 0 0" }}>
                {metaBits.join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="apply-mobile-cta">
          <a className="btn btn-primary" href="#prihlaseni">
            {copy.detail.ctaApply}
          </a>
        </div>
      </div>

      <div className="wrap detail-layout">
        <article>
          <dl className="facts-strip">
            <div className="fact">
              <dt>{copy.card.labelSalary}</dt>
              <dd>{displayJobSalary(job)}</dd>
            </div>
            <div className="fact">
              <dt>{copy.card.labelPlace}</dt>
              <dd>
                {job.city}
                {job.region ? `, ${job.region}` : ""}
              </dd>
            </div>
            {contract ? (
              <div className="fact">
                <dt>{copy.card.labelContract}</dt>
                <dd>{contract}</dd>
              </div>
            ) : null}
            {mode ? (
              <div className="fact">
                <dt>{copy.card.workModeLabel}</dt>
                <dd>{mode}</dd>
              </div>
            ) : null}
            {posted ? (
              <div className="fact">
                <dt>{copy.card.labelPublished}</dt>
                <dd>{posted}</dd>
              </div>
            ) : null}
          </dl>

          <div className="prose">
            <h3 id="about">{copy.detail.sectionAbout}</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{job.description}</p>
            {requirements.length ? (
              <>
                <h3 id="requirements">{copy.detail.sectionRequirements}</h3>
                <ul>
                  {requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {offer.length || job.benefits ? (
              <>
                <h3 id="offer">{copy.detail.sectionOffer}</h3>
                {offer.length ? (
                  <ul>
                    {offer.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ whiteSpace: "pre-wrap" }}>{job.benefits}</p>
                )}
              </>
            ) : null}
          </div>

          <section className="trust-block" aria-labelledby="company-title">
            <h2 className="company-name" id="company-title">
              <CompanyMark name={mark} tone={tone} />
              {row.companyLegalName || row.companyName}
              {verified ? <VerifiedBadge label={copy.card.badgeVerified} /> : null}
            </h2>
            <div className="trust-meta">
              {row.ico ? (
                <div>
                  <strong>{copy.detail.labelIco}</strong> {row.ico}
                </div>
              ) : null}
              <div>
                <strong>{copy.detail.labelCity}</strong> {row.companyCity || job.city}
              </div>
            </div>
          </section>
        </article>

        <aside className="apply-panel" id="prihlaseni" aria-labelledby="apply-title">
          <div className="apply-salary">
            <div className="label">{copy.card.labelSalary}</div>
            <div className="value">{displayJobSalary(job)}</div>
          </div>
          <h2 className="h3" id="apply-title">
            {copy.detail.applyClaim}
          </h2>
          <ApplyForm jobId={job.id} companyName={row.companyName} helper={copy.detail.applyHelper(row.companyName)} />
        </aside>
      </div>
    </main>
  );
}
