-- Make free_response nullable to support initial click tracking
ALTER TABLE responses ALTER COLUMN free_response DROP NOT NULL;
