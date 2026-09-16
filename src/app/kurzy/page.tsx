import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { collectionPageJsonLd } from "@/lib/structured-data";

const description = "Přehled kurzů a rekvalifikací pro změnu oboru, návrat do práce a doplnění kvalifikace.";

export const metadata: Metadata = { title: "Kurzy a rekvalifikace", description };

export default function CoursesPage() {
  return (
    <main className="fj-destination-page">
      <JsonLd
        id="fairjobs-courses-collection"
        data={collectionPageJsonLd({
          name: "Kurzy a rekvalifikace",
          description,
          path: "/kurzy",
        })}
      />
      <section className="fj-destination-hero fj-destination-hero-lilac">
        <p className="fj-eyebrow">Kurzy a rekvalifikace</p>
        <h1 className="fj-display">Dovednost, která otevře další dveře.</h1>
        <p>Kurzy pro změnu oboru, návrat do práce i doplnění kvalifikace.</p>
      </section>
      <section className="fj-course-catalog">
        <div className="fj-course-catalog-head">
          <div><p className="fj-eyebrow">Katalog kurzů</p><h2 className="fj-display">Jak půjde vybírat</h2></div>
          <p>Každý zveřejněný kurz bude mít ověřeného poskytovatele, cenu, formu, délku a jasný další krok.</p>
        </div>
        <div className="fj-topic-directory">
          <div><span>01</span><strong>Obor</strong><p>Kurzy podle profesní cesty a nové kvalifikace.</p></div>
          <div><span>02</span><strong>Forma</strong><p>Prezenční, online nebo hybridní studium.</p></div>
          <div><span>03</span><strong>Cena</strong><p>Placené, bezplatné a podporované rekvalifikace.</p></div>
          <div><span>04</span><strong>Lokalita</strong><p>Výběr podle města, kraje nebo studia na dálku.</p></div>
        </div>
        <div className="fj-content-status">
          <span>Katalog zatím není otevřen</span>
          <div>
            <strong>Katalog zatím neobsahuje zveřejněné kurzy.</strong>
            <p>Course schema zapneme až s potvrzeným poskytovatelem a skutečnými údaji.</p>
          </div>
        </div>
      </section>
      <section className="fj-destination-cta">
        <div><p className="fj-eyebrow">Po kurzu</p><h2 className="fj-display">Najděte práci pro novou dovednost.</h2></div>
        <Link href="/nabidky" className="fj-primary-button">Hledat nabídky</Link>
      </section>
    </main>
  );
}
