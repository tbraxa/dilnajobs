import type { Metadata } from "next";
import Link from "next/link";
import { EmployerBand } from "@/components/employer-band";
import { HeroMosaic } from "@/components/hero-mosaic";
import { fieldIcons } from "@/components/craft-marks";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: { absolute: copy.employers.metaTitle },
  description: copy.employers.metaDescription,
};

export default function ProFirmyPage() {
  return (
    <main>
      <section className="hero-employer">
        <div className="wrap hero-layout">
          <div className="hero-copy">
            <h1 className="h1 hero-claim">{copy.employers.claim}</h1>
            <p className="hero-sub">{copy.employers.helper}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
              <Link className="btn btn-primary" href="/firma/registrace">
                {copy.employers.ctaPrimary}
              </Link>
              <Link className="btn btn-secondary" href="/firma/prihlaseni">
                {copy.employers.ctaSecondary}
              </Link>
            </div>
          </div>
          <HeroMosaic variant="employers" />
        </div>
        <div className="wrap">
          <div className="why-grid">
            <div className="why-card">
              <span className="why-icon" aria-hidden="true">
                {fieldIcons.admin}
              </span>
              <div>
                <strong>{copy.employers.why1Title}</strong>
                <span>{copy.employers.why1Body}</span>
              </div>
            </div>
            <div className="why-card">
              <span className="why-icon" aria-hidden="true">
                {fieldIcons.svc}
              </span>
              <div>
                <strong>{copy.employers.why2Title}</strong>
                <span>{copy.employers.why2Body}</span>
              </div>
            </div>
            <div className="why-card">
              <span className="why-icon" aria-hidden="true">
                {fieldIcons.it}
              </span>
              <div>
                <strong>{copy.employers.why3Title}</strong>
                <span>{copy.employers.why3Body}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EmployerBand
        title={copy.employers.ctaPrimary}
        helper={copy.employers.helper}
        showSecondary={false}
      />
    </main>
  );
}
