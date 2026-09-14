import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { headers } from "next/headers";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { resolveAppUrl } from "@/lib/app-url";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  weight: ["500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(resolveAppUrl()),
  title: {
    default: "DílnaJobs — práce ve výrobě, napřímo",
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
  return (
    <html lang="cs" className={`${grotesk.variable} ${inter.variable} ${mono.variable}`}>
      <body className="flex min-h-dvh flex-col bg-paper-0 font-sans text-ink antialiased" data-nonce={nonce}>
        <a
          href="#obsah"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper-0"
        >
          Přeskočit na obsah
        </a>
        {isAdmin ? (
          <div id="obsah" className="flex-1">
            {children}
          </div>
        ) : (
          <>
            <SiteHeader />
            <div id="obsah" className="flex-1">
              {children}
            </div>
            <SiteFooter />
          </>
        )}
      </body>
    </html>
  );
}
