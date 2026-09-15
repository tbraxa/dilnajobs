import type { MetadataRoute } from "next";
import { CITIES, PROFESSIONS } from "@/lib/catalog";
import { resolveAppUrl } from "@/lib/app-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = resolveAppUrl();
  const landings = PROFESSIONS.flatMap((p) =>
    CITIES.map((c) => ({
      url: `${base}/prace/${p.slug}/${c.slug}`,
      changeFrequency: "daily" as const,
    })),
  );
  return [
    { url: base, changeFrequency: "hourly" },
    { url: `${base}/nabidky`, changeFrequency: "hourly" },
    { url: `${base}/pro-firmy`, changeFrequency: "weekly" },
    { url: `${base}/poradna`, changeFrequency: "weekly" },
    { url: `${base}/poradna/jak-si-rict-o-vyssi-mzdu`, changeFrequency: "monthly" },
    { url: `${base}/kurzy`, changeFrequency: "weekly" },
    { url: `${base}/nastroje`, changeFrequency: "monthly" },
    { url: `${base}/nastroje/cisty-plat`, changeFrequency: "monthly" },
    { url: `${base}/zivotopis`, changeFrequency: "monthly" },
    { url: `${base}/gdpr`, changeFrequency: "yearly" },
    { url: `${base}/obchodni-podminky`, changeFrequency: "yearly" },
    ...landings,
  ];
}
