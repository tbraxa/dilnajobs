"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

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
      <body className="bg-[#f2f0ea] text-[#0b0d12]">
        <main className="mx-auto max-w-xl px-4 py-16">
          <h1 className="text-2xl font-semibold">Něco se pokazilo</h1>
          <p className="mt-3 text-sm text-[#5c6168]">
            Aplikaci teď nejde zobrazit. Zkuste obnovit stránku. Pokud problém trvá, počkejte na dokončení
            migrací databáze.
          </p>
          <Button type="button" className="mt-6" onClick={() => reset()}>
            Zkusit znovu
          </Button>
        </main>
      </body>
    </html>
  );
}
