-- Published catalog needs company name. Row-level only: employers that currently have a live ad.
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
