import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobResultRow } from "@/components/fairjobs-job-row";
import { cityBySlug, professionBySlug } from "@/lib/catalog";
import { loadSearchJobs } from "@/lib/jobs/search";

type Props = { params: Promise<{ profese: string; mesto: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profese, mesto } = await params;
  const p = professionBySlug(profese);
  const c = cityBySlug(mesto);
  if (!p || !c) return { title: "Práce" };
  return { title: `${p.label} v ${c.label}` };
}

export default async function SeoLanding({ params }: Props) {
  const { profese, mesto } = await params;
  const p = professionBySlug(profese);
  const c = cityBySlug(mesto);
  if (!p || !c) notFound();
  const catalog = await loadSearchJobs({ profession: p.db, city: c.label, sort: "newest" });
  const jobs = catalog.ok ? catalog.rows : [];

  return (
    <main className="fj-guide-listing-page">
      <section className="fj-guide-listing-head">
        <p className="fj-eyebrow">Nabídky v okolí</p>
        <h1 className="fj-display">{p.label} v městě {c.label}</h1>
        <p>Aktuální nabídky podle profese a města.</p>
        <Link href="/nabidky" className="fj-text-link">Upravit hledání →</Link>
      </section>
      <section className="fj-job-ledger">
        {!catalog.ok ? (
          <div className="fj-empty-results">
            <strong>Nabídky se teď nepodařilo načíst.</strong>
            <p>Zkuste stránku obnovit za chvíli.</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="fj-empty-results">
            <strong>Tady teď nic není.</strong>
            <p>Zkuste celý katalog nebo jiné město.</p>
            <Link href="/nabidky" className="fj-secondary-button">Celý katalog</Link>
          </div>
        ) : (
          jobs.map((job) => <JobResultRow key={job.id} job={job} />)
        )}
      </section>
    </main>
  );
}
