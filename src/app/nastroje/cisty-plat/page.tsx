import type { Metadata } from "next";
import Link from "next/link";
import { NetSalaryCalculator } from "@/components/net-salary-calculator";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbsJsonLd, webApplicationJsonLd } from "@/lib/structured-data";

const description = "Orientační výpočet čisté měsíční mzdy v Česku pro rok 2026.";

export const metadata: Metadata = { title: "Kalkulačka čisté mzdy", description };

export default function NetSalaryPage() {
  return (
    <main className="fj-calculator-page">
      <JsonLd
        id="fairjobs-net-salary-calculator"
        data={webApplicationJsonLd({
          name: "Kalkulačka čisté mzdy FairJobs",
          description,
          path: "/nastroje/cisty-plat",
          features: ["Výpočet čisté mzdy", "Rozpis odvodů", "Výpočet bez registrace"],
        })}
      />
      <JsonLd
        id="fairjobs-tools-breadcrumbs"
        data={breadcrumbsJsonLd([
          { name: "FairJobs", path: "/" },
          { name: "Nástroje", path: "/nastroje" },
          { name: "Kalkulačka čisté mzdy", path: "/nastroje/cisty-plat" },
        ])}
      />
      <nav className="fj-breadcrumbs" aria-label="Drobečková navigace">
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
