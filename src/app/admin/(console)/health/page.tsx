import { runDeepHealth } from "@/lib/health";
import { HealthCards } from "@/components/admin-ui";

export const dynamic = "force-dynamic";

export default async function AdminHealthPage() {
  const report = await runDeepHealth();
  return (
    <main>
      <p className="text-sm font-semibold text-slate-600">Provoz</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Zdraví služeb</h1>
      <p className="mt-2 text-sm text-slate-600">
        Veřejné monitory sahají jen na <code>/api/health</code> a <code>/api/ready</code>. Tento výpis je jen pro
        přihlášeného správce.
      </p>
      <div className="mt-6">
        <HealthCards initial={report} />
      </div>
    </main>
  );
}
