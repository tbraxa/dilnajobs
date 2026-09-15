import type { SVGProps } from "react";

export function FairJobsMark({
  className = "",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 44 44"
      className={className}
      role="img"
      aria-label="FairJobs"
      {...props}
    >
      <rect width="44" height="44" rx="12" fill="#1649D8" />
      <path
        d="M12 31V12h15.5v5H18v3.3h8.4v4.8H18V31z"
        fill="#FFFFFF"
      />
      <circle cx="32.5" cy="31.5" r="4.5" fill="#A7E8C2" />
    </svg>
  );
}

export function FairJobsLockup({
  inverse = false,
  compact = false,
}: {
  inverse?: boolean;
  compact?: boolean;
}) {
  return (
    <span className={`fj-lockup${inverse ? " fj-lockup-inverse" : ""}`}>
      <FairJobsMark className="fj-lockup-mark" />
      {compact ? null : (
        <span className="fj-lockup-name">
          Fair<span>Jobs</span>
        </span>
      )}
    </span>
  );
}
