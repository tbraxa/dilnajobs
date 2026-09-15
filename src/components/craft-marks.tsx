export function VerifiedBadge({ label }: { label: string }) {
  return (
    <span className="badge-verified">
      <svg viewBox="0 0 12 12" width="12" height="12" overflow="visible" fill="none" aria-hidden="true">
        <path
          d="M2.5 6.2l2.2 2.3 4.8-5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </span>
  );
}

export function CompanyMark({
  name,
  tone,
  large = false,
}: {
  name: string;
  tone: string;
  large?: boolean;
}) {
  return (
    <span className={`co-mark ${tone}${large ? " co-mark-lg" : ""}`} aria-hidden="true">
      {name}
    </span>
  );
}

export const fieldIcons = {
  admin: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9h6M7 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  it: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3.5" y="4" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 16h6M10 13v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  sales: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 13.5l4-4 2.5 2.5L16 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 6.5H16V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  mfg: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 16V8l4-3 4 3v8M12 8h3l1 2v6H4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  logi: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.5" y="8" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12.5 11h3l2 3v2h-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="6" cy="16.2" r="1.3" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="14.5" cy="16.2" r="1.3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  health: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 7v6M7 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  build: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3.5 16V10l6.5-5.5L16.5 10v6H12v-4H8v4H3.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  svc: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 4.5V3M10 17v-1.5M15.5 10H17M3 10h1.5M14 6l1-1M5 15l1-1M14 14l1 1M5 5l1 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  finance: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 15V9M8 15V6M12 15v-7M16 15V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  gastro: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 16c1.8-2.2 2.8-5 2.8-8h4.4c0 3 1 5.8 2.8 8M7 11h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
} as const;

export type FieldIconName = keyof typeof fieldIcons;
