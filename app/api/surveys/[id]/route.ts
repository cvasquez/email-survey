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
      .select('id, title, is_active, require_name, question, answer_options')
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await ensureOrg()
    const supabase = await createClient()
    const body = await request.json()
    const updates: Record<string, any> = {}

    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || !body.title.trim()) {
        return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 })
      }
      updates.title = body.title.trim()
    }
    if (body.question !== undefined) {
      updates.question = body.question?.trim() || null
    }
    if (body.answer_options !== undefined) {
      updates.answer_options = body.answer_options.filter((o: string) => o.trim())
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const { data: survey, error } = await supabase
      .from('surveys')
      .update(updates)
      .eq('id', id)
      .select('id, title, question, answer_options')
      .single()

    if (error || !survey) {
      return NextResponse.json({ error: error?.message || 'Survey not found' }, { status: error ? 500 : 404 })
    }

    return NextResponse.json({ survey })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
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
