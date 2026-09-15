import { count, desc, eq, gte, inArray } from "drizzle-orm";
import Link from "next/link";
import { withAdminRls } from "@/db/rls";
import { applications, auditEvents, employers, jobs, orders } from "@/db/schema";
import { runDeepHealth } from "@/lib/health";
import { StatusPill } from "@/components/admin-ui";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const health = await runDeepHealth();

  const stats = await withAdminRls(async (tx) => {
    const [published] = await tx.select({ n: count() }).from(jobs).where(eq(jobs.status, "published"));
    const [pending] = await tx.select({ n: count() }).from(jobs).where(eq(jobs.status, "pending_review"));
    const [apps24h] = await tx
      .select({ n: count() })
      .from(applications)
      .where(gte(applications.createdAt, since));
    const [employerCount] = await tx.select({ n: count() }).from(employers);
    const [stubOrders] = await tx
      .select({ n: count() })
      .from(orders)
      .where(inArray(orders.status, ["stub", "failed"]));
    const recentAudit = await tx
      .select()
      .from(auditEvents)
      .orderBy(desc(auditEvents.createdAt))
      .limit(8);
    return {
      published: published?.n ?? 0,
      pending: pending?.n ?? 0,
      apps24h: apps24h?.n ?? 0,
      employers: employerCount?.n ?? 0,
      stubOrders: stubOrders?.n ?? 0,
      recentAudit,
    };
  });

  const cards = [
    { label: "Zveřejněné inzeráty", value: stats.published, href: "/admin/jobs" },
    { label: "Ke schválení", value: stats.pending, href: "/admin/jobs" },
    { label: "Přihlášky za 24 h", value: stats.apps24h, href: "/admin/applications" },
    { label: "Firmy", value: stats.employers, href: "/admin/employers" },
    { label: "Platby čekající / selhání", value: stats.stubOrders, href: "/admin/settings" },
  ];

  return (
    <main>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Provoz</p>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Přehled</h1>
        <StatusPill status={health.status} />
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Stav systému: Postgres a přihlášení musí být v pořádku. Ostatní služby bez nastavení hlásí „nenastaveno“.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="border border-slate-200 bg-white p-4 hover:bg-slate-50">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{card.value}</p>
          </Link>
        ))}
        <Link href="/admin/health" className="border border-slate-200 bg-white p-4 hover:bg-slate-50">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Hloubkové zdraví</p>
          <p className="mt-2 text-sm text-slate-600">{health.checks.filter((c) => c.status !== "ok").length} mimo v pořádku</p>
        </Link>
      </div>
      <h2 className="mt-10 text-xl font-semibold tracking-tight">Poslední audit</h2>
      <div className="mt-3 grid gap-2">
        {stats.recentAudit.length === 0 ? (
          <p className="border border-slate-200 p-4 text-sm">Zatím žádné události.</p>
        ) : (
          stats.recentAudit.map((row) => (
            <div key={row.id} className="border border-slate-200 p-3 text-sm">
              <p className="font-medium">{row.action}</p>
              <p className="text-xs text-slate-600">
                {row.actorType} · {row.createdAt.toLocaleString("cs-CZ")}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
