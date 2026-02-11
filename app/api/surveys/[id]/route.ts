import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ensureOrg } from '@/lib/org'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Public endpoint - no auth required
    // Fetch survey by unique_link_id (used in URLs) — only return fields needed by the public form
    const { data: survey, error } = await supabase
      .from('surveys')
      .select('id, title, is_active, require_name')
      .eq('unique_link_id', id)
      .single()

    if (error || !survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    return NextResponse.json({ survey })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await ensureOrg()
    const supabase = await createClient()

    // RLS ensures user can only delete surveys from their orgs
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .select('id')
      .eq('id', id)
      .single()

    if (surveyError || !survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    // Delete survey (responses cascade via FK)
    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('id', id)

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
