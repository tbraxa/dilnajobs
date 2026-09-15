import type { Metadata } from "next";
import Image from "next/image";
import { EmployerLoginForm } from "@/components/employer-auth-forms";
import { FAIRJOBS_PHOTOS } from "@/lib/fairjobs-visual";

export const metadata: Metadata = { title: "Přihlášení firmy" };

export default function LoginPage() {
  return (
    <main className="fj-auth-page">
      <section className="fj-auth-card">
        <div className="fj-auth-copy">
          <div className="fj-auth-copy-inner">
            <p className="fj-eyebrow">Firemní účet</p>
            <h1 className="fj-display">Vraťte se k náboru.</h1>
            <p className="fj-auth-lead">
              Přihlásíte se bezpečným odkazem v e-mailu. Bez hesla a bez zbytečného čekání.
            </p>
            <EmployerLoginForm />
          </div>
          <div className="fj-auth-trust">
            <span>✓</span>
            <p>Odkaz je jednorázový a platí pouze 15 minut.</p>
          </div>
        </div>

        <div className="fj-auth-photo">
          <Image
            src={FAIRJOBS_PHOTOS.auth.src}
            alt={FAIRJOBS_PHOTOS.auth.alt}
            fill
            priority
            sizes="(max-width: 820px) 100vw, 46vw"
          />
          <div className="fj-auth-photo-overlay">
            <p>„Všechny odpovědi a otevřené pozice vidím hned po přihlášení.“</p>
            <span>Firemní přehled FairJobs</span>
          </div>
          <div className="fj-auth-photo-tag">
            <span>3</span>
            <p>aktivní nabídky</p>
          </div>
        </div>
      </section>
    </main>
  );
}
