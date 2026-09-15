"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="cs">
      <body className="bg-white text-[#14233a]">
        <main className="mx-auto max-w-xl px-4 py-16">
          <h1 className="text-2xl font-semibold">Něco se pokazilo</h1>
          <p className="mt-3 text-sm text-[#627083]">
            Aplikaci teď nejde zobrazit. Zkuste obnovit stránku. Pokud problém trvá, počkejte na dokončení
            migrací databáze.
          </p>
          <button
            type="button"
            className="mt-6 rounded-md bg-[#14233a] px-5 py-3 text-sm font-bold text-white"
            onClick={() => reset()}
          >
            Zkusit znovu
          </button>
        </main>
      </body>
    </html>
  );
}
