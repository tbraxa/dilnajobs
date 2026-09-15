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
    { label: "Platby stub / selhání", value: stats.stubOrders, href: "/admin/settings" },
  ];

  return (
    <main>
      <p className="label">Provoz</p>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <h1 className="display text-3xl font-semibold">Přehled</h1>
        <StatusPill status={health.status} />
      </div>
      <p className="mt-2 text-sm text-steel">
        Stav systému: Postgres a přihlášení musí být v pořádku. Ostatní služby ve stubu hlásí „nenastaveno“. To je v
        dev režimu očekávané.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="border border-line bg-paper p-4 hover:bg-paper-2">
            <p className="label">{card.label}</p>
            <p className="display mt-2 text-3xl font-semibold">{card.value}</p>
          </Link>
        ))}
        <Link href="/admin/health" className="border border-line bg-paper p-4 hover:bg-paper-2">
          <p className="label">Hloubkové zdraví</p>
          <p className="mt-2 text-sm text-steel">{health.checks.filter((c) => c.status !== "ok").length} mimo v pořádku</p>
        </Link>
      </div>
      <h2 className="display mt-10 text-xl font-semibold">Poslední audit</h2>
      <div className="mt-3 grid gap-2">
        {stats.recentAudit.length === 0 ? (
          <p className="border border-line p-4 text-sm">Zatím žádné události.</p>
        ) : (
          stats.recentAudit.map((row) => (
            <div key={row.id} className="border border-line p-3 text-sm">
              <p className="font-medium">{row.action}</p>
              <p className="text-xs text-steel">
                {row.actorType} · {row.createdAt.toLocaleString("cs-CZ")}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
