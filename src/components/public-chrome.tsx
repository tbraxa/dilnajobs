"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

function isSeekerAuth(pathname: string) {
  return (
    pathname.startsWith("/ucet/prihlaseni") ||
    pathname.startsWith("/ucet/registrace")
  );
}

export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin");
  const isConsole =
    (pathname.startsWith("/firma") && !pathname.startsWith("/firma/prihlaseni")) ||
    (pathname.startsWith("/ucet") && !isSeekerAuth(pathname));

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
