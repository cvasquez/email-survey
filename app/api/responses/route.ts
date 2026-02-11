import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
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
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')

    // Look up location from IP (falls back to server IP if no client IP available)
    let location: string | null = null
    try {
      const geoUrl = ip
        ? `http://ip-api.com/json/${ip}?fields=city,regionName,country`
        : `http://ip-api.com/json/?fields=city,regionName,country`
      const geoRes = await fetch(geoUrl)
      if (geoRes.ok) {
        const geo = await geoRes.json()
        if (geo.city && geo.country) {
          const parts = [geo.city, geo.regionName, geo.country].filter(Boolean)
          location = parts.join(', ')
        }
      }
    } catch {
      // Geolocation is best-effort, don't block response submission
    }

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

    // If response already exists, return minimal info (no PII)
    if (existingResponse) {
      return NextResponse.json({
        response: {
          id: existingResponse.id,
          answer_value: existingResponse.answer_value,
          has_details: !!(existingResponse.free_response?.trim() || existingResponse.respondent_name?.trim()),
        },
      }, { status: 200 })
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
        location: location,
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting response:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      response: {
        id: response.id,
        answer_value: response.answer_value,
        has_details: false,
      },
    }, { status: 201 })
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

    // Verify the request IP matches the original response's IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip')

    const { data: existing } = await supabase
      .from('responses')
      .select('ip_address')
      .eq('id', body.response_id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 })
    }

    if (existing.ip_address && ip && existing.ip_address !== ip) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
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
      .select('id, answer_value')
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

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const responseId = searchParams.get('id')

    if (!responseId) {
      return NextResponse.json({ error: 'Response ID is required' }, { status: 400 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use admin client for the delete since RLS would block it
    const admin = createAdminClient()

    // Verify the response belongs to a survey owned by this user
    const { data: response } = await admin
      .from('responses')
      .select('survey_id')
      .eq('id', responseId)
      .single()

    if (!response) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 })
    }

    const { data: survey } = await supabase
      .from('surveys')
      .select('id')
      .eq('id', response.survey_id)
      .eq('user_id', user.id)
      .single()

    if (!survey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await admin
      .from('responses')
      .delete()
      .eq('id', responseId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
