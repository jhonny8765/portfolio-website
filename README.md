# Jhon Rey Consolacion — Portfolio

Next.js portfolio with project case studies, an AI assistant, an image playground,
and a contact form. The dark/volt design uses GSAP for short reveals and pointer
effects, Lenis for desktop scrolling, and native scrolling on touch devices.

## Local development

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev -- --hostname 0.0.0.0
```

Open http://localhost:3000. The portfolio renders without service credentials.
Fonts are bundled locally, so builds do not require a Google Fonts connection.

Copy `.env.example` to `.env.local` to configure the optional contact and AI
services. Keep secrets out of Git; configure production values in Vercel.
`NEXT_PUBLIC_SITE_URL` is required on Vercel production builds for canonical,
Open Graph, and sitemap URLs. No Vercel environment variables are changed by the
animation fixes.

## Validation

```bash
npm run lint
npx tsc --noEmit
npx prettier --check .
npm test
npm run build
npx playwright install chromium
npm run test:smoke
```

The browser suite starts the production server automatically if port 3000 is free.
To test an optimized build while keeping the development preview running:

```bash
PLAYWRIGHT_PORT=3001 npm run test:smoke
```

`PLAYWRIGHT_BASE_URL` targets an already-running server; `CHROMIUM_PATH` optionally
selects a locally installed Chromium executable. Failure screenshots and traces
are written to the ignored `test-results/` directory.

Regression coverage includes route wipes and stalled navigation, native link
behavior, mobile menus, reduced motion, project carousel controls, anchor
alignment, focus/scroll locking, streamed chat, blocked storage, no-JavaScript
content, and responsive playground controls. AI browser requests are mocked and
the contact smoke test uses the honeypot path, so tests do not consume provider
quotas, send email, or create contact records. Delivery success/failure is covered
separately by unit tests.

## Deployment

Vercel deploys from the connected GitHub repository. Changes made on an Arena
working branch should be reviewed and merged into the production branch before
they affect the public site.
