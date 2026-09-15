import Link from "next/link";
import type { searchJobs } from "@/lib/jobs/search";
import { displayJobSalary } from "@/lib/pricing";
import { professionByDb } from "@/lib/catalog";
import { companyInitial, companyMarkClass, isNewJob, jobMediaClass, publishedLabel } from "@/lib/craft";
import { contractLabel, copy, workModeLabel } from "@/lib/copy";
import { CompanyMark, VerifiedBadge } from "./craft-marks";

type JobRow = Awaited<ReturnType<typeof searchJobs>>[number];

function jobContractLabel(job: JobRow) {
  return contractLabel(job.contractType || job.employmentType);
}

function JobIdentity({ job }: { job: JobRow }) {
  const verified = job.verificationStatus === "verified";
  return (
    <div className="job-company">
      {copy.card.metaCompany(job.companyName)}
      {verified ? <VerifiedBadge label={copy.card.badgeVerified} /> : null}
      {job.isAgency ? <span className="chip">{copy.card.badgeAgency}</span> : null}
    </div>
  );
}

function JobMeta({ job }: { job: JobRow }) {
  const contract = jobContractLabel(job);
  const mode = workModeLabel(job.workMode);
  return (
    <div className="job-meta">
      <span>{job.city}</span>
      {contract ? <span>{contract}</span> : null}
      {mode ? <span className="chip">{mode}</span> : null}
    </div>
  );
}

export function JobCard({ job, heading = "h3" }: { job: JobRow; heading?: "h2" | "h3" }) {
  const category = professionByDb(job.category) ?? professionByDb(job.profession);
  const media = jobMediaClass(category?.db ?? job.category, job.profession);
  const TitleTag = heading;
  return (
    <Link className="job-card" href={`/nabidka/${job.slug}`}>
      <div className={`job-card-media ${media}`} aria-hidden="true">
        <div className="job-card-media-inner">
          {isNewJob(job.publishedAt) ? <span className="badge-new">{copy.card.badgeNew}</span> : null}
        </div>
        <CompanyMark name={companyInitial(job.companyName)} tone={companyMarkClass(job.companyName)} />
      </div>
      <div className="job-card-body">
        <TitleTag className="job-title">{job.title}</TitleTag>
        <JobIdentity job={job} />
        <JobMeta job={job} />
        <div className="job-salary">{displayJobSalary(job)}</div>
        <div className="job-posted">{publishedLabel(job.publishedAt)}</div>
      </div>
    </Link>
  );
}

export function JobRowCard({ job }: { job: JobRow }) {
  const category = professionByDb(job.category) ?? professionByDb(job.profession);
  const media = jobMediaClass(category?.db ?? job.category, job.profession);
  return (
    <Link className="job-row" href={`/nabidka/${job.slug}`}>
      <div className="job-row-inner">
        <div className={`job-row-media ${media}`} aria-hidden="true">
          <div className="job-row-media-inner" />
          <CompanyMark name={companyInitial(job.companyName)} tone={companyMarkClass(job.companyName)} />
        </div>
        <div>
          <div className="job-title">
            {job.title}
            {isNewJob(job.publishedAt) ? <span className="badge-new">{copy.card.badgeNew}</span> : null}
          </div>
          <JobIdentity job={job} />
          <JobMeta job={job} />
        </div>
        <div className="job-row-pay">
          <div className="job-salary">{displayJobSalary(job)}</div>
          <div className="job-posted">{publishedLabel(job.publishedAt)}</div>
        </div>
      </div>
    </Link>
  );
}
