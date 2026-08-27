import crypto from 'crypto';
import { supabaseAdmin } from './supabase-admin';

export async function checkRateLimit({
  ip,
  endpoint,
  ipLimit,
  globalLimit,
}: {
  ip: string;
  endpoint: string;
  ipLimit: number;
  globalLimit: number;
}) {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) {
    throw new Error('IP_HASH_SALT is missing in environment variables.');
  }

  const ipHash = hashIp(ip, salt);

  // Call the atomic RPC using the admin client to bypass RLS
  const { data, error } = await supabaseAdmin.rpc('check_and_increment_api_usage', {
    p_ip_hash: ipHash,
    p_endpoint: endpoint,
    p_ip_limit: ipLimit,
    p_global_limit: globalLimit,
  });

  if (error) {
    console.error('Rate limit RPC error:', error);
    // If rate limiting fails, default to strict rejection to prevent abuse
    return { allowed: false, reason: 'database_error' };
  }

  return data as { allowed: boolean; reason?: 'global_limit' | 'ip_limit' };
}

export function getSecondsUntilUTCMidnight(): number {
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );
  return Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
}

/** Hash an IP with HMAC-SHA256 (salted) — raw IPs never leave the process. */
export function hashIp(ip: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(ip).digest('hex');
}
