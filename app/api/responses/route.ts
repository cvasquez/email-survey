import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import type { CreateResponseInput } from '@/types/database'

export async function POST(request: Request) {
  try {
    // Use admin client to bypass RLS for public response submissions
    const supabase = createAdminClient()
    const body: CreateResponseInput = await request.json()

    // Validate input - free_response is now optional for initial tracking
    if (!body.survey_id || !body.answer_value) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify survey exists and is active
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .select('id, is_active, require_name')
      .eq('id', body.survey_id)
      .single()

    if (surveyError || !survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    if (!survey.is_active) {
      return NextResponse.json(
        { error: 'Survey is not accepting responses' },
        { status: 400 }
      )
    }

    // Get IP address and user agent for tracking
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')

    // HYBRID DEDUPLICATION (Option 3)
    let existingResponse = null

    if (body.hash_md5?.trim()) {
      // If hash_md5 exists, check for existing response by hash_md5
      const { data } = await supabase
        .from('responses')
        .select('*')
        .eq('survey_id', body.survey_id)
        .eq('hash_md5', body.hash_md5.trim())
        .maybeSingle()
      
      existingResponse = data
    } else if (ip) {
      // If no hash_md5, check by IP address (within last 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      
      const { data } = await supabase
        .from('responses')
        .select('*')
        .eq('survey_id', body.survey_id)
        .eq('ip_address', ip)
        .gte('created_at', twentyFourHoursAgo)
        .maybeSingle()
      
      existingResponse = data
    }

    // If response already exists, return it
    if (existingResponse) {
      return NextResponse.json({ response: existingResponse }, { status: 200 })
    }

    // Insert new response (free_response can be null for initial tracking)
    const { data: response, error } = await supabase
      .from('responses')
      .insert({
        survey_id: body.survey_id,
        answer_value: body.answer_value.trim(),
        free_response: body.free_response?.trim() || null,
        respondent_name: body.respondent_name?.trim() || null,
        hash_md5: body.hash_md5?.trim() || null,
        ip_address: ip || null,
        user_agent: userAgent || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting response:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ response }, { status: 201 })
  } catch (error: any) {
    console.error('Unexpected error in POST /api/responses:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    // Use admin client to bypass RLS for updating public responses
    const supabase = createAdminClient()
    const body = await request.json()

    // Validate input
    if (!body.response_id) {
      return NextResponse.json(
        { error: 'Response ID is required' },
        { status: 400 }
      )
    }

    // Update response with additional details
    const updateData: any = {}
    if (body.free_response?.trim()) updateData.free_response = body.free_response.trim()
    if (body.respondent_name?.trim()) updateData.respondent_name = body.respondent_name.trim()

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Nothing to update. Please provide a response or name.' },
        { status: 400 }
      )
    }

    const { data: response, error } = await supabase
      .from('responses')
      .update(updateData)
      .eq('id', body.response_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating response:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ response }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in PATCH /api/responses:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
