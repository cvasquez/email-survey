-- COMPREHENSIVE RLS FIX FOR RESPONSES TABLE
-- This will completely reset and fix all RLS policies

-- 1. Drop ALL existing policies on responses table
DROP POLICY IF EXISTS "Anyone can submit responses" ON responses;
DROP POLICY IF EXISTS "Survey owners can view responses" ON responses;
DROP POLICY IF EXISTS "Public can insert responses" ON responses;
DROP POLICY IF EXISTS "Users can view responses" ON responses;

-- 2. Ensure RLS is enabled
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- 3. Create INSERT policy for anonymous (public) users
CREATE POLICY "allow_anon_insert_responses"
ON responses
FOR INSERT
TO anon
WITH CHECK (true);

-- 4. Create INSERT policy for authenticated users
CREATE POLICY "allow_auth_insert_responses"
ON responses
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 5. Create SELECT policy for survey owners
CREATE POLICY "allow_owners_view_responses"
ON responses
FOR SELECT
TO authenticated
USING (
  survey_id IN (
    SELECT id FROM surveys WHERE user_id = auth.uid()
  )
);

-- 6. Create UPDATE policy for anonymous users (for updating their own responses)
CREATE POLICY "allow_anon_update_responses"
ON responses
FOR UPDATE
TO anon
WITH CHECK (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'responses';
