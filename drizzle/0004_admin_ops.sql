-- Operator admin: separate sessions, heartbeats, cross-tenant RLS via app.is_admin.

ALTER TABLE magic_tokens
  ADD COLUMN IF NOT EXISTS purpose text NOT NULL DEFAULT 'employer'
    CHECK (purpose IN ('employer', 'admin'));

CREATE TABLE admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_agent text,
  ip_hash text
);

CREATE INDEX admin_sessions_email_idx ON admin_sessions (email);

CREATE TABLE system_heartbeats (
  name text PRIMARY KEY,
  status text NOT NULL CHECK (status IN ('ok', 'degraded', 'down', 'unconfigured')),
  detail text,
  checked_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT current_setting('app.is_admin', true) = 'true'
$$;

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'dilna_app') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON admin_sessions TO dilna_app;
    GRANT SELECT, INSERT, UPDATE, DELETE ON system_heartbeats TO dilna_app;
    GRANT EXECUTE ON FUNCTION is_admin() TO dilna_app;
  END IF;
END
$$;

CREATE POLICY employers_admin_select ON employers
  FOR SELECT USING (is_admin());
CREATE POLICY employers_admin_update ON employers
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY employer_users_admin_select ON employer_users
  FOR SELECT USING (is_admin());

CREATE POLICY jobs_admin_select ON jobs
  FOR SELECT USING (is_admin());
CREATE POLICY jobs_admin_update ON jobs
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY applications_admin_select ON applications
  FOR SELECT USING (is_admin());

CREATE POLICY orders_admin_select ON orders
  FOR SELECT USING (is_admin());

CREATE POLICY audit_admin_select ON audit_events
  FOR SELECT USING (is_admin());
