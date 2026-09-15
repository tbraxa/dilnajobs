import type { Metadata } from "next";
import Link from "next/link";
import { NetSalaryCalculator } from "@/components/net-salary-calculator";

export const metadata: Metadata = { title: "Kalkulačka čisté mzdy" };

export default function NetSalaryPage() {
  return (
    <main className="fj-calculator-page">
      <nav className="fj-breadcrumbs">
        <Link href="/">FairJobs</Link><span>›</span><Link href="/nastroje">Nástroje</Link><span>›</span><span>Čistý plat</span>
      </nav>
      <section>
        <div className="fj-calculator-page-copy">
          <p className="fj-eyebrow">Kalkulačka 2026</p>
          <h1 className="fj-display">Kolik vám zůstane z hrubé mzdy?</h1>
          <p>Zadejte hrubou měsíční mzdu a hned uvidíte orientační čistou částku.</p>
          <Link href="/nabidky?sort=salary" className="fj-text-link">Nabídky podle mzdy →</Link>
        </div>
        <NetSalaryCalculator />
      </section>
    </main>
  );
}
