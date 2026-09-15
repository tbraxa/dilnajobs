-- Research CI: listing work_mode + per-job agency flag. Salary stays numeric or explicit dohodou/neuvedena in UI.
-- Expiry stays ~30 days (app TTL + expire_published_jobs cron). Do not add reviews/alerts/company pages/Stripe SKUs.

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS work_mode text NOT NULL DEFAULT 'onsite',
  ADD COLUMN IF NOT EXISTS is_agency boolean NOT NULL DEFAULT false;

UPDATE jobs j
SET is_agency = e.is_agency
FROM employers e
WHERE e.id = j.employer_id
  AND j.is_agency IS DISTINCT FROM e.is_agency;

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_work_mode_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_work_mode_check
  CHECK (work_mode IN ('onsite', 'hybrid', 'remote'));
