import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ensureOrg, getCurrentOrgId } from '@/lib/org'

export async function GET() {
  try {
    await ensureOrg()
    const supabase = await createClient()
    const currentOrgId = await getCurrentOrgId()

    const { data: memberships, error } = await supabase
      .from('organization_members')
      .select('organization_id, role, organizations(id, name)')
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const organizations = (memberships || []).map((m: any) => ({
      id: m.organizations.id,
      name: m.organizations.name,
      role: m.role,
    }))

    return NextResponse.json({ organizations, currentOrgId })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await ensureOrg()
    const supabase = await createClient()
    const body = await request.json()

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const { data: org, error } = await supabase
      .from('organizations')
      .insert({ name: body.name.trim(), created_by: user.id })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Use admin client to add owner (RLS requires existing membership)
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const admin = createAdminClient()
    await admin
      .from('organization_members')
      .insert({ organization_id: org.id, user_id: user.id, role: 'owner' })

    // Switch to the new org
    const { setCurrentOrgId } = await import('@/lib/org')
    await setCurrentOrgId(org.id)

    return NextResponse.json({ organization: org }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
