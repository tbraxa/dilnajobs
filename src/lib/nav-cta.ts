/** Canonical public destinations. Labels live in `docs/nav-cta-map.md`. */

export const NAV = {
  home: "/",
  howItWorks: "/#jak",
  nabidky: "/nabidky",
  nabidkyFilters: "/nabidky#filtry",
  proFirmy: "/pro-firmy",
  cenik: "/pro-firmy#cenik",
  login: "/firma/prihlaseni",
  register: "/firma/registrace",
  createJob: "/firma/nabidky/nova",
} as const;

export function postListingHref(hasSession: boolean): string {
  return hasSession ? NAV.createJob : NAV.register;
}

export function isPublicAuthPath(pathname: string): boolean {
  return (
    pathname === NAV.login ||
    pathname === NAV.register ||
    pathname.startsWith(`${NAV.login}/`)
  );
}
