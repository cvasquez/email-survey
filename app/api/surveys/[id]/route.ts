import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Public endpoint - no auth required
    // Fetch survey by unique_link_id (used in URLs)
    const { data: survey, error } = await supabase
      .from('surveys')
      .select('*')
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
