import { defineConfig } from '@playwright/test';

// Local sandbox: run against the already-built production server with the
// sparticuz chromium (env CHROMIUM_PATH). CI: omit CHROMIUM_PATH and
// `npx playwright install chromium` provides the browser; webServer boots
// `next start` automatically when nothing is listening.
const chromiumPath = process.env.CHROMIUM_PATH;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    headless: true,
    launchOptions: {
      ...(chromiumPath ? { executablePath: chromiumPath } : {}),
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    },
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run start',
        port: 3000,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
