import Link from "next/link";
import type { searchJobs } from "@/lib/jobs/search";
import { formatSalary } from "@/lib/pricing";
import { cleanUiText } from "@/lib/fairjobs-visual";
import { CompanyLogo } from "./company-logo";

export type PublicJob = Awaited<ReturnType<typeof searchJobs>>[number];

function workModeLabel(value: string) {
  if (value === "remote") return "Na dálku";
  if (value === "hybrid") return "Hybrid";
  return "Na místě";
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
