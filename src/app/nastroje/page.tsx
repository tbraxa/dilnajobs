import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Nástroje" };

export default function ToolsPage() {
  return (
    <main className="fj-destination-page">
      <section className="fj-destination-hero fj-destination-hero-ink">
        <p className="fj-eyebrow fj-eyebrow-light">Nástroje FairJobs</p>
        <h1 className="fj-display">Čísla, která pomohou rozhodnout.</h1>
        <p>Spočítejte si čistou mzdu a získejte lepší orientaci před pohovorem.</p>
      </section>
      <section className="fj-tool-directory">
        <Link href="/nastroje/cisty-plat" className="fj-tool-directory-main">
          <span>01</span>
          <div><small>Dostupné</small><h2 className="fj-display">Kalkulačka čisté mzdy</h2><p>Rychlý orientační výpočet bez registrace.</p></div>
          <b>Otevřít →</b>
        </Link>
        <Link href="/nastroje/mzda-obor">
          <span>02</span>
          <div><small>Připravujeme</small><h2 className="fj-display">Orientace ve mzdě</h2><p>Porovnání podle oboru a regionu.</p></div>
          <b>Více →</b>
        </Link>
        <Link href="/zivotopis">
          <span>03</span>
          <div><small>Připravujeme</small><h2 className="fj-display">Editor životopisu</h2><p>Čistý životopis pro každou profesi.</p></div>
          <b>Více →</b>
        </Link>
      </section>
    </main>
  );
}
