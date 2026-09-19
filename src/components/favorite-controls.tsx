"use client";

import { useState, useTransition } from "react";
import {
  toggleFavoriteCompanyAction,
  toggleFavoriteJobAction,
} from "@/lib/actions/seeker";

function HeartIcon({ saved }: { saved: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-4 w-4 stroke-current ${saved ? "fill-current" : "fill-none"}`}
      strokeWidth="1.7"
    >
      <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}

function FavoriteControl({
  id,
  kind,
  initialSaved,
  returnTo,
  label,
  showText = false,
}: {
  id: string;
  kind: "job" | "company";
  initialSaved: boolean;
  returnTo: string;
  label: string;
  showText?: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function toggle() {
    if (pending) return;
    const previous = saved;
    setSaved(!previous);
    setMessage("");
    startTransition(async () => {
      const result =
        kind === "job"
          ? await toggleFavoriteJobAction(id, returnTo)
          : await toggleFavoriteCompanyAction(id, returnTo);
      if (!result.ok) {
        setSaved(previous);
        if (result.loginUrl) {
          window.location.assign(result.loginUrl);
          return;
        }
        setMessage(result.error ?? "Uložení se nepodařilo.");
        return;
      }
      setSaved(result.saved);
    });
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        className={`inline-flex items-center justify-center gap-2 rounded-[2px] border px-3 py-2 text-sm disabled:opacity-50 ${
          saved
            ? "border-accent bg-accent text-white"
            : "border-line bg-transparent text-ink hover:bg-paper-2"
        }`}
        aria-label={`${saved ? "Odebrat" : "Uložit"} ${label}`}
        aria-pressed={saved}
        disabled={pending}
        onClick={toggle}
      >
        <HeartIcon saved={saved} />
        {showText ? <span>{saved ? "Uloženo" : "Uložit"}</span> : null}
      </button>
      {message ? <small className="text-danger" role="status">{message}</small> : null}
    </span>
  );
}

export function FavoriteJobButton(props: {
  jobId: string;
  initialSaved: boolean;
  returnTo: string;
  label: string;
  showText?: boolean;
}) {
  return (
    <FavoriteControl
      id={props.jobId}
      kind="job"
      initialSaved={props.initialSaved}
      returnTo={props.returnTo}
      label={props.label}
      showText={props.showText}
    />
  );
}

export function FavoriteCompanyButton(props: {
  employerId: string;
  initialSaved: boolean;
  returnTo: string;
  label: string;
  showText?: boolean;
}) {
  return (
    <FavoriteControl
      id={props.employerId}
      kind="company"
      initialSaved={props.initialSaved}
      returnTo={props.returnTo}
      label={props.label}
      showText={props.showText}
    />
  );
}
