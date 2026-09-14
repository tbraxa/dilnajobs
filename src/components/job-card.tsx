import Link from "next/link";
import type { searchJobs } from "@/lib/jobs/search";
import { formatSalary } from "@/lib/pricing";
import { professionByDb } from "@/lib/catalog";
import { IconPin, professionIcon } from "./icons";

type JobRow = Awaited<ReturnType<typeof searchJobs>>[number];

export function JobCard({ job }: { job: JobRow }) {
  const Icon = professionIcon(job.profession);
  const profession = professionByDb(job.profession);
  return (
    <article className="border border-line bg-paper px-4 py-3.5 sm:px-5 sm:py-4">
      <div className="flex items-start gap-3">
        <span className="icon-tile mt-0.5">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs text-steel">{job.companyName}</p>
            {job.isTop ? (
              <span className="bg-accent px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-white">
                TOP
              </span>
            ) : null}
          </div>
          <h2 className="display mt-1 text-[1.35rem] leading-[1.15] sm:text-2xl">
            <Link href={`/nabidka/${job.slug}`} className="hover:underline">
              {job.title}
            </Link>
          </h2>
          <p className="mt-1.5 text-sm font-semibold text-ink">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryNote)}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-steel">
            <span className="inline-flex items-center gap-1">
              <IconPin className="h-3.5 w-3.5" />
              {job.city}
            </span>
            <span aria-hidden>·</span>
            <span>{profession?.label ?? job.profession}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
