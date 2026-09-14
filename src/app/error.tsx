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
    <main className="page">
      <h1>Něco se pokazilo</h1>
      <p className="lede">
        Stránku teď nejde zobrazit. Zkuste to znovu. Pokud problém trvá, ozvěte se na ahoj@dilnajobs.cz.
      </p>
      <div className="hero-ctas">
        <button type="button" className="btn btn-primary" onClick={() => reset()}>
          Zkusit znovu
        </button>
        <Link href="/" className="btn btn-outline">
          Na úvod
        </Link>
      </div>
    </main>
  );
}
