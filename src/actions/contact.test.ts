import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { insert, send, getAdmin, headersMock } = vi.hoisted(() => ({
  insert: vi.fn(),
  send: vi.fn(),
  getAdmin: vi.fn(),
  headersMock: vi.fn(),
}));
vi.mock('@/lib/supabase-admin', () => ({ getSupabaseAdmin: getAdmin }));
vi.mock('next/headers', () => ({ headers: headersMock }));
vi.mock('resend', () => ({
  Resend: class {
    emails = { send };
  },
}));

import { submitContactForm } from './contact';

let requestNumber = 0;
beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  getAdmin.mockReturnValue({ from: () => ({ insert }) });
  headersMock.mockResolvedValue(new Headers({ 'x-forwarded-for': `test-${++requestNumber}` }));
  insert.mockResolvedValue({ error: null });
  send.mockResolvedValue({ data: { id: 'test-message' }, error: null });
});
afterEach(() => vi.restoreAllMocks());

function contactData() {
  const data = new FormData();
  data.set('name', 'Test Visitor');
  data.set('email', 'visitor@example.com');
  data.set('service', 'inquiry');
  data.set('message', 'A test project inquiry.');
  return data;
}

describe('contact delivery', () => {
  it('succeeds when the message is stored and emailed', async () => {
    expect(await submitContactForm(contactData())).toEqual({ success: true });
    expect(insert).toHaveBeenCalledOnce();
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ replyTo: 'visitor@example.com' }));
  });

  it('does not claim success when BOTH providers return errors', async () => {
    insert.mockResolvedValue({ error: { message: 'Database unavailable' } });
    send.mockResolvedValue({ data: null, error: { message: 'Invalid API key' } });
    expect(await submitContactForm(contactData())).toEqual({
      success: false,
      error: expect.stringContaining('could not be delivered'),
    });
  });

  it('does not claim success when both providers throw', async () => {
    insert.mockRejectedValue(new Error('Database disconnected'));
    send.mockRejectedValue(new Error('Email disconnected'));
    expect((await submitContactForm(contactData())).success).toBe(false);
  });

  it('keeps a successful database submission when email fails', async () => {
    send.mockResolvedValue({ data: null, error: { message: 'Email unavailable' } });
    expect((await submitContactForm(contactData())).success).toBe(true);
  });

  it('still sends email when the database fails', async () => {
    insert.mockRejectedValue(new Error('Database unavailable'));
    expect((await submitContactForm(contactData())).success).toBe(true);
    expect(send).toHaveBeenCalledOnce();
  });

  it('handles missing database configuration without taking down the page', async () => {
    getAdmin.mockImplementationOnce(() => {
      throw new Error('Missing configuration');
    });
    expect((await submitContactForm(contactData())).success).toBe(true);
  });

  it('rejects invalid fields before attempting delivery', async () => {
    const data = contactData();
    data.set('email', 'not-an-email');
    expect((await submitContactForm(data)).success).toBe(false);
    expect(insert).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('silently accepts the honeypot without storing or sending anything', async () => {
    const data = contactData();
    data.set('website', 'automated-check');
    expect((await submitContactForm(data)).success).toBe(true);
    expect(insert).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });
});
