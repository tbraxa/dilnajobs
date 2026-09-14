const NAMES: Record<string, string> = {
  cnc: "icon-cnc",
  welder: "icon-weld",
  setter: "icon-setter",
  electrician: "icon-electric",
  maintenance: "icon-maintain",
  locksmith: "icon-factory",
  operator: "icon-factory",
  search: "icon-search",
  building: "icon-factory",
  factory: "icon-factory",
  steps: "icon-post",
  pin: "icon-map",
  map: "icon-map",
  check: "icon-why",
  why: "icon-why",
  pricing: "icon-pricing",
  post: "icon-post",
  direct: "icon-direct",
};

const STROKE = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PreviewSpriteDefs() {
  return (
    <svg className="preview-sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <symbol id="icon-cnc" viewBox="0 0 40 40" {...STROKE}>
        <path d="M14 6h12v5H14z" />
        <path d="M20 11v4" />
        <circle cx="20" cy="20" r="5" />
        <path d="M20 25v5" />
        <path d="M8 30h24" />
      </symbol>
      <symbol id="icon-weld" viewBox="0 0 40 40" {...STROKE}>
        <path d="M10 30L28 10" />
        <path d="M26 8l4 4" />
        <path d="M14 30l6-4 6 4" />
      </symbol>
      <symbol id="icon-setter" viewBox="0 0 40 40" {...STROKE}>
        <path d="M14 8h8a4 4 0 010 8h-2" />
        <path d="M14 8v8" />
        <path d="M20 16L10 26a3.5 3.5 0 005 5l10-10" />
      </symbol>
      <symbol id="icon-electric" viewBox="0 0 40 40" {...STROKE}>
        <path d="M22 6L12 20h7l-3 14 12-16h-7l3-12z" />
      </symbol>
      <symbol id="icon-maintain" viewBox="0 0 40 40" {...STROKE}>
        <path d="M9 27l11-11" />
        <path d="M16 12l4 4" />
        <path d="M20 10l4 2-2 4" />
        <path d="M14 22l-4 4a2.8 2.8 0 003.9 3.9l4-4" />
        <path d="M23 8l9 24" />
        <path d="M22 30h8" />
      </symbol>
      <symbol id="icon-map" viewBox="0 0 40 40" {...STROKE}>
        <path d="M20 34s-9-9.5-9-16a9 9 0 0118 0c0 6.5-9 16-9 16z" />
        <circle cx="20" cy="17" r="3.5" />
      </symbol>
      <symbol id="icon-factory" viewBox="0 0 40 40" {...STROKE}>
        <path d="M4 34V18h10v16" />
        <path d="M14 34V12h10v22" />
        <path d="M24 34V16h12v18" />
        <path d="M4 34h32" />
        <path d="M8 22h2M8 26h2M18 18h2M18 22h2M28 22h2M28 26h2" />
      </symbol>
      <symbol id="icon-search" viewBox="0 0 40 40" {...STROKE}>
        <circle cx="17" cy="17" r="9" />
        <path d="M24 24l9 9" />
      </symbol>
      <symbol id="icon-pricing" viewBox="0 0 40 40" {...STROKE}>
        <path d="M6 18l12-12h14l4 4v14L20 36z" />
        <circle cx="26" cy="12" r="2" />
      </symbol>
      <symbol id="icon-post" viewBox="0 0 40 40" {...STROKE}>
        <rect x="9" y="5" width="22" height="30" rx="1" />
        <path d="M14 13h12M14 20h12M14 27h8" />
      </symbol>
      <symbol id="icon-direct" viewBox="0 0 40 40" {...STROKE}>
        <circle cx="12" cy="12" r="4" />
        <circle cx="28" cy="12" r="4" />
        <path d="M6 30c0-5 3-8 6-8s6 3 6 8" />
        <path d="M22 30c0-5 3-8 6-8s6 3 6 8" />
        <path d="M16 22h8" />
      </symbol>
      <symbol id="icon-why" viewBox="0 0 40 40" {...STROKE}>
        <circle cx="20" cy="20" r="14" />
        <path d="M12 20l5 5 11-11" />
      </symbol>
    </svg>
  );
}

export function SpriteIcon({ name }: { name: string }) {
  const id = NAMES[name] ?? (name.startsWith("icon-") ? name : `icon-${name}`);
  return (
    <svg viewBox="0 0 40 40" focusable="false" aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  );
}

export function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

export function Chev() {
  return (
    <svg className="chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2.5 4.5L6 8l3.5-3.5" />
    </svg>
  );
}

export function MegaIcon({ name }: { name: string }) {
  return (
    <span className="mega-icon" aria-hidden="true">
      <SpriteIcon name={name} />
    </span>
  );
}
