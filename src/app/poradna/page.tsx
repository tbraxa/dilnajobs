import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { collectionPageJsonLd } from "@/lib/structured-data";

const description = "Praktické články FairJobs o hledání práce, mzdě, pohovoru a změně oboru.";

export const metadata: Metadata = { title: "Poradna", description };

export default function AdvicePage() {
  return (
    <main className="fj-destination-page">
      <JsonLd
        id="fairjobs-advice-collection"
        data={collectionPageJsonLd({
          name: "Poradna FairJobs",
          description,
          path: "/poradna",
        })}
      />
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
        <div className="fj-topic-directory">
          <div><span>01</span><strong>Jak hledat práci</strong><p>Životopis, pohovor a první dny v nové práci.</p></div>
          <div><span>02</span><strong>Mzda a vyjednávání</strong><p>Orientace v odměně a příprava na rozhovor.</p></div>
          <div><span>03</span><strong>Změna oboru</strong><p>Rekvalifikace a převod zkušeností do nové role.</p></div>
          <div><span>04</span><strong>Úřad práce a doklady</strong><p>Praktické kroky a povinnosti na jednom místě.</p></div>
        </div>
        <div className="fj-content-status">
          <span>Připravujeme</span>
          <div>
            <strong>První články doplní redakce FairJobs.</strong>
            <p>Publikujeme až obsah s autorem, datem, zdroji a odpovídající strukturovanou podobou.</p>
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
