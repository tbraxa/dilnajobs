-- Employer registration contact fields (nullable for existing rows).
-- employer_users.name stays the display string: "Jméno Příjmení".

ALTER TABLE employers ADD COLUMN IF NOT EXISTS dic text;

ALTER TABLE employer_users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE employer_users ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE employer_users ADD COLUMN IF NOT EXISTS last_name text;
