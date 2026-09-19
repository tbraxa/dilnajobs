"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

/** Public magic-link shells — SiteHeader only, never ConsoleTop. */
function isPublicAuth(pathname: string) {
  return (
    pathname.startsWith("/ucet/prihlaseni") ||
    pathname.startsWith("/ucet/registrace") ||
    pathname.startsWith("/firma/prihlaseni") ||
    pathname.startsWith("/firma/registrace")
  );
}

/** Seeker/employer consoles — ConsoleShell owns the single top bar + rail. */
function isConsole(pathname: string) {
  if (isPublicAuth(pathname)) return false;
  return pathname.startsWith("/firma") || pathname.startsWith("/ucet");
}

export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin || isConsole(pathname)) {
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
