import { describe, it, expect } from 'vitest';
import { escapeHtml, validateContactFields, ALLOWED_SERVICES } from './contact-utils';

describe('escapeHtml', () => {
  it('escapes all five HTML-significant characters', () => {
    expect(escapeHtml(`<img src=x onerror="alert('xss')">`)).toBe(
      '&lt;img src=x onerror=&quot;alert(&#39;xss&#39;)&quot;&gt;',
    );
  });

  it('escapes ampersands first (no double-escaping)', () => {
    expect(escapeHtml('a &amp; b')).toBe('a &amp;amp; b');
  });

  it('passes plain text through unchanged', () => {
    expect(escapeHtml('Hello po, interested in a website!')).toBe(
      'Hello po, interested in a website!',
    );
  });
});

describe('validateContactFields', () => {
  const valid = {
    name: 'Juan Dela Cruz',
    email: 'juan@example.com',
    service: 'dev',
    message: 'I need an automation for my store.',
  };

  it('accepts a fully valid submission', () => {
    expect(validateContactFields(valid.name, valid.email, valid.service, valid.message)).toBeNull();
  });

  it.each([
    ['name', [undefined, valid.email, valid.service, valid.message]],
    ['email', [valid.name, undefined, valid.service, valid.message]],
    ['service', [valid.name, valid.email, undefined, valid.message]],
    ['message', [valid.name, valid.email, valid.service, undefined]],
  ])('rejects when %s is missing', (_field, args) => {
    expect(validateContactFields(...(args as [string?, string?, string?, string?]))).toBe(
      'All fields are required.',
    );
  });

  it('rejects oversized names', () => {
    expect(validateContactFields('x'.repeat(101), valid.email, valid.service, valid.message)).toBe(
      'Name is too long.',
    );
  });

  it('rejects emails without an @ or that are oversized', () => {
    expect(validateContactFields(valid.name, 'not-an-email', valid.service, valid.message)).toBe(
      'Invalid email address.',
    );
    expect(
      validateContactFields(valid.name, `${'x'.repeat(150)}@y.ph`, valid.service, valid.message),
    ).toBe('Invalid email address.');
  });

  it('rejects oversized messages', () => {
    expect(validateContactFields(valid.name, valid.email, valid.service, 'x'.repeat(3001))).toBe(
      'Message is too long.',
    );
  });

  it('rejects services outside the allowlist', () => {
    expect(validateContactFields(valid.name, valid.email, 'crypto', valid.message)).toBe(
      'Invalid service selected.',
    );
  });

  it('accepts every service in the allowlist', () => {
    for (const service of ALLOWED_SERVICES) {
      expect(validateContactFields(valid.name, valid.email, service, valid.message)).toBeNull();
    }
  });
});
