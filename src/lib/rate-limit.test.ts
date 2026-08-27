import { describe, it, expect, vi, beforeAll } from 'vitest';

// supabase-admin evaluates its env guard at module scope and would hit the
// network-less test env — mock the module before rate-limit imports it.
// (vi.hoisted: the mock factory runs before const initializers.)
const { rpcMock } = vi.hoisted(() => ({ rpcMock: vi.fn() }));
vi.mock('@/lib/supabase-admin', () => ({
  supabaseAdmin: { rpc: rpcMock },
}));

import { getSecondsUntilUTCMidnight, hashIp, checkRateLimit } from './rate-limit';

beforeAll(() => {
  process.env.IP_HASH_SALT = 'unit-test-salt';
});

describe('hashIp', () => {
  it('returns a stable 64-char hex HMAC for the same input', () => {
    const a = hashIp('203.0.113.7', 'salt');
    const b = hashIp('203.0.113.7', 'salt');
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });

  it('changes with the salt and with the IP (never stores the raw IP)', () => {
    const base = hashIp('203.0.113.7', 'salt');
    expect(hashIp('203.0.113.7', 'other-salt')).not.toBe(base);
    expect(hashIp('203.0.113.8', 'salt')).not.toBe(base);
    expect(base).not.toContain('203.0.113.7');
  });
});

describe('getSecondsUntilUTCMidnight', () => {
  it('returns a positive number of seconds not exceeding a day', () => {
    const s = getSecondsUntilUTCMidnight();
    expect(s).toBeGreaterThan(0);
    expect(s).toBeLessThanOrEqual(86400);
  });
});

describe('checkRateLimit', () => {
  it('passes through an allowed RPC result', async () => {
    rpcMock.mockResolvedValueOnce({ data: { allowed: true }, error: null });
    const res = await checkRateLimit({
      ip: '198.51.100.23',
      endpoint: 'chat',
      ipLimit: 20,
      globalLimit: 200,
    });
    expect(res).toEqual({ allowed: true });
    expect(rpcMock).toHaveBeenCalledWith('check_and_increment_api_usage', {
      p_ip_hash: hashIp('198.51.100.23', 'unit-test-salt'),
      p_endpoint: 'chat',
      p_ip_limit: 20,
      p_global_limit: 200,
    });
  });

  it('passes through limit rejections (ip_limit / global_limit)', async () => {
    rpcMock.mockResolvedValueOnce({ data: { allowed: false, reason: 'ip_limit' }, error: null });
    const res = await checkRateLimit({
      ip: '198.51.100.23',
      endpoint: 'chat',
      ipLimit: 20,
      globalLimit: 200,
    });
    expect(res).toEqual({ allowed: false, reason: 'ip_limit' });
  });

  it('fails CLOSED when the RPC errors (abuse protection over availability)', async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: { message: 'connection refused' } });
    const res = await checkRateLimit({
      ip: '198.51.100.23',
      endpoint: 'chat',
      ipLimit: 20,
      globalLimit: 200,
    });
    expect(res).toEqual({ allowed: false, reason: 'database_error' });
  });

  it('throws when IP_HASH_SALT is unset', async () => {
    const salt = process.env.IP_HASH_SALT;
    delete process.env.IP_HASH_SALT;
    rpcMock.mockClear();
    await expect(
      checkRateLimit({ ip: '1.2.3.4', endpoint: 'chat', ipLimit: 20, globalLimit: 200 }),
    ).rejects.toThrow('IP_HASH_SALT');
    process.env.IP_HASH_SALT = salt;
  });
});
