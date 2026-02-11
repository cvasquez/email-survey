import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ORG_COOKIE = 'org-id'

export async function getCurrentOrgId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(ORG_COOKIE)?.value || null
}

export async function setCurrentOrgId(orgId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(ORG_COOKIE, orgId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
  })
}

/**
 * Ensures the current authenticated user has a valid org context.
 * Creates a default org if none exists. Accepts pending invites.
 * Returns { orgId, user } or throws if not authenticated.
 */
export async function ensureOrg() {
  const supabase = await createClient()
  const admin = createAdminClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Accept any pending invites for this user's email
  await acceptPendingInvites(user.id, user.email!)

  // Check if cookie has a valid org
  let orgId = await getCurrentOrgId()
  if (orgId) {
    // Use admin client to check membership (avoids self-referencing RLS issue)
    const { data: membership } = await admin
      .from('organization_members')
      .select('id')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .single()

    if (membership) return { orgId, user }
  }

  // No valid org in cookie — find user's first org
  const { data: memberships } = await admin
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)

  if (memberships && memberships.length > 0) {
    const foundOrgId = memberships[0].organization_id
    await setCurrentOrgId(foundOrgId)
    return { orgId: foundOrgId, user }
  }

  // No org exists — create a default one using admin client
  const { data: newOrg, error: orgError } = await admin
    .from('organizations')
    .insert({ name: `${user.email}'s Team`, created_by: user.id })
    .select()
    .single()

  if (orgError || !newOrg) {
    console.error('Failed to create organization:', orgError)
    throw new Error(`Failed to create organization: ${orgError?.message || 'unknown error'}`)
  }

  // Add user as owner
  const { error: memberError } = await admin
    .from('organization_members')
    .insert({ organization_id: newOrg.id, user_id: user.id, role: 'owner' })

  if (memberError) {
    console.error('Failed to add owner membership:', memberError)
    throw new Error(`Failed to set up organization: ${memberError.message}`)
  }

  await setCurrentOrgId(newOrg.id)

  return { orgId: newOrg.id, user }
}

async function acceptPendingInvites(userId: string, email: string) {
  const admin = createAdminClient()

  const { data: invites } = await admin
    .from('organization_invites')
    .select('*')
    .eq('email', email.toLowerCase())

  if (!invites || invites.length === 0) return

  for (const invite of invites) {
    await admin
      .from('organization_members')
      .upsert({
        organization_id: invite.organization_id,
        user_id: userId,
        role: invite.role,
        invited_email: invite.email,
      }, { onConflict: 'organization_id,user_id' })

    await admin
      .from('organization_invites')
      .delete()
      .eq('id', invite.id)
  }
}
