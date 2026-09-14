import type { Metadata } from "next";
import { BoardPage } from "@/components/v9/board";
import { parseSearch, loadSearchJobs } from "@/lib/jobs/search";
import { hasActiveFilters } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Nabídky práce ve výrobě",
  description: "CNC, svářeči, operátoři, údržba. Filtrujte podle oboru, kraje, směny a mzdy.",
};
export const dynamic = "force-dynamic";

export default async function NabidkyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = parseSearch(params);
  const catalog = await loadSearchJobs(query);
  const jobs = catalog.ok ? catalog.rows : [];

  return (
    <BoardPage
      claim="Všechny výrobní nabídky"
      helper="Obor, kraj, směna a mzda. Upravte filtry podle toho, co hledáte."
      query={query}
      jobs={jobs}
      listTitle="Výsledky"
      filterVariant="full"
      filtered={hasActiveFilters(query)}
      unavailable={!catalog.ok}
    />
  );
}
