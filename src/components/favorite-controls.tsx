"use client";

import { useState, useTransition } from "react";
import {
  toggleFavoriteCompanyAction,
  toggleFavoriteJobAction,
} from "@/lib/actions/seeker";

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
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
    <span className={`fj-favorite-control${showText ? " fj-favorite-control-text" : ""}`}>
      <button
        type="button"
        className={`fj-favorite-button${saved ? " is-saved" : ""}`}
        aria-label={`${saved ? "Odebrat" : "Uložit"} ${label}`}
        aria-pressed={saved}
        disabled={pending}
        onClick={toggle}
      >
        <HeartIcon />
        {showText ? <span>{saved ? "Uloženo" : "Uložit"}</span> : null}
      </button>
      {message ? <small role="status">{message}</small> : null}
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
