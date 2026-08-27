import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

// Plan 6.1 acceptance probe: hits Sentry with a test event so the dashboard
// wiring (DSN) can be verified end-to-end after provisioning. Returns 501
// when no DSN is configured — no secrets leaked, no noise in production.
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!process.env.SENTRY_DSN) {
    return NextResponse.json({ sent: false, reason: 'SENTRY_DSN not configured' }, { status: 501 });
  }
  const id = Sentry.captureMessage('sentry-test: portfolio Phase 6 smoke event', 'info');
  await Sentry.flush(2000);
  return NextResponse.json({ sent: true, eventId: id });
}
