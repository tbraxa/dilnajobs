import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { resolveAppUrl } from "@/lib/app-url";
import { BRAND_DESCRIPTION, BRAND_TITLE, BRAND_TITLE_TEMPLATE } from "@/lib/brand";
import "./globals.css";

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
  themeColor: "#0047FF",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const nonce = h.get("x-nonce") ?? undefined;
  const pathname = h.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");
  const isConsole =
    (pathname.startsWith("/firma") && !pathname.startsWith("/firma/prihlaseni")) ||
    pathname.startsWith("/ucet");

  return (
    <html lang="cs" className={inter.variable}>
      <body className="flex min-h-screen flex-col antialiased" data-nonce={nonce}>
        <a className="skip-link" href="#main">
          Přeskočit na obsah
        </a>
        {isAdmin || isConsole ? (
          children
        ) : (
          <>
            <SiteHeader pathname={pathname} />
            {children}
            <SiteFooter />
          </>
        )}
      </body>
    </html>
  );
}
