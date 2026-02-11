import { createClient } from '@/lib/supabase/server'
import { customAlphabet } from 'nanoid'
import { NextResponse } from 'next/server'
import type { CreateSurveyInput } from '@/types/database'
import { ensureOrg } from '@/lib/org'

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)

export async function GET() {
  try {
    const { orgId } = await ensureOrg()
    const supabase = await createClient()

    const { data: surveys, error } = await supabase
      .from('surveys')
      .select('*, responses(count)')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Flatten the response count
    const surveysWithCounts = (surveys || []).map((s: any) => ({
      ...s,
      response_count: s.responses?.[0]?.count ?? 0,
      responses: undefined,
    }))

    return NextResponse.json({ surveys: surveysWithCounts })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { orgId, user } = await ensureOrg()
    const supabase = await createClient()

    const body: CreateSurveyInput = await request.json()

    // Validate input
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Generate unique link ID
    const uniqueLinkId = nanoid()

    const { data: survey, error } = await supabase
      .from('surveys')
      .insert({
        title: body.title.trim(),
        require_name: body.require_name || false,
        unique_link_id: uniqueLinkId,
        user_id: user.id,
        created_by_email: user.email,
        organization_id: orgId,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ survey }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
