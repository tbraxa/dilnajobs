import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { SiteFooter, SiteHeader } from "@/components/v9/chrome";
import { resolveAppUrl } from "@/lib/app-url";
import { getSession } from "@/lib/auth";
import { postListingHref } from "@/lib/nav-cta";
import "./globals.css";
import "@/styles/v9.css";

export const metadata: Metadata = {
  metadataBase: new URL(resolveAppUrl()),
  title: {
    default: "DílnaJobs · práce ve výrobě",
    template: "%s · DílnaJobs",
  },
  description:
    "CNC, svářeči, operátoři a údržba. Nabídky od výrobních firem podle města, směny a mzdy.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

const FIRST_PAINT =
  "html,body{background-color:#ffffff;color:#111111}html{scrollbar-gutter:stable;overflow-x:hidden}body{width:100%;max-width:none;overflow-x:hidden;font-family:Inter,system-ui,sans-serif}";

async function employerPostHref(): Promise<string> {
  try {
    return postListingHref(Boolean(await getSession()));
  } catch {
    return postListingHref(false);
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const nonce = h.get("x-nonce") ?? undefined;
  const pathname = h.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");
  const postHref = isAdmin ? postListingHref(false) : await employerPostHref();
  return (
    <html lang="cs" style={{ backgroundColor: "#ffffff", color: "#111111" }}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: FIRST_PAINT }} />
        <link rel="preload" href="/fonts/Inter-400-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Inter-400-ext.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Inter-600-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Inter-700-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Inter-700-ext.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body data-nonce={nonce} style={{ backgroundColor: "#ffffff", color: "#111111" }}>
        {isAdmin ? (
          <div id="obsah">{children}</div>
        ) : (
          <>
            <a className="skip-link" href="#obsah">
              Přeskočit na obsah
            </a>
            <SiteHeader postHref={postHref} />
            <div id="obsah" className="site-body">
              {children}
            </div>
            <SiteFooter postHref={postHref} />
          </>
        )}
      </body>
    </html>
  );
}
