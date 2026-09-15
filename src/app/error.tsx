"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui";
import { copy } from "@/lib/copy";

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
    <main className="legal-page">
      <div className="wrap">
        <h1 className="h1">{copy.nabidky.emptyErrorTitle}</h1>
        <p className="hint">{copy.nabidky.emptyErrorBody}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
          <Button type="button" onClick={() => reset()}>
            {copy.nabidky.emptyErrorCta}
          </Button>
          <ButtonLink href="/" variant="ghost">
            {copy.brand}
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
