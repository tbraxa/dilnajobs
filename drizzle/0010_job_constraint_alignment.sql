-- Keep database constraints aligned with validated employer form values and
-- lifecycle actions.

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_profession_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_profession_check CHECK (
  profession IN (
    'cnc',
    'welder',
    'setter',
    'electrician',
    'maintenance',
    'locksmith',
    'operator',
    'administration',
    'accounting',
    'sales',
    'it',
    'logistics',
    'driver',
    'hospitality',
    'healthcare',
    'other'
  )
);

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_status_check CHECK (
  status IN (
    'draft',
    'pending_review',
    'published',
    'expired',
    'unpublished',
    'closed'
  )
);
