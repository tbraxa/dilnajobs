import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { resolveAppUrl } from "@/lib/app-url";
import { copy } from "@/lib/copy";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(resolveAppUrl()),
  title: {
    default: copy.home.metaTitle,
    template: `%s · ${copy.brand}`,
  },
  description: copy.home.metaDescription,
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
    <html lang="cs" className={inter.variable}>
      <body className={`${inter.className} antialiased`} data-nonce={nonce}>
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
