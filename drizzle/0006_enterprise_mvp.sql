-- Enterprise MVP Day 1–2: align employers/jobs/applications with locked MVP-SPEC entities.
-- Table names stay as in repo (employers = Company, employer_users = EmployerUser).

-- Company (employers)
ALTER TABLE employers
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS dic text,
  ADD COLUMN IF NOT EXISTS address jsonb,
  ADD COLUMN IF NOT EXISTS ares_raw jsonb;

UPDATE employers SET display_name = company_name WHERE display_name IS NULL;
ALTER TABLE employers ALTER COLUMN display_name SET NOT NULL;
ALTER TABLE employers ALTER COLUMN display_name SET DEFAULT '';

ALTER TABLE employers DROP CONSTRAINT IF EXISTS employers_verification_status_check;
ALTER TABLE employers ADD CONSTRAINT employers_verification_status_check
  CHECK (verification_status IN ('pending', 'verified', 'rejected', 'failed', 'manual'));

-- EmployerUser
ALTER TABLE employer_users
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS last_login_at timestamptz;

-- Job: all-professions category + salary/contract fields from MVP-SPEC
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS salary_type text NOT NULL DEFAULT 'monthly',
  ADD COLUMN IF NOT EXISTS contract_type text;

UPDATE jobs SET category = CASE profession
  WHEN 'cnc' THEN 'manufacturing'
  WHEN 'welder' THEN 'trades'
  WHEN 'setter' THEN 'manufacturing'
  WHEN 'electrician' THEN 'trades'
  WHEN 'maintenance' THEN 'trades'
  WHEN 'locksmith' THEN 'trades'
  WHEN 'operator' THEN 'manufacturing'
  ELSE 'other'
END
WHERE category IS NULL;

ALTER TABLE jobs ALTER COLUMN category SET NOT NULL;
ALTER TABLE jobs ALTER COLUMN category SET DEFAULT 'other';

UPDATE jobs SET contract_type = CASE employment_type
  WHEN 'part_time' THEN 'dpp'
  ELSE 'hpp'
END
WHERE contract_type IS NULL;

ALTER TABLE jobs ALTER COLUMN contract_type SET NOT NULL;
ALTER TABLE jobs ALTER COLUMN contract_type SET DEFAULT 'hpp';

UPDATE jobs SET salary_type = 'negotiable'
WHERE salary_min IS NULL AND salary_max IS NULL AND (salary_note IS NULL OR salary_note ILIKE '%dohod%');

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_profession_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_profession_check
  CHECK (profession IN (
    'cnc', 'welder', 'setter', 'electrician', 'maintenance', 'locksmith', 'operator', 'other',
    'administration', 'accounting', 'sales', 'customer_service', 'logistics', 'driver',
    'it', 'healthcare', 'education', 'hospitality', 'construction', 'manufacturing',
    'trades', 'facility', 'marketing', 'hr'
  ));

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_category_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_category_check
  CHECK (category IN (
    'administration', 'accounting', 'sales', 'customer_service', 'logistics', 'driver',
    'it', 'healthcare', 'education', 'hospitality', 'construction', 'manufacturing',
    'trades', 'facility', 'marketing', 'hr', 'other'
  ));

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_salary_type_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_salary_type_check
  CHECK (salary_type IN ('monthly', 'hourly', 'negotiable'));

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_contract_type_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_contract_type_check
  CHECK (contract_type IN ('hpp', 'dpp', 'dpc', 'ico'));

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_employment_type_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_employment_type_check
  CHECK (employment_type IN ('full_time', 'part_time', 'shift', 'hpp', 'dpp', 'dpc', 'ico'));

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_status_check
  CHECK (status IN ('draft', 'pending_review', 'published', 'expired', 'unpublished', 'closed'));

CREATE INDEX IF NOT EXISTS jobs_category_idx ON jobs (category);
CREATE INDEX IF NOT EXISTS jobs_region_city_idx ON jobs (region, city);
CREATE INDEX IF NOT EXISTS jobs_salary_min_idx ON jobs (salary_min);

-- Application
ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS consent_at timestamptz;

UPDATE applications SET consent_at = created_at WHERE consent_gdpr = true AND consent_at IS NULL;

ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;
ALTER TABLE applications ADD CONSTRAINT applications_status_check
  CHECK (status IN ('new', 'seen'));

-- Public catalog: published jobs (already) + verified public company fields for those ads.
-- Recreate employers_public_read so verification_status / legal_name / display_name are readable
-- only for companies with a live published job (no silent fake badges from unpublished rows).
DROP POLICY IF EXISTS employers_public_read ON employers;
CREATE POLICY employers_public_read ON employers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.employer_id = employers.id
        AND j.status = 'published'
        AND (j.expires_at IS NULL OR j.expires_at > now())
    )
  );

-- Employer-scoped company / jobs / applications remain via existing *_self / *_employer_* policies.
-- Closed jobs are not publicly listed (status <> published).
