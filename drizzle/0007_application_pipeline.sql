ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';

ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;
ALTER TABLE applications ADD CONSTRAINT applications_status_check
  CHECK (status IN ('new', 'reviewing', 'interview', 'hired', 'rejected'));

CREATE INDEX IF NOT EXISTS applications_employer_status_idx
  ON applications (employer_id, status, created_at DESC);
