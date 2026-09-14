import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { PreviewFooter, PreviewHeader } from "@/components/preview/chrome";
import { PreviewSpriteDefs } from "@/components/preview/sprite";
import { resolveAppUrl } from "@/lib/app-url";
import { loadSearchJobs } from "@/lib/jobs/search";
import "./globals.css";
import "@/styles/preview.css";
import "@/styles/preview-cascade.css";

export const metadata: Metadata = {
  metadataBase: new URL(resolveAppUrl()),
  title: {
    default: "DílnaJobs — Práce ve výrobě. Přímo od firem.",
    template: "%s · DílnaJobs",
  },
  description:
    "CNC, svářeči, seřizovači, elektrikáři, údržba. Nabídky od výrobních firem. Bez agentur, bez povinného účtu.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F2F0EA",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const nonce = h.get("x-nonce") ?? undefined;
  const pathname = h.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");
  let liveCount: number | undefined;
  if (!isAdmin) {
    const catalog = await loadSearchJobs({ sort: "newest" });
    if (catalog.ok) liveCount = catalog.rows.length;
  }
  return (
    <html lang="cs">
      <body data-nonce={nonce}>
        <PreviewSpriteDefs />
        {isAdmin ? (
          <div id="obsah">{children}</div>
        ) : (
          <>
            <PreviewHeader liveCount={liveCount} />
            {children}
            <PreviewFooter />
          </>
        )}
      </body>
    </html>
  );
}
