import { desc } from "drizzle-orm";
import { withAdminRls } from "@/db/rls";
import { auditEvents } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const rows = await withAdminRls(async (tx) => {
    return tx.select().from(auditEvents).orderBy(desc(auditEvents.createdAt)).limit(80);
  });

  return (
    <main>
      <p className="text-sm font-semibold text-slate-600">Provoz</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Audit</h1>
      <p className="mt-2 text-sm text-slate-600">
        Poslední události. Metadata neobsahují tokeny ani spojovací řetězce. IP je hašovaná.
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-sm font-semibold text-slate-600">
              <th className="py-2 pr-3 font-semibold">Čas</th>
              <th className="py-2 pr-3 font-semibold">Kdo</th>
              <th className="py-2 pr-3 font-semibold">Akce</th>
              <th className="py-2 font-semibold">Zdroj</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-200">
                <td className="py-2 pr-3 whitespace-nowrap">{row.createdAt.toLocaleString("cs-CZ")}</td>
                <td className="py-2 pr-3">{row.actorType}</td>
                <td className="py-2 pr-3 font-medium">{row.action}</td>
                <td className="py-2 text-slate-600">
                  {row.resourceType ?? "Neuvedeno"}
                  {row.resourceId ? ` ${row.resourceId.slice(0, 8)}` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
