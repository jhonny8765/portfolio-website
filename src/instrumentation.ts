// Next.js instrumentation hook: runs once per runtime boot. Sentry loads only
// when SENTRY_DSN is provisioned; otherwise every config is an early no-op
// (plan 6.1 — wire values via Antigravity dashboard task).
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}
