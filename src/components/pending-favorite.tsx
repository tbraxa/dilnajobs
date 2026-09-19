"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  toggleFavoriteCompanyAction,
  toggleFavoriteJobAction,
} from "@/lib/actions/seeker";

export function PendingFavorite({
  id,
  kind,
  returnTo,
}: {
  id: string;
  kind: "job" | "company";
  returnTo: string;
}) {
  const router = useRouter();
  const started = useRef(false);
  const [message, setMessage] = useState("Ukládám do oblíbených…");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      const result =
        kind === "job"
          ? await toggleFavoriteJobAction(id, returnTo, true)
          : await toggleFavoriteCompanyAction(id, returnTo, true);
      if (!result.ok) {
        if (result.loginUrl) {
          window.location.replace(result.loginUrl);
          return;
        }
        setMessage(result.error ?? "Uložení se nepodařilo.");
        return;
      }
      setMessage("Uloženo.");
      router.replace(returnTo);
      router.refresh();
    })();
  }, [id, kind, returnTo, router]);

  return <div className="fj-pending-favorite" role="status">{message}</div>;
}
