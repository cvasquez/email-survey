import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ensureOrg } from '@/lib/org'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await ensureOrg()
    const supabase = await createClient()

    // RLS ensures user can only access surveys from their orgs
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .select('id')
      .eq('id', id)
      .single()

    if (surveyError || !survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    // Fetch responses (RLS ensures org membership)
    const { data: responses, error } = await supabase
      .from('responses')
      .select('*')
      .eq('survey_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ responses })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
