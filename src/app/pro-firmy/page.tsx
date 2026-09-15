import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EmployerBand } from "@/components/employer-band";
import { HeroMosaic } from "@/components/hero-mosaic";
import { fieldIcons } from "@/components/craft-marks";
import { copy } from "@/lib/copy";
import { PUBLIC_PLANS, formatCzk } from "@/lib/pricing";
import { PHOTOS } from "@/lib/photos";

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
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/firma/registrace" id="registrace">
                {copy.employers.ctaPrimary}
              </Link>
              <Link className="btn btn-secondary" href="#cenik">
                {copy.employers.ctaPricing}
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

      <section className="how-section" aria-labelledby="how">
        <div className="wrap">
          <div className="section-head">
            <h2 className="h2" id="how">
              {copy.employers.sectionHow}
            </h2>
          </div>
          <div className="how-grid">
            <div className="how-step">
              <span className="how-num">1</span>
              <h3>{copy.employers.how1Title}</h3>
              <p>{copy.employers.how1Body}</p>
            </div>
            <div className="how-step">
              <span className="how-num">2</span>
              <h3>{copy.employers.how2Title}</h3>
              <p>{copy.employers.how2Body}</p>
            </div>
            <div className="how-step">
              <span className="how-num">3</span>
              <h3>{copy.employers.how3Title}</h3>
              <p>{copy.employers.how3Body}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="culture-band" aria-labelledby="culture">
        <div className="wrap culture-layout">
          <div className="culture-photo">
            <Image
              src={PHOTOS.teamMeeting.src}
              alt={copy.employers.culturePhotoAlt}
              width={PHOTOS.teamMeeting.width}
              height={PHOTOS.teamMeeting.height}
            />
          </div>
          <div className="culture-copy">
            <h2 className="h2" id="culture">
              {copy.employers.sectionCulture}
            </h2>
            <p>{copy.employers.cultureBody}</p>
            <ul className="culture-points">
              <li>{copy.employers.culture1}</li>
              <li>{copy.employers.culture2}</li>
              <li>{copy.employers.culture3}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="pricing-block" id="cenik" aria-labelledby="cenik-title">
        <div className="wrap">
          <div className="pricing-head">
            <h2 className="h2" id="cenik-title">
              {copy.employers.sectionPricing}
            </h2>
            <p>{copy.employers.pricingHelper}</p>
          </div>
          <div className="pricing-grid">
            {PUBLIC_PLANS.map((plan) => (
              <article key={plan.code} className={`price-card${plan.featured ? " is-featured" : ""}`}>
                <div className="price-name">{plan.name}</div>
                <div className="price-amt">
                  {formatCzk(plan.priceCzk)} <span>{copy.employers.pricingPeriod}</span>
                </div>
                <p className="price-note">{plan.note}</p>
                <ul className="price-list">
                  {plan.features.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link className={plan.featured ? "btn btn-primary" : "btn btn-secondary"} href="/firma/registrace">
                  {copy.employers.ctaPrimary}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <EmployerBand title={copy.employers.ctaPrimary} helper={copy.employers.helper} photo="office" />
    </main>
  );
}
