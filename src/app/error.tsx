"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <section className="page-hero">
        <div>
          <p className="eyebrow">Chyba</p>
          <h1>Něco se pokazilo</h1>
          <p className="lead">
            Stránku teď nejde zobrazit. Zkuste to znovu. Pokud problém trvá, ozvěte se na ahoj@dilnajobs.cz.
          </p>
        </div>
        <div className="hero-ctas">
          <button type="button" className="btn btn-primary btn-square" onClick={() => reset()}>
            Zkusit znovu
          </button>
          <Link href="/" className="btn btn-secondary btn-square">
            Na úvod
          </Link>
        </div>
      </section>
    </main>
  );
}
