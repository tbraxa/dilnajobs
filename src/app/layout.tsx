import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { headers } from "next/headers";
import { PreviewFooter, PreviewHeader } from "@/components/preview/chrome";
import { PreviewSpriteDefs } from "@/components/preview/sprite";
import { resolveAppUrl } from "@/lib/app-url";
import { getSession } from "@/lib/auth";
import { loadSearchJobs } from "@/lib/jobs/search";
import { isPublicAuthPath, postListingHref } from "@/lib/nav-cta";
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

const FIRST_PAINT =
  "html,body{background-color:#F2F0EA;color:#0B0D12}html{scrollbar-gutter:stable;overflow-x:hidden}body{width:100%;overflow-x:hidden;font-family:Inter,system-ui,sans-serif}";

async function employerPostHref(): Promise<string> {
  try {
    return postListingHref(Boolean(await getSession()));
  } catch {
    return postListingHref(false);
  }
}

async function HeaderWithLiveCount({
  pathname,
  postHref,
}: {
  pathname: string;
  postHref: string;
}) {
  if (isPublicAuthPath(pathname)) {
    return <PreviewHeader postHref={postHref} />;
  }
  let liveCount: number | undefined;
  try {
    const catalog = await loadSearchJobs({ sort: "newest" });
    if (catalog.ok) liveCount = catalog.rows.length;
  } catch {
    liveCount = undefined;
  }
  return <PreviewHeader liveCount={liveCount} postHref={postHref} />;
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const nonce = h.get("x-nonce") ?? undefined;
  const pathname = h.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");
  const postHref = isAdmin ? postListingHref(false) : await employerPostHref();
  return (
    <html lang="cs" style={{ backgroundColor: "#F2F0EA", color: "#0B0D12" }}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: FIRST_PAINT }} />
        <link rel="preload" href="/fonts/Satoshi-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Satoshi-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Satoshi-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Inter-400-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body data-nonce={nonce} style={{ backgroundColor: "#F2F0EA", color: "#0B0D12" }}>
        <PreviewSpriteDefs />
        {isAdmin ? (
          <div id="obsah">{children}</div>
        ) : (
          <>
            <Suspense fallback={<PreviewHeader postHref={postHref} />}>
              <HeaderWithLiveCount pathname={pathname} postHref={postHref} />
            </Suspense>
            {children}
            <PreviewFooter postHref={postHref} />
          </>
        )}
      </body>
    </html>
  );
}
