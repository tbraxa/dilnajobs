import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Orientace ve mzdě" };

export default function SalaryByFieldPage() {
  return (
    <main className="fj-coming-page">
      <p className="fj-eyebrow">Připravujeme</p>
      <h1 className="fj-display">Orientace ve mzdě podle oboru a regionu.</h1>
      <p>Pracujeme na srovnání, které ukáže reálné rozpětí bez skrývání za registraci.</p>
      <div>
        <Link href="/nastroje/cisty-plat" className="fj-primary-button fj-primary-button-blue">Spočítat čistou mzdu</Link>
        <Link href="/nabidky" className="fj-secondary-button">Projít nabídky</Link>
      </div>
    </main>
  );
}
