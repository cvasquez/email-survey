import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { ensureOrg } from '@/lib/org'

const VALID_ROLES = ['member', 'owner']

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const { user } = await ensureOrg()
    const supabase = await createClient()
    const admin = createAdminClient()
    const body = await request.json()

    if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const email = body.email.trim().toLowerCase()
    const role = VALID_ROLES.includes(body.role) ? body.role : 'member'

    // Verify the current user is an owner of this org
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .single()

    if (!membership || membership.role !== 'owner') {
      return NextResponse.json({ error: 'Only owners can invite members' }, { status: 403 })
    }

    // Check if email is already a member
    const { data: existingMembers } = await admin
      .from('organization_members')
      .select('id, user_id')
      .eq('organization_id', orgId)

    // Look up if a user with this email already exists
    const { data: authList } = await admin.auth.admin.listUsers()
    const existingUser = authList?.users?.find(
      (u) => u.email?.toLowerCase() === email
    )

    if (existingUser) {
      const alreadyMember = existingMembers?.some(
        (m) => m.user_id === existingUser.id
      )
      if (alreadyMember) {
        return NextResponse.json({ error: 'User is already a member' }, { status: 400 })
      }

      // Add directly as member
      const { error } = await admin
        .from('organization_members')
        .insert({
          organization_id: orgId,
          user_id: existingUser.id,
          role,
          invited_email: email,
        })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ status: 'added', email })
    }

    // User doesn't exist yet — create a pending invite
    const { error } = await supabase
      .from('organization_invites')
      .insert({
        organization_id: orgId,
        email,
        invited_by: user.id,
        role,
      })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Invite already sent to this email' }, { status: 400 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'invited', email })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const { user } = await ensureOrg()
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const inviteId = searchParams.get('id')

    if (!inviteId) {
      return NextResponse.json({ error: 'Invite ID is required' }, { status: 400 })
    }

    // Explicit owner check (defense-in-depth alongside RLS)
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .single()

    if (!membership || membership.role !== 'owner') {
      return NextResponse.json({ error: 'Only owners can revoke invites' }, { status: 403 })
    }

    const { error } = await supabase
      .from('organization_invites')
      .delete()
      .eq('id', inviteId)
      .eq('organization_id', orgId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
