import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { webPageJsonLd } from "@/lib/structured-data";

const description = "Připravované srovnání mezd podle oboru a regionu v Česku.";

export const metadata: Metadata = { title: "Orientace ve mzdě", description };

export default function SalaryByFieldPage() {
  return (
    <main className="fj-coming-page">
      <JsonLd
        id="fairjobs-salary-guide-page"
        data={webPageJsonLd({
          name: "Orientace ve mzdě",
          description,
          path: "/nastroje/mzda-obor",
        })}
      />
      <p className="fj-eyebrow">Brzy dostupné</p>
      <h1 className="fj-display">Orientace ve mzdě podle oboru a regionu.</h1>
      <p>Pracujeme na srovnání, které ukáže reálné rozpětí bez skrývání za registraci.</p>
      <div>
        <Link href="/nastroje/cisty-plat" className="fj-primary-button fj-primary-button-blue">Spočítat čistou mzdu</Link>
        <Link href="/nabidky" className="fj-secondary-button">Projít nabídky</Link>
      </div>
    </main>
  );
}
