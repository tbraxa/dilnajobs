import type { MetadataRoute } from "next";
import { resolveAppUrl } from "@/lib/app-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/firma/", "/admin/", "/api/"] },
    sitemap: `${resolveAppUrl()}/sitemap.xml`,
  };
}
