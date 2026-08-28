import type { NextConfig } from 'next';

// Guard: production builds must know their canonical origin — silently falling
// back to localhost would poison canonical/OG/sitemap URLs (see src/app/layout.tsx).
if (process.env.VERCEL_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL is required for production builds (used for canonical/OG/sitemap URLs).',
  );
}

// Content-Security-Policy — starts REPORT-ONLY so it can't break anything while we
// observe violations (browser console / report endpoint). Flip to enforced CSP after
// a clean observation window (Phase 6).
// Notes on the current app surface:
// - All AI/generation calls are server-side (browser only talks to /api/*) → connect-src 'self'
// - Generated images come back as blob/data URLs → img-src data: blob:
// - GSAP/Lenis need style 'unsafe-inline'; Next needs script 'unsafe-inline' (RSC payload)
//   TODO(Phase 6): move to nonce-based script-src once report-only data is reviewed.
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'Content-Security-Policy-Report-Only', value: cspReportOnly },
];

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

// Sentry wraps the config ONLY when a DSN is provisioned (plan 6.1) — without
// a DSN the app runs exactly as before and no data is sent anywhere.
// hideSourceMaps keeps maps out of the client bundle when enabled.
export default process.env.SENTRY_DSN
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@sentry/nextjs').withSentryConfig(nextConfig, {
      silent: true,
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: false,
    })
  : nextConfig;
