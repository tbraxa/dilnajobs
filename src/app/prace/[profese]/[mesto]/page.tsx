import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobCard } from "@/components/job-card";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { cityBySlug, professionBySlug } from "@/lib/catalog";
import { loadSearchJobs } from "@/lib/jobs/search";

type Props = { params: Promise<{ profese: string; mesto: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profese, mesto } = await params;
  const p = professionBySlug(profese);
  const c = cityBySlug(mesto);
  if (!p || !c) return { title: "Práce" };
  return { title: `${p.label} — ${c.label}` };
}

export default async function SeoLanding({ params }: Props) {
  const { profese, mesto } = await params;
  const p = professionBySlug(profese);
  const c = cityBySlug(mesto);
  if (!p || !c) notFound();
  const catalog = await loadSearchJobs({ profession: p.db, city: c.label, sort: "newest" });
  const jobs = catalog.ok ? catalog.rows : [];

  return (
    <main className="shell py-8 sm:py-10">
      <p className="label">SEO přistání</p>
      <h1 className="display mt-2 text-3xl font-semibold">
        {p.label} v městě {c.label}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-steel">
        Stejný katalog jako /nabidky, jen předfiltrovaný. Žádný generovaný článek navíc.
      </p>
      <div className="mt-6 grid gap-3">
        {!catalog.ok ? (
          <CatalogUnavailable />
        ) : jobs.length === 0 ? (
          <p className="border border-line p-4 text-sm">Tady teď nic není. Zkuste{" "}
            <a className="underline" href="/nabidky">
              celý katalog
            </a>
            .
          </p>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </main>
  );
}
