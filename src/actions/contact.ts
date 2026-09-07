'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import { escapeHtml, validateContactFields } from '@/lib/contact-utils';

// Simple in-memory rate limiting for server actions
// Note: In Vercel, this resets on cold starts, but provides basic spam protection
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 contact form submissions per minute per IP

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

    const validationError = validateContactFields(name, email, service, message);
    if (validationError) {
      return { success: false, error: validationError };
    }

    // validateContactFields guarantees all four are non-empty strings — the
    // assertion carries that proof for downstream narrowing.
    const validName = name as string;
    const validEmail = email as string;
    const validService = service as string;
    const validMessage = message as string;

    // Either durable storage or accepted email delivery is required for success.
    // Provider failures are independent so a database outage doesn't discard email.
    let stored = false;
    let emailed = false;
    try {
      const { error } = await getSupabaseAdmin()
        .from('contacts')
        .insert([
          {
            name: validName,
            email: validEmail,
            service: validService,
            message: validMessage,
          },
        ]);
      stored = !error;
      if (error) console.error('Supabase Insert Error:', error.message);
    } catch (databaseError) {
      console.error('Supabase Insert Error:', databaseError);
    }

    // 5. Send Email via Resend
    try {
      const fromEmail =
        process.env.CONTACT_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

      const resend = new Resend(process.env.RESEND_API_KEY);
      const result = await resend.emails.send({
        from: fromEmail,
        to: 'jhonreyc2001@gmail.com',
        replyTo: validEmail,
        subject: `New Contact Form Submission: ${service}`,
        html: `
          <h3>New Message from ${escapeHtml(validName)}</h3>
          <p><strong>Email:</strong> ${escapeHtml(validEmail)}</p>
          <p><strong>Service Requested:</strong> ${escapeHtml(validService)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(validMessage).replace(/\n/g, '<br/>')}</p>
        `,
      });
      // Resend usually returns an error object instead of throwing.
      emailed = !result.error && !!result.data?.id;
      if (result.error) console.error('Resend Email Error:', result.error.message);
    } catch (emailErr) {
      // We don't want to fail the user request if email fails, but we should log it
      console.error('Resend Email Error:', emailErr);
    }

    if (!stored && !emailed) {
      return {
        success: false,
        error:
          'Your message could not be delivered. Please try again or email jhonreyc2001@gmail.com.',
      };
    }
    return { success: true };
  } catch (err) {
    console.error('Contact Form Error:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
