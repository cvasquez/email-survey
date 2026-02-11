-- Fix: Resolve infinite recursion in organization_members RLS policies
-- The self-referencing SELECT policy on organization_members causes PostgreSQL
-- to recurse infinitely. Fix: use a SECURITY DEFINER function that bypasses RLS.

BEGIN;

-- ============================================================
-- 1. Create helper function (bypasses RLS to avoid recursion)
-- ============================================================

CREATE OR REPLACE FUNCTION get_user_org_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION get_user_owner_org_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND role = 'owner'
$$;

-- ============================================================
-- 2. Drop all affected policies
-- ============================================================

-- organization_members policies
DROP POLICY IF EXISTS "Members can view org members" ON organization_members;
DROP POLICY IF EXISTS "Owners can add members" ON organization_members;
DROP POLICY IF EXISTS "Owners or self can remove members" ON organization_members;

-- organizations policies
DROP POLICY IF EXISTS "Members can view their organizations" ON organizations;
DROP POLICY IF EXISTS "Owners can update their organizations" ON organizations;
DROP POLICY IF EXISTS "Owners can delete their organizations" ON organizations;

-- surveys policies
DROP POLICY IF EXISTS "Org members can view surveys" ON surveys;
DROP POLICY IF EXISTS "Org members can create surveys" ON surveys;
DROP POLICY IF EXISTS "Org members can update surveys" ON surveys;
DROP POLICY IF EXISTS "Org members can delete surveys" ON surveys;

-- responses policies
DROP POLICY IF EXISTS "Org members can view responses" ON responses;

-- organization_invites policies
DROP POLICY IF EXISTS "Members can view org invites" ON organization_invites;
DROP POLICY IF EXISTS "Owners can create invites" ON organization_invites;
DROP POLICY IF EXISTS "Owners can delete invites" ON organization_invites;

-- ============================================================
-- 3. Recreate all policies using the helper functions
-- ============================================================

-- organization_members
CREATE POLICY "Members can view org members"
  ON organization_members FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

CREATE POLICY "Owners can add members"
  ON organization_members FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (SELECT get_user_owner_org_ids()));

CREATE POLICY "Owners or self can remove members"
  ON organization_members FOR DELETE
  TO authenticated
  USING (
    organization_id IN (SELECT get_user_owner_org_ids())
    OR user_id = auth.uid()
  );

-- organizations
CREATE POLICY "Members can view their organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (id IN (SELECT get_user_org_ids()));

CREATE POLICY "Owners can update their organizations"
  ON organizations FOR UPDATE
  TO authenticated
  USING (id IN (SELECT get_user_owner_org_ids()));

CREATE POLICY "Owners can delete their organizations"
  ON organizations FOR DELETE
  TO authenticated
  USING (id IN (SELECT get_user_owner_org_ids()));

-- surveys
CREATE POLICY "Org members can view surveys"
  ON surveys FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

CREATE POLICY "Org members can create surveys"
  ON surveys FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (SELECT get_user_org_ids()));

CREATE POLICY "Org members can update surveys"
  ON surveys FOR UPDATE
  TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

CREATE POLICY "Org members can delete surveys"
  ON surveys FOR DELETE
  TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

-- responses
CREATE POLICY "Org members can view responses"
  ON responses FOR SELECT
  TO authenticated
  USING (
    survey_id IN (
      SELECT id FROM surveys WHERE organization_id IN (SELECT get_user_org_ids())
    )
  );

-- organization_invites
CREATE POLICY "Members can view org invites"
  ON organization_invites FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT get_user_org_ids()));

CREATE POLICY "Owners can create invites"
  ON organization_invites FOR INSERT
  TO authenticated
  WITH CHECK (organization_id IN (SELECT get_user_owner_org_ids()));

CREATE POLICY "Owners can delete invites"
  ON organization_invites FOR DELETE
  TO authenticated
  USING (organization_id IN (SELECT get_user_owner_org_ids()));

COMMIT;
