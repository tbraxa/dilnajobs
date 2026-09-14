-- Payments fulfill (webhook) + employer notify email without opening RLS to the public role.
-- Job expiry callable from serverless cron (dilna_app) without a long-lived worker.

CREATE OR REPLACE FUNCTION employer_owner_email(p_job_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.email
  FROM jobs j
  JOIN employer_users u ON u.employer_id = j.employer_id AND u.role = 'owner'
  WHERE j.id = p_job_id
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION employer_owner_email(uuid) FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'dilna_app') THEN
    GRANT EXECUTE ON FUNCTION employer_owner_email(uuid) TO dilna_app;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION fulfill_paid_order(p_order_id uuid, p_provider_ref text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  o orders%ROWTYPE;
  n integer;
BEGIN
  SELECT * INTO o FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'order_not_found';
  END IF;
  IF o.status = 'paid' THEN
    RETURN false;
  END IF;

  UPDATE orders
  SET
    status = 'paid',
    paid_at = now(),
    provider_ref = COALESCE(p_provider_ref, provider_ref)
  WHERE id = p_order_id;

  IF o.package_code = 'top' THEN
    UPDATE jobs
    SET is_top = true, top_until = now() + interval '7 days'
    WHERE id = (
      SELECT id FROM jobs
      WHERE employer_id = o.employer_id AND status = 'published'
      ORDER BY published_at DESC NULLS LAST
      LIMIT 1
    );
  ELSIF o.package_code = 'single' THEN
    UPDATE employers
    SET plan_code = 'single',
        ads_posted_year = 0,
        plan_renews_at = (now() + interval '30 days')::date
    WHERE id = o.employer_id;
  ELSIF o.package_code = 'basic' THEN
    UPDATE employers
    SET plan_code = 'basic',
        ads_posted_year = 0,
        plan_renews_at = (now() + interval '365 days')::date
    WHERE id = o.employer_id;
  ELSIF o.package_code = 'standard' THEN
    UPDATE employers
    SET plan_code = 'standard',
        ads_posted_year = 0,
        plan_renews_at = (now() + interval '365 days')::date
    WHERE id = o.employer_id;
  ELSIF o.package_code = 'trial' THEN
    UPDATE employers
    SET plan_code = 'trial',
        plan_renews_at = (now() + interval '365 days')::date
    WHERE id = o.employer_id;
  END IF;

  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION fulfill_paid_order(uuid, text) FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'dilna_app') THEN
    GRANT EXECUTE ON FUNCTION fulfill_paid_order(uuid, text) TO dilna_app;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION expire_published_jobs()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n integer;
BEGIN
  UPDATE jobs
  SET status = 'expired'
  WHERE status = 'published' AND expires_at IS NOT NULL AND expires_at < now();
  GET DIAGNOSTICS n = ROW_COUNT;

  INSERT INTO system_heartbeats (name, status, detail, checked_at)
  VALUES ('job_expiry', 'ok', n || ' inzerátů expirováno', now())
  ON CONFLICT (name) DO UPDATE
    SET status = excluded.status,
        detail = excluded.detail,
        checked_at = excluded.checked_at;

  RETURN n;
END;
$$;

REVOKE ALL ON FUNCTION expire_published_jobs() FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'dilna_app') THEN
    GRANT EXECUTE ON FUNCTION expire_published_jobs() TO dilna_app;
  END IF;
END $$;
