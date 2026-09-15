import Image from "next/image";
import Link from "next/link";
import { copy } from "@/lib/copy";
import { PHOTOS } from "@/lib/photos";

export function EmployerBand({
  title = copy.employers.bandTitle,
  helper = copy.employers.bandHelper,
  ctaHref = "/firma/registrace",
  ctaLabel = copy.employers.ctaPrimary,
  photo = "team",
}: {
  title?: string;
  helper?: string;
  ctaHref?: string;
  ctaLabel?: string;
  photo?: "team" | "office";
}) {
  const shot = photo === "office" ? PHOTOS.officeTall : PHOTOS.teamMeeting;
  return (
    <section className="band-employer" aria-label={copy.nav.proFirmy}>
      <div className="wrap band-employer-inner">
        <div>
          <h2 className="h2">{title}</h2>
          <p>{helper}</p>
          <Link className="btn btn-on-dark" href={ctaHref}>
            {ctaLabel}
          </Link>
        </div>
        <div className="band-employer-photo">
          <Image
            src={shot.src}
            alt={copy.employers.photoAlt}
            width={shot.width}
            height={shot.height}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </section>
  );
}
