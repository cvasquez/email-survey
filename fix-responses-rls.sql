-- Fix RLS policy on responses table to allow public inserts
-- This allows the public survey page to record responses

-- Drop existing policy
DROP POLICY IF EXISTS "Anyone can submit responses" ON responses;

-- Recreate policy with proper permissions
CREATE POLICY "Anyone can submit responses"
  ON responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Also ensure SELECT policy exists for survey owners
DROP POLICY IF EXISTS "Survey owners can view responses" ON responses;

CREATE POLICY "Survey owners can view responses"
  ON responses FOR SELECT
  TO authenticated
  USING (
    survey_id IN (
      SELECT id FROM surveys WHERE user_id = auth.uid()
    )
  );
