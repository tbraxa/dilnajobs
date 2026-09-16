import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { FairJobsFooter, FairJobsHeader } from "@/components/fairjobs-chrome";
import { JsonLd } from "@/components/json-ld";
import { resolveAppUrl } from "@/lib/app-url";
import { BRAND_DESCRIPTION, BRAND_TITLE, BRAND_TITLE_TEMPLATE } from "@/lib/brand";
import { siteJsonLd } from "@/lib/structured-data";
import "./globals.css";
import "./fairjobs.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(resolveAppUrl()),
  title: {
    default: BRAND_TITLE,
    template: BRAND_TITLE_TEMPLATE,
  },
  description: BRAND_DESCRIPTION,
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const nonce = h.get("x-nonce") ?? undefined;
  const pathname = h.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");
  return (
    <html
      lang="cs"
      className={inter.variable}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-screen flex-col antialiased" data-nonce={nonce}>
        <JsonLd id="fairjobs-site-schema" data={siteJsonLd()} nonce={nonce} />
        {isAdmin ? (
          children
        ) : (
          <>
            <FairJobsHeader />
            {children}
            <FairJobsFooter />
          </>
        )}
      </body>
    </html>
  );
}
