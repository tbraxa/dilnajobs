"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin");
  const isConsole =
    (pathname.startsWith("/firma") && !pathname.startsWith("/firma/prihlaseni")) ||
    pathname.startsWith("/ucet");

  if (isAdmin || isConsole) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader pathname={pathname} />
      {children}
      <SiteFooter />
    </>
  );
}
