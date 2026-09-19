-- Signed-in seekers may read only applications they submitted from their own
-- account. Guest applications remain employer-only.

CREATE POLICY applications_seeker_select ON applications
  FOR SELECT
  USING (
    seeker_user_id IS NOT NULL
    AND seeker_user_id = current_seeker_id()
  );

-- Keep closed or expired jobs and their companies visible in the seeker's own
-- application history without making them public again.
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

CREATE POLICY employers_seeker_application_read ON employers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM applications a
      WHERE a.employer_id = employers.id
        AND a.seeker_user_id = current_seeker_id()
    )
  );
