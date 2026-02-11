import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ensureOrg, setCurrentOrgId } from '@/lib/org'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const { user } = await ensureOrg()
    const supabase = await createClient()

    // Verify membership
    const { data: membership } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this organization' }, { status: 403 })
    }

    await setCurrentOrgId(orgId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    await ensureOrg()
    const supabase = await createClient()
    const body = await request.json()

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (body.name.trim().length > 100) {
      return NextResponse.json({ error: 'Name must be 100 characters or less' }, { status: 400 })
    }

    // RLS ensures only owners can update
    const { data: org, error } = await supabase
      .from('organizations')
      .update({ name: body.name.trim() })
      .eq('id', orgId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Organization not found or not authorized' }, { status: 404 })
    }

    return NextResponse.json({ organization: org })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
