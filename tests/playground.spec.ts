import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

// Mock paid/external APIs. These regressions must never consume the owner's quota.
test('generation reports real elapsed time and downloads with the response image type', async ({
  page,
}) => {
  const image = await readFile('public/og-image.jpg');
  await page.route('**/api/generate-image', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await route.fulfill({ contentType: 'image/jpeg', body: image });
  });
  await page.goto('/playground?prompt=A%20green%20mountain');
  await page.getByRole('button', { name: 'Generate', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Reset', exact: true })).toBeDisabled();
  const download = page.getByRole('link', { name: 'Download generated image' });
  await expect(download).toBeVisible();
  await expect(download).toHaveAttribute('download', 'ai-generated-image.jpg');
  await expect(page.getByText(/Generated in [1-9]\d*\.\ds/)).toBeVisible();
  const [file] = await Promise.all([page.waitForEvent('download'), download.click()]);
  expect(file.suggestedFilename()).toBe('ai-generated-image.jpg');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByLabel('Describe your image')).toHaveValue('');
  await expect(download).toHaveCount(0);
});

test('failed image requests show an accessible error and allow retry', async ({ page }) => {
  await page.route('**/api/generate-image', (route) =>
    route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Daily image limit reached. Try again tomorrow.' }),
    }),
  );
  await page.goto('/playground');
  await page.getByLabel('Describe your image').fill('A test landscape');
  await page.getByRole('button', { name: 'Generate', exact: true }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'Daily image limit reached' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Generate', exact: true })).toBeEnabled();
  await expect(page.getByRole('link', { name: 'Download generated image' })).toHaveCount(0);
});

test('a non-image success response is not offered as a broken download', async ({ page }) => {
  await page.route('**/api/generate-image', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: '{}',
    }),
  );
  await page.goto('/playground?prompt=Test');
  await page.getByRole('button', { name: 'Generate', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'invalid image' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Generate', exact: true })).toBeEnabled();
});

test('invalid enhancer responses preserve the original prompt and do not crash rendering', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/api/enhance-prompt', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ enhancedPrompt: null }),
    }),
  );
  await page.goto('/playground?prompt=Original%20prompt');
  await page.getByRole('button', { name: 'Enhance with AI' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'invalid prompt' })).toBeVisible();
  await expect(page.getByLabel('Describe your image')).toHaveValue('Original prompt');
  expect(errors).toEqual([]);
});

test('valid enhancement updates the shareable prompt and keeps generation available', async ({
  page,
}) => {
  await page.route('**/api/enhance-prompt', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ enhancedPrompt: 'One green mountain, golden morning light' }),
    }),
  );
  await page.goto('/playground?prompt=A%20mountain');
  await page.getByRole('button', { name: 'Enhance with AI' }).click();
  await expect(page.getByLabel('Describe your image')).toHaveValue(
    'One green mountain, golden morning light',
  );
  await expect
    .poll(() => new URL(page.url()).searchParams.get('prompt'))
    .toBe('One green mountain, golden morning light');
  await expect(page.getByRole('button', { name: 'Generate', exact: true })).toBeEnabled();
});
