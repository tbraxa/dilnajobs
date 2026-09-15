import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { copy } from "@/lib/copy";
import { PHOTOS } from "@/lib/photos";

export function AuthSplit({
  title,
  helper,
  children,
  switchText,
  switchHref,
  switchLabel,
  wide = false,
}: {
  title: string;
  helper: string;
  children: ReactNode;
  switchText: string;
  switchHref: string;
  switchLabel: string;
  wide?: boolean;
}) {
  return (
    <main className="auth-split">
      <div className="auth-visual" aria-hidden="true">
        <Image src={PHOTOS.officeWide.src} alt="" fill sizes="(min-width: 901px) 46vw, 0px" priority style={{ objectFit: "cover" }} />
        <div className="auth-visual-copy">
          <p className="h2">{copy.employers.claim}</p>
          <p>{copy.employers.helper}</p>
        </div>
      </div>
      <div className="auth-form-col">
        <div className={`auth-card${wide ? " wide" : ""}`}>
          <h1 className="h1">{title}</h1>
          <p className="auth-helper">{helper}</p>
          {children}
          <p className="auth-switch">
            {switchText} <Link href={switchHref}>{switchLabel}</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
