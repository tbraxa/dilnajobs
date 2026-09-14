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
    { url: `${base}/gdpr`, changeFrequency: "yearly" },
    { url: `${base}/obchodni-podminky`, changeFrequency: "yearly" },
    ...landings,
  ];
}
