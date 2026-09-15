import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FAIRJOBS_PHOTOS } from "@/lib/fairjobs-visual";

export const metadata: Metadata = { title: "Jak si říct o vyšší mzdu" };

export default function SalaryConversationArticle() {
  return (
    <main className="fj-article-page">
      <nav className="fj-breadcrumbs">
        <Link href="/">FairJobs</Link><span>›</span><Link href="/poradna">Poradna</Link><span>›</span><span>Mzda a vyjednávání</span>
      </nav>
      <header className="fj-article-head">
        <p className="fj-eyebrow">Mzda · 6 minut čtení</p>
        <h1 className="fj-display">Jak si říct o vyšší mzdu bez zbytečného napětí</h1>
        <p>Rozhovor o penězích je snazší, když znáte svou částku, důvody a první větu.</p>
      </header>
      <figure className="fj-article-photo">
        <Image src={FAIRJOBS_PHOTOS.employer.src} alt={FAIRJOBS_PHOTOS.employer.alt} fill priority sizes="(max-width: 1100px) 100vw, 1040px" />
      </figure>
      <article className="fj-article-body">
        <p className="fj-article-intro">Nemusíte mít připravený dlouhý projev. Stačí vědět, o kolik si chcete říct a jakou hodnotu firmě přinášíte.</p>
        <h2>1. Začněte částkou</h2>
        <p>Podívejte se na mzdy ve vašem oboru a regionu. Připravte si cílovou částku i hranici, pod kterou nechcete jít.</p>
        <h2>2. Mluvte o výsledcích</h2>
        <p>Vyberte dva nebo tři konkrétní příklady. Může jít o vyšší prodej, rychlejší práci, méně chyb nebo převzetí odpovědnosti.</p>
        <blockquote>„Rád bych otevřel rozhovor o své mzdě. Za poslední rok jsem převzal dvě nové agendy a zkrátil dobu vyřízení zakázek.“</blockquote>
        <h2>3. Dejte druhé straně prostor</h2>
        <p>Po úvodní větě počkejte. Ptejte se, co musí nastat, aby firma mohla částku schválit, a domluvte si konkrétní další krok.</p>
        <div className="fj-article-tool">
          <div><span>Užitečný nástroj</span><strong>Porovnejte si hrubou a čistou mzdu.</strong></div>
          <Link href="/nastroje/cisty-plat">Kalkulačka čisté mzdy →</Link>
        </div>
      </article>
    </main>
  );
}
