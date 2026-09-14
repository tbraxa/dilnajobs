import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function FirmaPortalLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/firma/prihlaseni");
  return children;
}
