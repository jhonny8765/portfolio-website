import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

// Validate on use, not at import time: missing service configuration should
// produce a recoverable API/form error, not take down the entire portfolio.
export function getSupabaseAdmin() {
  if (client) return client;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing.');
  if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing.');

  // Service-role credentials stay on the server and must never use NEXT_PUBLIC_.
  client = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return client;
}
