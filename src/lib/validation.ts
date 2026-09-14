import { z } from "zod";

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
    .refine((p) => /^(\+420)?[1-9][0-9]{8}$/.test(p), "Telefon má mít 9 číslic, volitelně s +420."),
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
  intent: z.enum(["login", "register"]).default("login"),
});

const optionalDic = z
  .string()
  .trim()
  .max(16, "DIČ je příliš dlouhé.")
  .optional()
  .transform((v) => {
    if (!v) return undefined;
    const compact = v.replace(/\s+/g, "").toUpperCase();
    if (!compact) return undefined;
    return compact.startsWith("CZ") ? compact : `CZ${compact}`;
  })
  .refine((v) => !v || /^CZ\d{8,10}$/.test(v), "DIČ zadejte jako CZ a osm až deset číslic, nebo nechte prázdné.");

export const registerEmployerSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Zadejte firemní e-mail."),
    firstName: z.string().trim().min(2, "Jméno je povinné.").max(60, "Jméno je příliš dlouhé."),
    lastName: z.string().trim().min(2, "Příjmení je povinné.").max(80, "Příjmení je příliš dlouhé."),
    companyName: z.string().trim().min(3, "Název firmy je povinný.").max(160),
    ico: z
      .string()
      .trim()
      .transform((v) => v.replace(/\s+/g, "")),
    dic: optionalDic,
    city: z
      .string()
      .trim()
      .max(80)
      .optional()
      .transform((v) => (v ? v : undefined)),
    phone: z
      .string()
      .trim()
      .transform(normalizePhone)
      .refine((p) => /^(\+420)?[1-9][0-9]{8}$/.test(p), "Telefon má mít 9 číslic, volitelně s +420."),
    consentTerms: z.preprocess(
      (v) => v === true || v === "on" || v === "true",
      z.literal(true, {
        errorMap: () => ({ message: "Bez souhlasu s podmínkami účet nezaložíme." }),
      }),
    ),
  })
  .transform((data) => ({
    ...data,
    name: `${data.firstName} ${data.lastName}`.replace(/\s+/g, " ").trim(),
  }));

export const searchSchema = z.object({
  q: z.string().trim().max(80).optional(),
  profession: z
    .enum(["cnc", "welder", "setter", "electrician", "maintenance", "locksmith", "operator", "other"])
    .optional(),
  city: z.string().trim().max(80).optional(),
  sort: z.enum(["newest", "salary"]).default("newest"),
});

export const jobCreateSchema = z.object({
  title: z.string().trim().min(5, "Název pozice je povinný.").max(120),
  profession: z.enum([
    "cnc",
    "welder",
    "setter",
    "electrician",
    "maintenance",
    "locksmith",
    "operator",
    "other",
  ]),
  city: z.string().trim().min(2).max(80),
  region: z.string().trim().min(2).max(80),
  employmentType: z.enum(["full_time", "part_time", "shift"]),
  shiftNote: z.string().trim().max(160).optional(),
  salaryMin: z.coerce.number().int().positive().optional(),
  salaryMax: z.coerce.number().int().positive().optional(),
  salaryNote: z.string().trim().max(120).optional(),
  description: z.string().trim().min(40, "Popište práci aspoň v několika větách.").max(8000),
  requirements: z.string().trim().max(4000).optional(),
  benefits: z.string().trim().max(2000).optional(),
});

export type JobCreateInput = z.infer<typeof jobCreateSchema>;
