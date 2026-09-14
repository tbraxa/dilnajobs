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
      <body style={{ background: "#F2F0EA", color: "#0B0D12", fontFamily: "Inter, system-ui, sans-serif" }}>
        <main style={{ maxWidth: 1180, margin: "0 auto", padding: "3rem 1.5rem" }}>
          <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Chyba
          </p>
          <h1 style={{ fontSize: "2rem", letterSpacing: "-0.03em", margin: "0.5rem 0 1rem" }}>Něco se pokazilo</h1>
          <p style={{ maxWidth: "36em", lineHeight: 1.68, color: "#5A5F6A" }}>
            Aplikaci teď nejde zobrazit. Zkuste obnovit stránku. Pokud problém trvá, napište na ahoj@dilnajobs.cz.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "1.5rem",
              background: "#0B0D12",
              color: "#fff",
              border: "1px solid #0B0D12",
              padding: "0.85rem 1.25rem",
              fontWeight: 600,
              minHeight: 44,
            }}
          >
            Zkusit znovu
          </button>
        </main>
      </body>
    </html>
  );
}
