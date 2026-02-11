import { createClient } from '@/lib/supabase/server'
import { customAlphabet } from 'nanoid'
import { NextResponse } from 'next/server'
import type { CreateSurveyInput } from '@/types/database'

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: surveys, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ surveys })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ survey }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
