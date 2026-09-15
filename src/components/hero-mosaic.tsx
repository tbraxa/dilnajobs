import Image from "next/image";
import { copy } from "@/lib/copy";
import { PHOTOS } from "@/lib/photos";

const cover = { objectFit: "cover" as const };

export function HeroMosaic({ variant = "home" }: { variant?: "home" | "employers" }) {
  if (variant === "employers") {
    return (
      <div className="hero-visual hero-visual-employers" aria-hidden="true">
        <div className="hero-geo" />
        <div className="shot shot-a">
          <Image
            src={PHOTOS.teamPortrait.src}
            alt=""
            fill
            sizes="(max-width: 720px) 50vw, 280px"
            priority
            style={cover}
          />
        </div>
        <div className="shot shot-b">
          <Image src={PHOTOS.officeTall.src} alt="" fill sizes="(max-width: 720px) 50vw, 180px" style={cover} />
        </div>
        <div className="shot shot-c">
          <Image src={PHOTOS.warehouse.src} alt="" fill sizes="(max-width: 720px) 50vw, 180px" style={cover} />
        </div>
      </div>
    );
  }

  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-geo" />
      <div className="shot shot-a">
        <Image
          src={PHOTOS.officeTall.src}
          alt=""
          fill
          sizes="(max-width: 720px) 50vw, 280px"
          priority
          style={cover}
        />
        <span className="shot-label">{copy.home.shotOffice}</span>
      </div>
      <div className="shot shot-b">
        <Image src={PHOTOS.warehouse.src} alt="" fill sizes="(max-width: 720px) 50vw, 180px" style={cover} />
        <span className="shot-label">{copy.home.shotLogistics}</span>
      </div>
      <div className="shot shot-c">
        <Image src={PHOTOS.workshop.src} alt="" fill sizes="(max-width: 720px) 50vw, 180px" style={cover} />
        <span className="shot-label">{copy.home.shotWorkshop}</span>
      </div>
    </div>
  );
}
