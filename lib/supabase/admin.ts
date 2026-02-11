import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Service role client for server-side operations that need to bypass RLS
// IMPORTANT: Only use this in server-side API routes, never expose to the client
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
