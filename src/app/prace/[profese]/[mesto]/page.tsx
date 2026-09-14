import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogUnavailable } from "@/components/catalog-unavailable";
import { PageHero } from "@/components/preview/board";
import { JobsTable } from "@/components/preview/jobs";
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
    <main>
      <PageHero
        eyebrow="Katalog / CZ"
        title={`${p.label} v městě ${c.label}`}
        lead="Stejný katalog jako /nabidky, jen předfiltrovaný. Žádný generovaný článek navíc."
      >
        <a href="/nabidky" className="btn btn-secondary btn-square">
          Celý katalog →
        </a>
      </PageHero>
      <section className="section-band" aria-label="Výsledky">
        {!catalog.ok ? (
          <CatalogUnavailable />
        ) : jobs.length === 0 ? (
          <p className="lead" style={{ padding: "1.25rem 1.5rem" }}>
            Tady teď nic není. Zkuste{" "}
            <a href="/nabidky">celý katalog</a>.
          </p>
        ) : (
          <JobsTable jobs={jobs} goLabel="Otevřít →" />
        )}
      </section>
    </main>
  );
}
