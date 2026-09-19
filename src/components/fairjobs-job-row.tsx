import Link from "next/link";
import type { searchJobs } from "@/lib/jobs/search";
import { professionByDb } from "@/lib/catalog";
import { formatSalary } from "@/lib/pricing";
import { cleanUiText } from "@/lib/fairjobs-visual";
import { CompanyLogo } from "./company-logo";

export type PublicJob = Awaited<ReturnType<typeof searchJobs>>[number];

function publishedLabel(value: Date | null) {
  if (!value) return "Nová nabídka";
  const days = Math.max(0, Math.floor((Date.now() - value.getTime()) / 86_400_000));
  if (days === 0) return "Dnes";
  if (days === 1) return "Včera";
  if (days < 5) return `Před ${days} dny`;
  return `Před ${days} dny`;
}

function employmentLabel(value: string) {
  if (value === "part_time") return "Zkrácený úvazek";
  if (value === "shift") return "Směnný provoz";
  return "Hlavní pracovní poměr";
}

function workModeLabel(value: string) {
  if (value === "remote") return "Na dálku";
  if (value === "hybrid") return "Hybrid";
  return "Na místě";
}

function FavoriteHeart({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="fj-favorite-button" aria-label={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
      </svg>
    </Link>
  );
}

export function JobResultRow({ job }: { job: PublicJob }) {
  const verified = job.verificationStatus === "verified";
  const directEmployer = !job.isAgency;
  const profession = professionByDb(job.profession)?.label ?? cleanUiText(job.profession);
  const returnTo = `/nabidky?ulozit=${encodeURIComponent(job.id)}`;

  return (
    <article className={`fj-job-row${job.isTop ? " fj-job-row-top" : ""}`}>
      <div className="fj-job-logo-cell">
        <CompanyLogo companyName={job.companyName} className="fj-company-logo" />
      </div>

      <div className="fj-job-main-cell">
        <div className="fj-job-company-line">
          <span>{cleanUiText(job.companyName)}</span>
          {verified ? (
            <span className="fj-verified-badge">
              <span aria-hidden="true">✓</span>
              Ověřeno
            </span>
          ) : null}
          {job.isTop ? <span className="fj-top-badge">Doporučujeme</span> : null}
        </div>
        <h2>
          <Link href={`/nabidka/${job.slug}`}>{cleanUiText(job.title)}</Link>
        </h2>
        <div className="fj-job-small-meta">
          <span className="fj-job-meta-chip">{workModeLabel(job.workMode)}</span>
          <span className="fj-job-meta-chip">{employmentLabel(job.employmentType)}</span>
          <span className="fj-job-meta-text">{profession}</span>
          {directEmployer ? <span className="fj-job-meta-text">Přímo od firmy</span> : null}
        </div>
      </div>

      <div className="fj-job-place-cell">
        <span className="fj-row-label">Lokalita</span>
        <strong>{cleanUiText(job.city)}</strong>
        <span>{cleanUiText(job.region)}</span>
      </div>

      <div className="fj-job-salary-cell">
        <span className="fj-row-label">Měsíční mzda</span>
        <strong>{cleanUiText(formatSalary(job.salaryMin, job.salaryMax, job.salaryNote))}</strong>
        <span className="fj-job-recency">{publishedLabel(job.publishedAt)}</span>
      </div>

      <FavoriteHeart
        href={`/ucet/prihlaseni?next=${encodeURIComponent(returnTo)}`}
        label={`Uložit nabídku ${cleanUiText(job.title)}`}
      />
    </article>
  );
}

export function HomeJobLine({ job }: { job: PublicJob }) {
  return (
    <article className="fj-home-job-line">
      <CompanyLogo companyName={job.companyName} className="fj-home-company-logo" />
      <div>
        <p>
          {cleanUiText(job.companyName)}
          {job.verificationStatus === "verified" ? <span>Ověřeno</span> : null}
        </p>
        <h3>
          <Link href={`/nabidka/${job.slug}`}>{cleanUiText(job.title)}</Link>
        </h3>
        <small>{cleanUiText(job.city)} · {workModeLabel(job.workMode)}</small>
      </div>
      <strong>{cleanUiText(formatSalary(job.salaryMin, job.salaryMax, job.salaryNote))}</strong>
      <Link href={`/nabidka/${job.slug}`} className="fj-home-job-arrow" aria-label="Detail nabídky">
        →
      </Link>
    </article>
  );
}
