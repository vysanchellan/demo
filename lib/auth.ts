import type { User } from '@supabase/supabase-js'

/**
 * Robust admin check. Reads the role from BOTH:
 *  1. user_metadata.role  (set directly on auth.users — no RLS needed)
 *  2. profiles.role       (requires the profile-read RLS policy)
 *
 * Using both means admin detection works even if the RLS policy for
 * reading own profile hasn't been applied yet.
 */
export async function isUserAdmin(user: User | null): Promise<boolean> {
  if (!user) return false

  // Fast path — role embedded in the JWT user metadata
  const metaRole = (user.user_metadata?.role || user.app_metadata?.role) as string | undefined
  if (metaRole === 'admin') return true

  // Fallback — read from profiles table
  try {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    return data?.role === 'admin'
  } catch {
    return false
  }
}
