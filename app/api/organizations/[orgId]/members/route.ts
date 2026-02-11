import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { ensureOrg } from '@/lib/org'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    await ensureOrg()
    const supabase = await createClient()
    const admin = createAdminClient()

    // RLS ensures only org members can view
    const { data: members, error } = await supabase
      .from('organization_members')
      .select('id, user_id, role, created_at, invited_email')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Look up emails for each member via admin client
    const membersWithEmail = await Promise.all(
      (members || []).map(async (m) => {
        const { data } = await admin.auth.admin.getUserById(m.user_id)
        return {
          ...m,
          email: data?.user?.email || m.invited_email || 'Unknown',
        }
      })
    )

    // Get pending invites
    const { data: invites } = await supabase
      .from('organization_invites')
      .select('id, email, role, created_at')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: true })

    return NextResponse.json({ members: membersWithEmail, invites: invites || [] })
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
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Check if the target user is an owner
    const { data: targetMember } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', userId)
      .single()

    if (!targetMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // If removing an owner, check they're not the last one
    if (targetMember.role === 'owner') {
      const { count } = await supabase
        .from('organization_members')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', orgId)
        .eq('role', 'owner')

      if ((count || 0) <= 1) {
        return NextResponse.json(
          { error: 'Cannot remove the last owner. Transfer ownership first.' },
          { status: 400 }
        )
      }
    }

    // RLS policy allows owners to remove anyone, or members to remove themselves
    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('organization_id', orgId)
      .eq('user_id', userId)

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
