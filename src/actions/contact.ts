'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { headers } from 'next/headers';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting for server actions
// Note: In Vercel, this resets on cold starts, but provides basic spam protection
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 contact form submissions per minute per IP

const ALLOWED_SERVICES = ['inquiry', 'dev', 'automation', 'resume'];

// Escape user input before interpolating into the notification email HTML.
// Without this, a submitter can inject arbitrary markup into mail delivered
// from our own Resend address (phishing-by-self).
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function submitContactForm(formData: FormData) {
  try {
    // 1. Rate Limiting
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    // Hash or mask the IP for memory if privacy is a concern, but since it's just in-memory
    // and wiped on restart, raw IP in memory is standard. We will NOT store it in the database.
    const rateLimitInfo = rateLimitMap.get(ip) || { count: 0, timestamp: now };

    if (now - rateLimitInfo.timestamp > RATE_LIMIT_WINDOW_MS) {
      rateLimitInfo.count = 1;
      rateLimitInfo.timestamp = now;
    } else {
      rateLimitInfo.count++;
      if (rateLimitInfo.count > MAX_REQUESTS_PER_WINDOW) {
        return { success: false, error: 'Too many requests. Please try again later.' };
      }
    }
    rateLimitMap.set(ip, rateLimitInfo);

    // 2. Honeypot Check
    // If the hidden 'website' field is filled, it's likely a bot.
    const honeypot = formData.get('website');
    if (honeypot) {
      // Silently succeed to fool the bot
      return { success: true };
    }

    // 3. Extract and Validate Fields
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const service = formData.get('service')?.toString().trim();
    const message = formData.get('message')?.toString().trim();

    if (!name || !email || !service || !message) {
      return { success: false, error: 'All fields are required.' };
    }

    // Length constraints
    if (name.length > 100) return { success: false, error: 'Name is too long.' };
    if (email.length > 150 || !email.includes('@'))
      return { success: false, error: 'Invalid email address.' };
    if (message.length > 3000) return { success: false, error: 'Message is too long.' };

    // Service allowlist
    if (!ALLOWED_SERVICES.includes(service)) {
      return { success: false, error: 'Invalid service selected.' };
    }

    // 4. Database Insertion using Admin Client
    // We intentionally omit storing the IP address to preserve privacy.
    const { error } = await supabaseAdmin.from('contacts').insert([
      {
        name,
        email,
        service,
        message,
        // created_at is handled by Postgres default
      },
    ]);

    if (error) {
      // Log the actual error internally, but do NOT expose it to the client
      console.error('Supabase Insert Error:', error.message);
      return {
        success: false,
        error: 'An error occurred while sending your message. Please try again later.',
      };
    }

    // 5. Send Email via Resend
    try {
      const fromEmail =
        process.env.CONTACT_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

      // Notify you
      await resend.emails.send({
        from: fromEmail,
        to: 'jhonreyc2001@gmail.com',
        subject: `New Contact Form Submission: ${service}`,
        html: `
          <h3>New Message from ${escapeHtml(name)}</h3>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Service Requested:</strong> ${escapeHtml(service)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
        `,
      });
    } catch (emailErr) {
      // We don't want to fail the user request if email fails, but we should log it
      console.error('Resend Email Error:', emailErr);
    }

    return { success: true };
  } catch (err) {
    console.error('Contact Form Error:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
