import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  SeekerAccountShell,
  type SeekerSection,
} from "@/components/seeker-account-shell";
import { loadSeekerAccountData } from "@/lib/seeker-account";
import { getSeekerSession } from "@/lib/seeker-auth";

export default async function SeekerPortalLayout({ children }: { children: ReactNode }) {
  const session = await getSeekerSession();
  if (!session) redirect("/ucet/prihlaseni?next=/ucet/prehled");
  const [requestHeaders, data] = await Promise.all([
    headers(),
    loadSeekerAccountData(session.userId),
  ]);
  const pathname = requestHeaders.get("x-pathname") ?? "/ucet/prehled";
  const active: SeekerSection = pathname.startsWith("/ucet/oblibene")
    ? "favorites"
    : pathname.startsWith("/ucet/profil")
      ? "profile"
      : "overview";

  return (
    <SeekerAccountShell
      active={active}
      name={data.profile?.name ?? session.name}
      email={session.email}
      savedJobs={data.savedJobs.length}
    >
      {children}
    </SeekerAccountShell>
  );
}
