import {
  boolean,
  char,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
};

export const employers = pgTable("employers", {
  id: uuid("id").primaryKey().defaultRandom(),
  ico: char("ico", { length: 8 }).notNull().unique(),
  companyName: text("company_name").notNull(),
  legalName: text("legal_name").notNull(),
  city: text("city"),
  isAgency: boolean("is_agency").notNull().default(false),
  verificationStatus: text("verification_status").notNull().default("pending"),
  planCode: text("plan_code").notNull().default("trial"),
  adsPostedYear: integer("ads_posted_year").notNull().default(0),
  planRenewsAt: date("plan_renews_at"),
  createdAt: timestamps.createdAt,
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const employerUsers = pgTable("employer_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  employerId: uuid("employer_id")
    .notNull()
    .references(() => employers.id, { onDelete: "cascade" }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("owner"),
  createdAt: timestamps.createdAt,
});

export const magicTokens = pgTable("magic_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  purpose: text("purpose").notNull().default("employer"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  createdAt: timestamps.createdAt,
});

export const adminSessions = pgTable("admin_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamps.createdAt,
  userAgent: text("user_agent"),
  ipHash: text("ip_hash"),
});

export const systemHeartbeats = pgTable("system_heartbeats", {
  name: text("name").primaryKey(),
  status: text("status").notNull(),
  detail: text("detail"),
  checkedAt: timestamp("checked_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  employerUserId: uuid("employer_user_id")
    .notNull()
    .references(() => employerUsers.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamps.createdAt,
  userAgent: text("user_agent"),
  ipHash: text("ip_hash"),
});

export const seekerUsers = pgTable("seeker_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  city: text("city"),
  desiredRole: text("desired_role"),
  bio: text("bio"),
  createdAt: timestamps.createdAt,
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const seekerSessions = pgTable("seeker_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  seekerUserId: uuid("seeker_user_id")
    .notNull()
    .references(() => seekerUsers.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamps.createdAt,
  userAgent: text("user_agent"),
  ipHash: text("ip_hash"),
});

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employerId: uuid("employer_id")
      .notNull()
      .references(() => employers.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    profession: text("profession").notNull(),
    city: text("city").notNull(),
    region: text("region").notNull(),
    employmentType: text("employment_type").notNull().default("full_time"),
    shiftNote: text("shift_note"),
    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    salaryCurrency: text("salary_currency").notNull().default("CZK"),
    salaryNote: text("salary_note"),
    description: text("description").notNull(),
    requirements: text("requirements"),
    benefits: text("benefits"),
    status: text("status").notNull().default("draft"),
    isTop: boolean("is_top").notNull().default(false),
    topUntil: timestamp("top_until", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamps.createdAt,
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("jobs_status_expires_idx").on(t.status, t.expiresAt),
    index("jobs_profession_city_idx").on(t.profession, t.city),
  ],
);

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    employerId: uuid("employer_id")
      .notNull()
      .references(() => employers.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    cvObjectKey: text("cv_object_key"),
    cvFileName: text("cv_file_name"),
    cvContentType: text("cv_content_type"),
    message: text("message"),
    consentGdpr: boolean("consent_gdpr").notNull(),
    seekerUserId: uuid("seeker_user_id").references(() => seekerUsers.id, { onDelete: "set null" }),
    ipHash: text("ip_hash"),
    createdAt: timestamps.createdAt,
  },
  (t) => [index("applications_employer_idx").on(t.employerId, t.createdAt)],
);

export const favoriteJobs = pgTable(
  "favorite_jobs",
  {
    seekerUserId: uuid("seeker_user_id")
      .notNull()
      .references(() => seekerUsers.id, { onDelete: "cascade" }),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    createdAt: timestamps.createdAt,
  },
  (t) => [primaryKey({ columns: [t.seekerUserId, t.jobId] })],
);

export const favoriteCompanies = pgTable(
  "favorite_companies",
  {
    seekerUserId: uuid("seeker_user_id")
      .notNull()
      .references(() => seekerUsers.id, { onDelete: "cascade" }),
    employerId: uuid("employer_id")
      .notNull()
      .references(() => employers.id, { onDelete: "cascade" }),
    createdAt: timestamps.createdAt,
  },
  (t) => [primaryKey({ columns: [t.seekerUserId, t.employerId] })],
);

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorType: text("actor_type").notNull(),
  actorId: uuid("actor_id"),
  employerId: uuid("employer_id"),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: uuid("resource_id"),
  metadata: jsonb("metadata").notNull().default({}),
  ipHash: text("ip_hash"),
  createdAt: timestamps.createdAt,
});

export const packages = pgTable("packages", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  priceCzkExVat: integer("price_czk_ex_vat").notNull(),
  period: text("period").notNull(),
  periodDays: integer("period_days"),
  adLimit: integer("ad_limit"),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  employerId: uuid("employer_id")
    .notNull()
    .references(() => employers.id, { onDelete: "cascade" }),
  packageCode: text("package_code")
    .notNull()
    .references(() => packages.code),
  status: text("status").notNull().default("pending"),
  provider: text("provider").notNull().default("stub"),
  providerRef: text("provider_ref"),
  amountCzkExVat: integer("amount_czk_ex_vat").notNull(),
  createdAt: timestamps.createdAt,
  paidAt: timestamp("paid_at", { withTimezone: true }),
});

export const rateLimitEvents = pgTable(
  "rate_limit_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bucket: text("bucket").notNull(),
    keyHash: text("key_hash").notNull(),
    createdAt: timestamps.createdAt,
  },
  (t) => [index("rate_limit_bucket_key_idx").on(t.bucket, t.keyHash, t.createdAt)],
);

export const schemaMigrations = pgTable("schema_migrations", {
  id: text("id").primaryKey(),
  appliedAt: timestamp("applied_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Job = typeof jobs.$inferSelect;
export type Employer = typeof employers.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type EmployerUser = typeof employerUsers.$inferSelect;
export type SeekerUser = typeof seekerUsers.$inferSelect;
