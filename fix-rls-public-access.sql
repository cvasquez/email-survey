-- Fix RLS to allow public read access to surveys
-- This allows the public response form to fetch survey details

-- Drop the existing SELECT policy
DROP POLICY IF EXISTS "Users can view their own surveys" ON surveys;

-- Create new policies
CREATE POLICY "Anyone can view active surveys"
  ON surveys FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view their own surveys"
  ON surveys FOR SELECT
  USING (auth.uid() = user_id);
