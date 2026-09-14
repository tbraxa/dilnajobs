import Link from "next/link";
import type { searchJobs } from "@/lib/jobs/search";
import { formatSalary } from "@/lib/pricing";
import { professionByDb } from "@/lib/catalog";
import { professionIcon } from "./icons";

type JobRow = Awaited<ReturnType<typeof searchJobs>>[number];

export function JobCard({ job }: { job: JobRow }) {
  const Icon = professionIcon(job.profession);
  const profession = professionByDb(job.profession);
  return (
    <article className="border border-line bg-paper p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-7 w-7 shrink-0 text-ink" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs text-steel">{job.companyName}</p>
            {job.isTop ? (
              <span className="rounded-[2px] bg-accent px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-white">
                TOP
              </span>
            ) : null}
          </div>
          <h2 className="display mt-1 text-xl font-semibold leading-tight">
            <Link href={`/nabidka/${job.slug}`} className="hover:underline">
              {job.title}
            </Link>
          </h2>
          <p className="mt-2 text-sm text-steel">
            {profession?.label ?? job.profession} · {job.city} · {formatSalary(job.salaryMin, job.salaryMax, job.salaryNote)}
          </p>
        </div>
      </div>
    </article>
  );
}
