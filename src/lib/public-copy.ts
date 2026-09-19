/** FairJobs public UI copy. SoT: docs/copy DROPIN. Hard ban: no U+2014 / U+2013. */

export { brand } from "./public-copy-brand";
import { copyPart1 } from "./public-copy-part1";
import { copyPart2 } from "./public-copy-part2";
import { copyPart3 } from "./public-copy-part3";

export const copy = {
  ...copyPart1,
  ...copyPart2,
  ...copyPart3,
} as const;

export type PublicCopy = typeof copy;

/** Salary range helper: never use en dash. */
export function salaryRange(from: string | number, to: string | number): string {
  return `${from} až ${to} Kč`;
}

export function salaryFrom(from: string | number): string {
  return `od ${from} Kč`;
}
