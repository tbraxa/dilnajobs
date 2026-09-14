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
  steps: "icon-post",
  pin: "icon-map",
  check: "icon-why",
  pricing: "icon-pricing",
  post: "icon-post",
  direct: "icon-direct",
};

export function SpriteIcon({ name }: { name: string }) {
  const id = NAMES[name] ?? (name.startsWith("icon-") ? name : `icon-${name}`);
  return (
    <svg aria-hidden="true">
      <use href={`/icons.svg#${id}`} />
    </svg>
  );
}

export function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
