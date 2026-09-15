import type { MetadataRoute } from "next";
import { resolveAppUrl } from "@/lib/app-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = resolveAppUrl();
  return [
    { url: base, changeFrequency: "hourly" },
    { url: `${base}/nabidky`, changeFrequency: "hourly" },
    { url: `${base}/pro-firmy`, changeFrequency: "weekly" },
    { url: `${base}/firma/prihlaseni`, changeFrequency: "monthly" },
    { url: `${base}/firma/registrace`, changeFrequency: "monthly" },
    { url: `${base}/gdpr`, changeFrequency: "yearly" },
    { url: `${base}/obchodni-podminky`, changeFrequency: "yearly" },
  ];
}
