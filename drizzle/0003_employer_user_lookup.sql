CREATE OR REPLACE FUNCTION employer_user_by_email(p_email text)
RETURNS TABLE (
  id uuid,
  employer_id uuid,
  email text,
  name text,
  role text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id, u.employer_id, u.email, u.name, u.role
  FROM employer_users u
  WHERE u.email = p_email
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION session_by_token_hash(p_hash text)
RETURNS TABLE (
  session_id uuid,
  expires_at timestamptz,
  user_id uuid,
  employer_id uuid,
  email text,
  name text,
  company_name text,
  plan_code text,
  ads_posted_year integer,
  verification_status text
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
    u.employer_id,
    u.email,
    u.name,
    e.company_name,
    e.plan_code,
    e.ads_posted_year,
    e.verification_status
  FROM sessions s
  JOIN employer_users u ON u.id = s.employer_user_id
  JOIN employers e ON e.id = u.employer_id
  WHERE s.token_hash = p_hash
    AND s.expires_at > now()
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION employer_user_by_email(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION session_by_token_hash(text) FROM PUBLIC;
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'dilna_app') THEN
    GRANT EXECUTE ON FUNCTION employer_user_by_email(text) TO dilna_app;
    GRANT EXECUTE ON FUNCTION session_by_token_hash(text) TO dilna_app;
  END IF;
END
$$;
