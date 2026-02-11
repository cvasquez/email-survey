-- Migration: Add Organizations for Multi-User Team Access
-- Run this in your Supabase SQL Editor

BEGIN;

-- ============================================================
-- 1. Create new tables
-- ============================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  invited_email TEXT,
  UNIQUE (organization_id, user_id)
);

CREATE INDEX idx_org_members_org_id ON organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON organization_members(user_id);

ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

CREATE TABLE organization_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  UNIQUE (organization_id, email)
);

CREATE INDEX idx_org_invites_email ON organization_invites(email);
CREATE INDEX idx_org_invites_org_id ON organization_invites(organization_id);

ALTER TABLE organization_invites ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. Add organization_id to surveys (nullable initially)
-- ============================================================

ALTER TABLE surveys ADD COLUMN organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- ============================================================
-- 3. Migrate existing data: create default orgs for existing users
-- ============================================================

-- Create a default org for each user who owns surveys
INSERT INTO organizations (id, name, created_by)
SELECT gen_random_uuid(), COALESCE(u.email, 'My Team'), s.user_id
FROM (SELECT DISTINCT user_id FROM surveys) s
JOIN auth.users u ON u.id = s.user_id;

-- Add each user as owner of their default org
INSERT INTO organization_members (organization_id, user_id, role)
SELECT o.id, o.created_by, 'owner'
FROM organizations o
WHERE o.created_by IS NOT NULL;

-- Assign surveys to their creator's default org
UPDATE surveys SET organization_id = (
  SELECT o.id FROM organizations o WHERE o.created_by = surveys.user_id LIMIT 1
)
WHERE organization_id IS NULL;

-- ============================================================
-- 4. Make organization_id NOT NULL and add index
-- ============================================================

ALTER TABLE surveys ALTER COLUMN organization_id SET NOT NULL;
CREATE INDEX idx_surveys_organization_id ON surveys(organization_id);

-- ============================================================
-- 5. Drop old RLS policies on surveys
-- ============================================================

DROP POLICY IF EXISTS "Users can view their own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can create their own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can update their own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can delete their own surveys" ON surveys;

-- ============================================================
-- 6. Helper functions (SECURITY DEFINER to avoid RLS recursion)
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
-- 7. Create new org-based RLS policies for surveys
-- ============================================================

-- Keep the public policy for active surveys (used by public survey form)
DROP POLICY IF EXISTS "Anyone can view active surveys" ON surveys;
CREATE POLICY "Anyone can view active surveys"
  ON surveys FOR SELECT
  TO anon
  USING (is_active = true);

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

-- ============================================================
-- 8. Update responses RLS (replace owner-based SELECT with org-based)
-- ============================================================

DROP POLICY IF EXISTS "Survey owners can view responses" ON responses;
DROP POLICY IF EXISTS "allow_owners_view_responses" ON responses;

CREATE POLICY "Org members can view responses"
  ON responses FOR SELECT
  TO authenticated
  USING (
    survey_id IN (
      SELECT id FROM surveys WHERE organization_id IN (SELECT get_user_org_ids())
    )
  );

-- ============================================================
-- 9. RLS policies for organizations
-- ============================================================

CREATE POLICY "Members can view their organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (id IN (SELECT get_user_org_ids()));

CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Owners can update their organizations"
  ON organizations FOR UPDATE
  TO authenticated
  USING (id IN (SELECT get_user_owner_org_ids()));

CREATE POLICY "Owners can delete their organizations"
  ON organizations FOR DELETE
  TO authenticated
  USING (id IN (SELECT get_user_owner_org_ids()));

-- ============================================================
-- 10. RLS policies for organization_members
-- ============================================================

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

-- ============================================================
-- 11. RLS policies for organization_invites
-- ============================================================

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
