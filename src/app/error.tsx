"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui";

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
    <main className="shell py-16">
      <p className="label">Chyba</p>
      <h1 className="display mt-2 text-3xl font-semibold">Něco se pokazilo</h1>
      <p className="mt-3 max-w-xl text-sm text-steel">
        Stránku teď nejde zobrazit. Zkuste to znovu. Pokud problém trvá, katalog se možná ještě
        migruje — obnovte za chvíli.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" onClick={() => reset()}>
          Zkusit znovu
        </Button>
        <ButtonLink href="/" variant="ghost">
          Na úvod
        </ButtonLink>
      </div>
    </main>
  );
}
