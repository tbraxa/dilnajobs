import Image from "next/image";
import Link from "next/link";
import { copy } from "@/lib/copy";
import { PHOTOS } from "@/lib/photos";

export function EmployerBand({
  title = copy.employers.claim,
  helper = copy.employers.bandHelper,
  ctaHref = "/firma/registrace",
  ctaLabel = copy.employers.ctaPrimary,
  secondaryHref = "/firma/prihlaseni",
  secondaryLabel = copy.employers.ctaSecondary,
  showSecondary = true,
}: {
  title?: string;
  helper?: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  showSecondary?: boolean;
}) {
  return (
    <section className="band-employer" aria-label={copy.nav.proFirmy}>
      <div className="wrap band-employer-inner">
        <div>
          <h2 className="h2">{title}</h2>
          <p>{helper}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link className="btn btn-on-dark" href={ctaHref}>
              {ctaLabel}
            </Link>
            {showSecondary ? (
              <Link className="btn btn-outline-light" href={secondaryHref}>
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
        <div className="band-employer-photo">
          <Image
            src={PHOTOS.teamMeeting.src}
            alt={copy.employers.photoAlt}
            width={PHOTOS.teamMeeting.width}
            height={PHOTOS.teamMeeting.height}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </section>
  );
}
