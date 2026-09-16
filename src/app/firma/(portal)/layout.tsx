import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { EmployerConsoleShell, type EmployerConsoleSection } from "@/components/employer-console-shell";
import { getSession } from "@/lib/auth";
import { loadEmployerConsoleData, planLabel } from "@/lib/employer-console";
import { PLAN_LIMITS } from "@/lib/pricing";

export default async function FirmaPortalLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/firma/prihlaseni");
  const [requestHeaders, data] = await Promise.all([
    headers(),
    loadEmployerConsoleData(session.employerId),
  ]);
  const pathname = requestHeaders.get("x-pathname") ?? "/firma";
  const active: EmployerConsoleSection = pathname.startsWith("/firma/prihlasky")
    ? "candidates"
    : pathname.startsWith("/firma/nastaveni")
      ? "settings"
      : pathname.startsWith("/firma/nabidky")
        ? "jobs"
        : "overview";
  const newCandidates = data.applications.filter((application) => application.status === "new").length;

  return (
    <EmployerConsoleShell
      active={active}
      companyName={data.company?.companyName ?? session.companyName}
      userName={session.name}
      email={session.email}
      planName={planLabel(session.planCode)}
      usage={{ used: session.adsPostedYear, limit: PLAN_LIMITS[session.planCode] ?? 10 }}
      candidateCount={newCandidates}
    >
      {children}
    </EmployerConsoleShell>
  );
}
