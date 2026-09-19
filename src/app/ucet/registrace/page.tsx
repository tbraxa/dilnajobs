import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SeekerRegisterForm } from "@/components/seeker-auth-forms";
import { getSeekerSession, safeAccountNext } from "@/lib/seeker-auth";

export const metadata: Metadata = { title: "Registrace uchazeče" };

export default async function SeekerRegistrationPage({
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
            <p className="fj-eyebrow">Nový účet uchazeče</p>
            <h1 className="fj-display">Uložte si práci, ke které se chcete vrátit.</h1>
            <p className="fj-auth-lead">
              Účet je zdarma. Nepotřebujete heslo a na nabídky můžete dál odpovídat i bez přihlášení.
            </p>
            <SeekerRegisterForm next={next} />
          </div>
          <div className="fj-auth-trust">
            <span>✓</span>
            <p>E-mail používáme pro přihlášení a správu vašeho účtu.</p>
          </div>
        </div>
        <aside className="fj-seeker-auth-aside">
          <span>FairJobs / Účet</span>
          <h2>Výběr práce bez ztracených záložek.</h2>
          <div>
            <p><b>01</b> Nabídky a firmy na jednom místě</p>
            <p><b>02</b> Jasná mzda ještě před otevřením</p>
            <p><b>03</b> Profil připravený pro rychlou odpověď</p>
          </div>
          <Link href="/nabidky">Prohlédnout nabídky →</Link>
        </aside>
      </section>
    </main>
  );
}
