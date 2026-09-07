import { defineConfig } from '@playwright/test';

// Local sandbox: run against the already-built production server with the
// sparticuz chromium (env CHROMIUM_PATH). CI: omit CHROMIUM_PATH and
// `npx playwright install chromium` provides the browser; webServer boots
// `next start` automatically when nothing is listening.
const chromiumPath = process.env.CHROMIUM_PATH;
const port = Number(process.env.PLAYWRIGHT_PORT || 3000);

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${port}`,
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      ...(chromiumPath ? { executablePath: chromiumPath } : {}),
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    },
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `npm run start -- --hostname 0.0.0.0 --port ${port}`,
        port,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
