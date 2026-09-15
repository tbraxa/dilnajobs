-- DílnaJobs v1 schema + RLS
-- App role is table owner; FORCE ROW LEVEL SECURITY so policies still apply.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS schema_migrations (
  id text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE employers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ico char(8) NOT NULL UNIQUE,
  company_name text NOT NULL,
  legal_name text NOT NULL,
  city text,
  is_agency boolean NOT NULL DEFAULT false,
  verification_status text NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  plan_code text NOT NULL DEFAULT 'trial'
    CHECK (plan_code IN ('trial', 'single', 'basic', 'standard')),
  ads_posted_year integer NOT NULL DEFAULT 0 CHECK (ads_posted_year >= 0),
  plan_renews_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE employer_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'member')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email)
);

CREATE TABLE magic_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX magic_tokens_email_created_idx ON magic_tokens (email, created_at DESC);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_user_id uuid NOT NULL REFERENCES employer_users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_agent text,
  ip_hash text
);

CREATE INDEX sessions_user_idx ON sessions (employer_user_id);

CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  profession text NOT NULL
    CHECK (profession IN ('cnc', 'welder', 'setter', 'electrician', 'maintenance', 'locksmith', 'operator', 'other')),
  city text NOT NULL,
  region text NOT NULL,
  employment_type text NOT NULL DEFAULT 'full_time'
    CHECK (employment_type IN ('full_time', 'part_time', 'shift')),
  shift_note text,
  salary_min integer,
  salary_max integer,
  salary_currency text NOT NULL DEFAULT 'CZK',
  salary_note text,
  description text NOT NULL,
  requirements text,
  benefits text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending_review', 'published', 'expired', 'unpublished')),
  is_top boolean NOT NULL DEFAULT false,
  top_until timestamptz,
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX jobs_status_expires_idx ON jobs (status, expires_at DESC);
CREATE INDEX jobs_profession_city_idx ON jobs (profession, city);
CREATE INDEX jobs_employer_idx ON jobs (employer_id);

CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  employer_id uuid NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  cv_object_key text,
  cv_file_name text,
  cv_content_type text,
  message text,
  consent_gdpr boolean NOT NULL,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX applications_job_idx ON applications (job_id, created_at DESC);
CREATE INDEX applications_employer_idx ON applications (employer_id, created_at DESC);

CREATE TABLE audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_type text NOT NULL CHECK (actor_type IN ('system', 'employer_user', 'candidate', 'admin')),
  actor_id uuid,
  employer_id uuid REFERENCES employers(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_events_employer_idx ON audit_events (employer_id, created_at DESC);

CREATE TABLE packages (
  code text PRIMARY KEY,
  name text NOT NULL,
  price_czk_ex_vat integer NOT NULL CHECK (price_czk_ex_vat >= 0),
  period text NOT NULL CHECK (period IN ('year', 'days', 'once')),
  period_days integer,
  ad_limit integer,
  description text NOT NULL,
  sort_order integer NOT NULL
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  package_code text NOT NULL REFERENCES packages(code),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'stub')),
  provider text NOT NULL DEFAULT 'stub'
    CHECK (provider IN ('stripe', 'gopay', 'stub')),
  provider_ref text,
  amount_czk_ex_vat integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

CREATE TABLE rate_limit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL,
  key_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX rate_limit_bucket_key_idx ON rate_limit_events (bucket, key_hash, created_at DESC);

-- Keep application.employer_id aligned with the job (prevents spoofing under INSERT policy).
CREATE OR REPLACE FUNCTION applications_set_employer()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  SELECT j.employer_id INTO STRICT NEW.employer_id
  FROM jobs j
  WHERE j.id = NEW.job_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER applications_set_employer_tg
  BEFORE INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION applications_set_employer();

CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER employers_touch BEFORE UPDATE ON employers
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER jobs_touch BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- RLS
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers FORCE ROW LEVEL SECURITY;
ALTER TABLE employer_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_users FORCE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs FORCE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications FORCE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders FORCE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events FORCE ROW LEVEL SECURITY;

