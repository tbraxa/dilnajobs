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
  ico: z.string().optional(),
  companyName: z.string().trim().max(160).optional(),
  name: z.string().trim().max(120).optional(),
  intent: z.enum(["login", "register"]).default("login"),
});

export const registerEmployerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Zadejte firemní e-mail."),
  name: z.string().trim().min(3, "Vaše jméno je povinné.").max(120),
  companyName: z.string().trim().min(3, "Název firmy je povinný.").max(160),
  ico: z
    .string()
    .trim()
    .transform((v) => v.replace(/\s+/g, "")),
  city: z.string().trim().max(80).optional(),
});

export const searchSchema = z.object({
  q: z.string().trim().max(80).optional(),
  profession: z
    .enum([
      "cnc",
      "welder",
      "setter",
      "electrician",
      "maintenance",
      "locksmith",
      "operator",
      "administration",
      "accounting",
      "sales",
      "it",
      "logistics",
      "driver",
      "hospitality",
      "healthcare",
      "other",
    ])
    .optional(),
  city: z.string().trim().max(80).optional(),
  salaryMin: z.coerce.number().int().min(0).max(500000).optional(),
  workMode: z.enum(["onsite", "hybrid", "remote"]).optional(),
  employmentType: z.enum(["full_time", "part_time", "shift"]).optional(),
  page: z.coerce.number().int().min(1).max(100).optional(),
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
    "administration",
    "accounting",
    "sales",
    "it",
    "logistics",
    "driver",
    "hospitality",
    "healthcare",
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
