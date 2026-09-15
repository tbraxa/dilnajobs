import { z } from "zod";
import { PROFESSION_DB, CATEGORY_DB } from "./catalog";
import { copy } from "./copy";

export function normalizePhone(raw: string): string {
  return raw.replace(/[\s().-]/g, "").replace(/^00/, "+");
}

export const applySchema = z.object({
  jobId: z.string().uuid("Neplatná nabídka."),
  fullName: z
    .string()
    .trim()
    .min(3, "Jméno a příjmení jsou povinné.")
    .max(120, "Jméno je příliš dlouhé.")
    .regex(/[\p{L}]/u, "Jméno musí obsahovat písmena."),
  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .refine((p) => /^(\+420)?[1-9][0-9]{8}$/.test(p), copy.detail.errorPhone),
  email: z
    .string()
    .trim()
    .max(160)
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || z.string().email().safeParse(v).success, "E-mail nevypadá správně."),
  message: z
    .string()
    .trim()
    .max(2000, "Zpráva může mít nejvýš 2000 znaků.")
    .optional()
    .transform((v) => (v ? v : undefined)),
  consentGdpr: z.literal(true, {
    errorMap: () => ({ message: "Bez souhlasu se zpracováním údajů přihlášku neodešleme." }),
  }),
  website: z.string().max(0).optional(), // honeypot
  cvObjectKey: z.string().max(240).optional(),
  cvFileName: z.string().max(180).optional(),
  cvContentType: z.string().max(80).optional(),
});

export type ApplyInput = z.infer<typeof applySchema>;

export const magicLinkSchema = z.object({
  email: z.string().trim().toLowerCase().email("Zadejte firemní e-mail."),
  ico: z.string().optional(),
  companyName: z.string().trim().max(160).optional(),
  name: z.string().trim().max(120).optional(),
  firstName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  dic: z.string().trim().max(20).optional(),
  intent: z.enum(["login", "register"]).default("login"),
});

export const registerEmployerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Zadejte firemní e-mail."),
  name: z.string().trim().min(3, "Vaše jméno je povinné.").max(120),
  companyName: z.string().trim().min(2, "Název firmy je povinný.").max(160),
  ico: z
    .string()
    .trim()
    .transform((v) => v.replace(/\s+/g, "")),
  city: z.string().trim().max(80).optional(),
  dic: z.string().trim().max(20).optional(),
  phone: z.string().trim().max(20).optional(),
});

const professionEnum = z.enum(PROFESSION_DB as unknown as [string, ...string[]]);

function optionalEnum<T extends string>(allowed: readonly T[]) {
  return z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && (allowed as readonly string[]).includes(v) ? (v as T) : undefined));
}

export const searchSchema = z.object({
  q: z.string().trim().max(80).optional(),
  category: optionalEnum(CATEGORY_DB),
  profession: optionalEnum(PROFESSION_DB as readonly string[]),
  place: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional(),
  salaryMin: z.preprocess((value) => {
    if (value == null || value === "") return undefined;
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  }, z.number().int().nonnegative().optional()),
  page: z.preprocess((value) => {
    if (value == null || value === "") return 1;
    const n = Number(value);
    return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
  }, z.number().int().positive().default(1)),
  sort: z.enum(["newest", "salary"]).default("newest"),
});

export const jobCreateSchema = z.object({
  title: z.string().trim().min(5, "Název pozice je povinný.").max(120),
  profession: professionEnum,
  city: z.string().trim().min(2).max(80),
  region: z.string().trim().min(2).max(80),
  employmentType: z.enum(["full_time", "part_time", "shift"]),
  shiftNote: z.string().trim().max(160).optional(),
  salaryMin: z.coerce.number().int().positive().optional(),
  salaryMax: z.coerce.number().int().positive().optional(),
  salaryNote: z.string().trim().max(120).optional(),
  workMode: z.enum(["onsite", "hybrid", "remote"]).default("onsite"),
  description: z.string().trim().min(40, "Popište práci aspoň v několika větách.").max(8000),
  requirements: z.string().trim().max(4000).optional(),
  benefits: z.string().trim().max(2000).optional(),
});

export type JobCreateInput = z.infer<typeof jobCreateSchema>;
