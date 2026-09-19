import Link from "next/link";
import type { searchJobs } from "@/lib/jobs/search";
import { companyInitials, formatSalaryShort, relativeDayLabel } from "@/lib/salary-display";
import { EMPLOYMENT_TYPES, professionByDb } from "@/lib/catalog";

type JobRow = Awaited<ReturnType<typeof searchJobs>>[number];

const LOGO_TONES = ["blue", "green", "ink", ""] as const;

export function JobCard({ job, index = 0 }: { job: JobRow; index?: number }) {
  const pay = formatSalaryShort(job.salaryMin, job.salaryMax, job.salaryNote);
  const profession = professionByDb(job.profession);
  const tone = LOGO_TONES[index % LOGO_TONES.length];
  const recency = relativeDayLabel(job.publishedAt);
  const employment = EMPLOYMENT_TYPES.find((e) => e.slug === job.employmentType)?.label;

  return (
    <article className="job" role="listitem">
      <Link
        href={`/nabidka/${job.slug}`}
        style={{ display: "contents", color: "inherit", textDecoration: "none" }}
      >
        <div className={`job-logo${tone ? ` ${tone}` : ""}`} aria-hidden="true">
          {companyInitials(job.companyName)}
        </div>
        <div className="job-body">
          <h2 className="job-title">{job.title}</h2>
          <p className="job-co">
            {job.companyName}
            {job.isTop ? (
              <>
                {" · "}
                <span className="verified">✓ Ověřeno</span>
              </>
            ) : null}
          </p>
          <div className="job-meta">
            <span>{job.city}</span>
            {employment ? <span>{employment}</span> : null}
            {profession ? <span>{profession.label}</span> : null}
            {recency ? <span className="recency">{recency}</span> : null}
          </div>
          {job.shiftNote ? (
            <div className="job-tags">
              <span className="tag">{job.shiftNote}</span>
            </div>
          ) : null}
        </div>
        <div className="job-side">
          <div className="job-pay">
            {pay.primary}
            <span className="unit">{pay.unit}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
