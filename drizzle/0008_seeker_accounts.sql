-- Seeker accounts, profile ownership, favorites, and account-linked applications.

ALTER TABLE magic_tokens DROP CONSTRAINT IF EXISTS magic_tokens_purpose_check;
ALTER TABLE magic_tokens ADD CONSTRAINT magic_tokens_purpose_check
  CHECK (purpose IN ('employer', 'admin', 'seeker'));

CREATE TABLE seeker_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  phone text,
  city text,
  desired_role text,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE seeker_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_user_id uuid NOT NULL REFERENCES seeker_users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_agent text,
  ip_hash text
);

CREATE INDEX seeker_sessions_user_idx ON seeker_sessions (seeker_user_id);
CREATE INDEX seeker_sessions_expiry_idx ON seeker_sessions (expires_at);

CREATE TABLE favorite_jobs (
  seeker_user_id uuid NOT NULL REFERENCES seeker_users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (seeker_user_id, job_id)
);

CREATE INDEX favorite_jobs_created_idx
  ON favorite_jobs (seeker_user_id, created_at DESC);

CREATE TABLE favorite_companies (
  seeker_user_id uuid NOT NULL REFERENCES seeker_users(id) ON DELETE CASCADE,
  employer_id uuid NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (seeker_user_id, employer_id)
);

CREATE INDEX favorite_companies_created_idx
  ON favorite_companies (seeker_user_id, created_at DESC);

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS seeker_user_id uuid REFERENCES seeker_users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS applications_seeker_idx
  ON applications (seeker_user_id, created_at DESC);

ALTER TABLE audit_events DROP CONSTRAINT IF EXISTS audit_events_actor_type_check;
ALTER TABLE audit_events ADD CONSTRAINT audit_events_actor_type_check
  CHECK (actor_type IN ('system', 'employer_user', 'candidate', 'seeker', 'admin'));

CREATE TRIGGER seeker_users_touch BEFORE UPDATE ON seeker_users
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

ALTER TABLE seeker_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seeker_users FORCE ROW LEVEL SECURITY;
ALTER TABLE favorite_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_jobs FORCE ROW LEVEL SECURITY;
ALTER TABLE favorite_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_companies FORCE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION current_seeker_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.seeker_id', true), '')::uuid
$$;

CREATE POLICY seeker_users_self ON seeker_users
  FOR ALL
  USING (id = current_seeker_id())
  WITH CHECK (id = current_seeker_id());

CREATE POLICY seeker_users_register ON seeker_users
  FOR INSERT
  WITH CHECK (current_seeker_id() IS NULL);

CREATE POLICY favorite_jobs_self ON favorite_jobs
  FOR ALL
  USING (seeker_user_id = current_seeker_id())
  WITH CHECK (seeker_user_id = current_seeker_id());

CREATE POLICY favorite_companies_self ON favorite_companies
  FOR ALL
  USING (seeker_user_id = current_seeker_id())
  WITH CHECK (seeker_user_id = current_seeker_id());

-- Saved and previously applied-to vacancies stay visible to their owner after
-- they are unpublished or expire.
CREATE POLICY jobs_seeker_favorite_read ON jobs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM favorite_jobs fj
      WHERE fj.job_id = jobs.id
        AND fj.seeker_user_id = current_seeker_id()
    )
  );

CREATE POLICY jobs_seeker_application_read ON jobs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM applications a
      WHERE a.job_id = jobs.id
        AND a.seeker_user_id = current_seeker_id()
    )
  );

-- Keep a saved company visible to its owner even when it has no live vacancy.
CREATE POLICY employers_seeker_favorite_read ON employers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM favorite_companies fc
      WHERE fc.employer_id = employers.id
        AND fc.seeker_user_id = current_seeker_id()
    )
  );

CREATE POLICY employers_seeker_application_read ON employers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM jobs j
      JOIN applications a ON a.job_id = j.id
      WHERE j.employer_id = employers.id
        AND a.seeker_user_id = current_seeker_id()
    )
  );

-- A public application cannot claim another seeker. Signed-in applications
-- run with app.seeker_id set inside the same transaction.
DROP POLICY IF EXISTS applications_public_insert ON applications;
CREATE POLICY applications_public_insert ON applications
  FOR INSERT
  WITH CHECK (
    consent_gdpr = true
    AND (seeker_user_id IS NULL OR seeker_user_id = current_seeker_id())
    AND EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id = job_id
        AND j.status = 'published'
        AND (j.expires_at IS NULL OR j.expires_at > now())
    )
  );

CREATE POLICY applications_seeker_select ON applications
  FOR SELECT
  USING (seeker_user_id = current_seeker_id());

CREATE OR REPLACE FUNCTION seeker_user_by_email(p_email text)
RETURNS TABLE (
  id uuid,
  email text,
  name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id, u.email, u.name
  FROM seeker_users u
  WHERE u.email = p_email
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION seeker_session_by_token_hash(p_hash text)
RETURNS TABLE (
  session_id uuid,
  expires_at timestamptz,
  user_id uuid,
  email text,
  name text,
  phone text,
  city text,
  desired_role text,
  bio text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.id,
    s.expires_at,
    u.id,
    u.email,
    u.name,
    u.phone,
    u.city,
    u.desired_role,
    u.bio
  FROM seeker_sessions s
  JOIN seeker_users u ON u.id = s.seeker_user_id
  WHERE s.token_hash = p_hash
    AND s.expires_at > now()
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION seeker_user_by_email(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION seeker_session_by_token_hash(text) FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'dilna_app') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON seeker_users, seeker_sessions, favorite_jobs, favorite_companies TO dilna_app;
    GRANT EXECUTE ON FUNCTION seeker_user_by_email(text) TO dilna_app;
    GRANT EXECUTE ON FUNCTION seeker_session_by_token_hash(text) TO dilna_app;
  END IF;
END
$$;
