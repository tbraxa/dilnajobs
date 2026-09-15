import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { collectionPageJsonLd } from "@/lib/structured-data";

const description = "Přehled kurzů a rekvalifikací pro změnu oboru, návrat do práce a doplnění kvalifikace.";

export const metadata: Metadata = { title: "Kurzy a rekvalifikace", description };

const courses = [
  { area: "Digitální dovednosti", title: "Datová analytika pro začátečníky", place: "Online", length: "10 týdnů" },
  { area: "Technické obory", title: "Elektrotechnická kvalifikace", place: "Praha", length: "6 týdnů" },
  { area: "Péče a služby", title: "Pracovník v sociálních službách", place: "Brno", length: "3 měsíce" },
  { area: "Administrativa", title: "Mzdové účetnictví v praxi", place: "Online", length: "8 týdnů" },
];

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
          <div><p className="fj-eyebrow">Vybrané kurzy</p><h2 className="fj-display">Co můžete začít</h2></div>
          <p>Ověřte si vždy termín, cenu a podmínky financování přímo u pořadatele.</p>
        </div>
        <div>
          {courses.map((course, index) => (
            <article key={course.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><small>{course.area}</small><h3>{course.title}</h3></div>
              <p>{course.place}</p>
              <p>{course.length}</p>
              <Link href="/kurzy" aria-label={`Detail kurzu ${course.title}`}>→</Link>
            </article>
          ))}
        </div>
      </section>
      <section className="fj-destination-cta">
        <div><p className="fj-eyebrow">Po kurzu</p><h2 className="fj-display">Najděte práci pro novou dovednost.</h2></div>
        <Link href="/nabidky" className="fj-primary-button">Hledat nabídky</Link>
      </section>
    </main>
  );
}