-- Auth tables: no client access; server uses them only in the same role, so
-- we keep RLS off for magic_tokens/sessions/rate_limit_events/packages.
-- They never leave the server.

CREATE OR REPLACE FUNCTION current_employer_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.employer_id', true), '')::uuid
$$;

CREATE POLICY employers_self ON employers
  FOR ALL
  USING (id = current_employer_id())
  WITH CHECK (id = current_employer_id());

CREATE POLICY employers_register ON employers
  FOR INSERT
  WITH CHECK (current_employer_id() IS NULL);

CREATE POLICY employer_users_self ON employer_users
  FOR ALL
  USING (employer_id = current_employer_id())
  WITH CHECK (employer_id = current_employer_id());

CREATE POLICY employer_users_register ON employer_users
  FOR INSERT
  WITH CHECK (current_employer_id() IS NULL);

CREATE POLICY jobs_public_read ON jobs
  FOR SELECT
  USING (
    status = 'published'
    AND (expires_at IS NULL OR expires_at > now())
  );

CREATE POLICY jobs_employer_all ON jobs
  FOR ALL
  USING (employer_id = current_employer_id())
  WITH CHECK (employer_id = current_employer_id());

CREATE POLICY applications_public_insert ON applications
  FOR INSERT
  WITH CHECK (
    consent_gdpr = true
    AND EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id = job_id
        AND j.status = 'published'
        AND (j.expires_at IS NULL OR j.expires_at > now())
    )
  );

CREATE POLICY applications_employer_select ON applications
  FOR SELECT
  USING (employer_id = current_employer_id());

CREATE POLICY applications_employer_update ON applications
  FOR UPDATE
  USING (employer_id = current_employer_id())
  WITH CHECK (employer_id = current_employer_id());

CREATE POLICY orders_employer ON orders
  FOR ALL
  USING (employer_id = current_employer_id())
  WITH CHECK (employer_id = current_employer_id());

CREATE POLICY audit_employer_select ON audit_events
  FOR SELECT
  USING (employer_id = current_employer_id());

CREATE POLICY audit_insert ON audit_events
  FOR INSERT
  WITH CHECK (true);

INSERT INTO packages (code, name, price_czk_ex_vat, period, period_days, ad_limit, description, sort_order)
VALUES
  ('trial', 'Zkušební', 0, 'year', 365, 10, '10 inzerátů za rok. Pro ověření, že sem chodí lidé z dílny.', 1),
  ('single', 'Jednorázový', 2990, 'days', 30, 1, 'Jeden inzerát na 30 dní.', 2),
  ('basic', 'Basic', 8900, 'year', 365, 40, '40 inzerátů za rok.', 3),
  ('standard', 'Standard', 19900, 'year', 365, NULL, 'Neomezený počet inzerátů na rok.', 4),
  ('top', 'Top 7 dní', 1350, 'days', 7, NULL, 'Zvýraznění existujícího inzerátu na 7 dní.', 5);

-- App role is not a superuser so FORCE RLS actually applies. Migrate/seed use the admin URL.
-- Hosted Postgres (Neon / Vercel) often cannot CREATE ROLE; skip grants if dilna_app is absent
-- (the connecting owner can still use the tables).
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'dilna_app') THEN
    IF current_setting('is_superuser') = 'on' THEN
      BEGIN
        CREATE ROLE dilna_app LOGIN PASSWORD 'dilna' NOSUPERUSER NOCREATEDB NOCREATEROLE;
      EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'skip CREATE ROLE dilna_app: %', SQLERRM;
      END;
    ELSE
      RAISE NOTICE 'skip CREATE ROLE dilna_app (not superuser / hosted Postgres)';
    END IF;
  END IF;
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'dilna_app') THEN
    BEGIN
      EXECUTE format('GRANT CONNECT ON DATABASE %I TO dilna_app', current_database());
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'skip GRANT CONNECT: %', SQLERRM;
    END;
    GRANT USAGE ON SCHEMA public TO dilna_app;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO dilna_app;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO dilna_app;
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO dilna_app;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO dilna_app;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO dilna_app;
  END IF;
END
$$;
