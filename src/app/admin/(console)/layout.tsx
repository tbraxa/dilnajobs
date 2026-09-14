import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminChrome } from "@/components/admin-chrome";
import { getAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Správa",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminConsoleLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/prihlaseni");
  return <AdminChrome email={session.email}>{children}</AdminChrome>;
}
