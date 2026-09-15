import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FAIRJOBS_PHOTOS } from "@/lib/fairjobs-visual";

export const metadata: Metadata = { title: "Poradna" };

export default function AdvicePage() {
  return (
    <main className="fj-destination-page">
      <section className="fj-destination-hero fj-destination-hero-blue">
        <p className="fj-eyebrow fj-eyebrow-light">Poradna FairJobs</p>
        <h1 className="fj-display">Dobré rozhodnutí začíná dobrou otázkou.</h1>
        <p>Praktické rady k hledání práce, mzdě, pohovoru i změně oboru.</p>
      </section>

      <section className="fj-destination-content">
        <div className="fj-section-heading">
          <div>
            <p className="fj-eyebrow">Doporučujeme</p>
            <h2 className="fj-display">Začněte tady</h2>
          </div>
        </div>
        <div className="fj-advice-grid">
          <article className="fj-advice-feature">
            <div>
              <Image src={FAIRJOBS_PHOTOS.employer.src} alt={FAIRJOBS_PHOTOS.employer.alt} fill sizes="(max-width: 800px) 100vw, 55vw" />
            </div>
            <span>Mzda · 6 minut čtení</span>
            <h2 className="fj-display"><Link href="/poradna/jak-si-rict-o-vyssi-mzdu">Jak si říct o vyšší mzdu</Link></h2>
            <p>Připravte si částku, argumenty a klidnou první větu.</p>
          </article>
          <div className="fj-advice-list">
            <Link href="/poradna"><span>Pohovor</span><strong>Sedm otázek na budoucího šéfa</strong><small>5 minut</small></Link>
            <Link href="/poradna"><span>Životopis</span><strong>Co zkrátit a co naopak vysvětlit</strong><small>7 minut</small></Link>
            <Link href="/poradna"><span>Změna oboru</span><strong>Jak přeložit zkušenosti do nové práce</strong><small>8 minut</small></Link>
            <Link href="/poradna"><span>Úřad práce</span><strong>Doklady a termíny na jednom místě</strong><small>6 minut</small></Link>
          </div>
        </div>
      </section>

      <section className="fj-destination-cta">
        <div><p className="fj-eyebrow">Teď už jen najít správnou práci</p><h2 className="fj-display">Podmínky si porovnáte hned.</h2></div>
        <Link href="/nabidky" className="fj-primary-button">Projít nabídky</Link>
      </section>
    </main>
  );
}
