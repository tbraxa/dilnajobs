import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo, IBM_Plex_Sans } from "next/font/google";
import { headers } from "next/headers";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { resolveAppUrl } from "@/lib/app-url";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo",
  display: "swap",
});

const ibm = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm",
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
    <html lang="cs" className={`${archivo.variable} ${ibm.variable}`}>
      <body className="workshop-grid flex min-h-screen flex-col antialiased" data-nonce={nonce}>
        {isAdmin ? (
          children
        ) : (
          <>
            <SiteHeader />
            {children}
            <SiteFooter />
          </>
        )}
      </body>
    </html>
  );
}
