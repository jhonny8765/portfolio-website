// Pure contact-form helpers, extracted from src/actions/contact.ts (which is a
// 'use server' module and may only export async functions) so they can be
// unit-tested with Vitest and shared without pulling in the action's
// Supabase/Resend dependencies.

export const ALLOWED_SERVICES = ['inquiry', 'dev', 'automation', 'resume'];

// Escape user input before interpolating into the notification email HTML.
// Without this, a submitter can inject arbitrary markup into mail delivered
// from our own Resend address (phishing-by-self).
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validate the four contact form fields. Returns an error message string, or
 * null when the input is valid. Accepts raw (possibly undefined) values
 * straight from FormData.
 */
export function validateContactFields(
  name?: string,
  email?: string,
  service?: string,
  message?: string,
): string | null {
  if (!name || !email || !service || !message) {
    return 'All fields are required.';
  }
  if (name.length > 100) return 'Name is too long.';
  if (email.length > 150 || !email.includes('@')) return 'Invalid email address.';
  if (message.length > 3000) return 'Message is too long.';
  if (!ALLOWED_SERVICES.includes(service)) return 'Invalid service selected.';
  return null;
}
