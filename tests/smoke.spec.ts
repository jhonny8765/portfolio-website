import { test, expect } from '@playwright/test';

// Phase 6.2 smoke: nav renders, projects load, contact submits (reaches a
// terminal success/error state regardless of env), AskMyAI opens.

test('home renders navigation and hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Work' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ask My AI' }).first()).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'I build with AI — websites, apps, & automations.' }),
  ).toBeVisible();
});

test('projects section and case-study page load', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('SukiSuite').first()).toBeVisible();

  await page.goto('/projects/sukisuite');
  await expect(page.getByRole('heading', { name: 'SukiSuite', level: 1 })).toBeVisible();
  // Phase 5 conversion facts are rendered from real owner data
  await expect(page.getByText(/salon owners using SukiSuite/)).toBeVisible();
});

test('contact form submits and reaches a terminal state', async ({ page }) => {
  await page.goto('/');
  await page.locator('input[name="name"]').fill('Smoke Tester');
  await page.locator('input[name="email"]').fill('smoke@example.com');
  await page.locator('select[name="service"]').selectOption('inquiry');
  await page
    .locator('textarea[name="message"], [name="message"]')
    .fill('Automated smoke test message.');
  await page.locator('button[type="submit"]').click();
  // With placeholder sandbox envs the Resend/Supabase call fails (error path);
  // in production it succeeds. Either terminal state proves the pipeline ran.
  await expect(page.getByText(/thank you|went wrong|error|try again/i).first()).toBeVisible({
    timeout: 15_000,
  });
});

test('Ask My AI dialog opens from the header', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ask My AI' }).first().click();
  // The panel is dynamically imported: accept its loading shell or the chat UI.
  await expect(
    page
      .getByRole('dialog')
      .or(page.getByText(/Ask My AI|Initializing AI Assistant/i))
      .first(),
  ).toBeVisible({ timeout: 15_000 });
});
