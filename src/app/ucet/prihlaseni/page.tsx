import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SeekerLoginForm } from "@/components/seeker-auth-forms";
import { getSeekerSession, safeAccountNext } from "@/lib/seeker-auth";

export const metadata: Metadata = { title: "Přihlášení uchazeče" };

export default async function SeekerLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = safeAccountNext(typeof params.next === "string" ? params.next : undefined);
  const session = await getSeekerSession();
  if (session) redirect(next);

  return (
    <main className="fj-auth-page fj-seeker-auth-page">
      <section className="fj-auth-card fj-seeker-auth-card">
        <div className="fj-auth-copy">
          <div className="fj-auth-copy-inner">
            <p className="fj-eyebrow">Účet uchazeče</p>
            <h1 className="fj-display">Vraťte se k uloženým nabídkám.</h1>
            <p className="fj-auth-lead">
              Přihlášení je bez hesla. Jednorázový odkaz přijde přímo na váš e-mail.
            </p>
            <SeekerLoginForm next={next} />
          </div>
          <div className="fj-auth-trust">
            <span>✓</span>
            <p>Relace používá zabezpečenou HttpOnly cookie.</p>
          </div>
        </div>
        <aside className="fj-seeker-auth-aside">
          <span>FAIRJOBS / ÚČET</span>
          <h2>Jedno místo pro výběr další práce.</h2>
          <div>
            <p><b>01</b> Ukládejte nabídky i firmy</p>
            <p><b>02</b> Mějte kontakt připravený pro odpověď</p>
            <p><b>03</b> Porovnávejte mzdu bez hledání v textu</p>
          </div>
          <Link href="/nabidky">Zpět na nabídky →</Link>
        </aside>
      </section>
    </main>
  );
}
