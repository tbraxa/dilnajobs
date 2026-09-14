import { BoardPage } from "@/components/v9/board";
import { loadFeaturedJobs } from "@/lib/jobs/search";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await loadFeaturedJobs(8);
  const jobs = catalog.ok ? catalog.rows : [];

  return (
    <BoardPage
      claim="Práce ve výrobě. Přímo od firem."
      helper="CNC, svářeči, operátoři, údržba. Filtrujte podle města, směny a mzdy."
      jobs={jobs}
      listTitle="Aktuální nabídky"
      filterVariant="thin"
      unavailable={!catalog.ok}
    />
  );
}
