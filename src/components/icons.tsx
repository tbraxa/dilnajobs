import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Icon({ title, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function LogoMark(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden={props.title ? undefined : true} role={props.title ? "img" : undefined} {...props}>
      {props.title ? <title>{props.title}</title> : null}
      <circle cx="4" cy="4" r="3" fill="#003DFF" />
      <circle cx="14" cy="4" r="3" fill="#0B0D12" />
      <circle cx="4" cy="14" r="3" fill="#0B0D12" />
      <circle cx="14" cy="14" r="3" fill="#003DFF" />
    </svg>
  );
}

export function IconCnc(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="14" width="18" height="6" />
      <path d="M6 14V9h12v5" />
      <path d="M12 9V5" />
      <path d="M9 5h6" />
    </Icon>
  );
}

export function IconWeld(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 18h16" />
      <path d="M8 18 12 8l4 10" />
      <path d="M12 8V4" />
      <path d="M10 5h4" />
    </Icon>
  );
}

export function IconSetter(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v3.2M12 17.3v3.2M3.5 12h3.2M17.3 12h3.2" />
      <path d="m6.2 6.2 2.3 2.3M15.5 15.5l2.3 2.3M17.8 6.2l-2.3 2.3M8.5 15.5l-2.3 2.3" />
    </Icon>
  );
}

export function IconBolt(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 3h5l-2 7h5L10 21l2-8H7L9 3z" />
    </Icon>
  );
}

export function IconWrench(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 7a4 4 0 0 0-5.6 5.6L4 17v3h3l4.4-4.4A4 4 0 0 0 17 11l-3 3" />
    </Icon>
  );
}

export function IconLocksmith(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="5" y="11" width="14" height="9" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Icon>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="m14.8 14.8 4.7 4.7" />
    </Icon>
  );
}

export function IconPin(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </Icon>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="7" y="2.5" width="10" height="19" />
      <path d="M10 18.5h4" />
    </Icon>
  );
}

export function IconFile(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 3.5h7l5 5V20.5H7z" />
      <path d="M14 3.5v5h5" />
    </Icon>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12.5 9.5 18 20 6.5" />
    </Icon>
  );
}

export function IconFactory(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 20V9l6 3V9l6 3V6h6v14z" />
      <path d="M7 20v-3M12 20v-3M17 20v-3" />
    </Icon>
  );
}

export function IconArrow(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </Icon>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  );
}

export function IconBuilding(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20V6l8-3 8 3v14" />
      <path d="M9 20v-6h6v6" />
      <path d="M9 10h.01M15 10h.01M12 10h.01" />
    </Icon>
  );
}

export function professionIcon(db: string) {
  switch (db) {
    case "cnc":
      return IconCnc;
    case "welder":
      return IconWeld;
    case "setter":
      return IconSetter;
    case "electrician":
      return IconBolt;
    case "maintenance":
      return IconWrench;
    case "locksmith":
      return IconLocksmith;
    default:
      return IconFactory;
  }
}
