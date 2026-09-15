ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS work_mode text NOT NULL DEFAULT 'onsite';

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_work_mode_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_work_mode_check
  CHECK (work_mode IN ('onsite', 'hybrid', 'remote'));
