import type { Metadata } from "next";
import Image from "next/image";
import { EmployerRegisterForm } from "@/components/employer-auth-forms";
import { FAIRJOBS_PHOTOS } from "@/lib/fairjobs-visual";

export const metadata: Metadata = { title: "Registrace firmy" };

export default function RegistrationPage() {
  return (
    <main className="fj-auth-page fj-registration-page">
      <section className="fj-auth-card fj-registration-card">
        <div className="fj-auth-photo">
          <Image
            src={FAIRJOBS_PHOTOS.employer.src}
            alt={FAIRJOBS_PHOTOS.employer.alt}
            fill
            priority
            sizes="(max-width: 820px) 100vw, 40vw"
          />
          <div className="fj-auth-photo-overlay">
            <p>Dobrá nabídka začíná jasnou mzdou a skutečným pohledem do firmy.</p>
            <span>FairJobs pro zaměstnavatele</span>
          </div>
          <div className="fj-auth-photo-tag fj-auth-photo-tag-wide">
            <span>✓</span>
            <p>ověření firmy podle IČO</p>
          </div>
        </div>

        <div className="fj-auth-copy">
          <div className="fj-auth-copy-inner">
            <p className="fj-eyebrow">Nový firemní účet</p>
            <h1 className="fj-display">Začněte nabírat napřímo.</h1>
            <p className="fj-auth-lead">
              Založení účtu je zdarma. Po ověření firmy můžete připravit první nabídku.
            </p>
            <EmployerRegisterForm />
          </div>
          <div className="fj-auth-trust">
            <span>✓</span>
            <p>FairJobs je pouze pro přímé zaměstnavatele.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
