import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BoardPage } from "@/components/v9/board";
import { cityBySlug, professionBySlug } from "@/lib/catalog";
import { loadSearchJobs } from "@/lib/jobs/search";

type Props = { params: Promise<{ profese: string; mesto: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profese, mesto } = await params;
  const p = professionBySlug(profese);
  const c = cityBySlug(mesto);
  if (!p || !c) return { title: "Práce" };
  return { title: `${p.label} · ${c.label}` };
}

export default async function SeoLanding({ params }: Props) {
  const { profese, mesto } = await params;
  const p = professionBySlug(profese);
  const c = cityBySlug(mesto);
  if (!p || !c) notFound();
  const catalog = await loadSearchJobs({ profession: p.db, city: c.label, sort: "newest" });
  const jobs = catalog.ok ? catalog.rows : [];

  return (
    <BoardPage
      claim={`${p.label} · ${c.label}`}
      helper="Obor, kraj, směna a mzda. Upravte filtry podle toho, co hledáte."
      query={{ profession: p.db, city: c.label, sort: "newest" }}
      jobs={jobs}
      listTitle="Výsledky"
      filterVariant="full"
      filtered
      unavailable={!catalog.ok}
    />
  );
}
