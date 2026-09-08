import { test, expect } from '@playwright/test';
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';

test('streamed chat scrolls inside its panel, including after lazy Markdown loads', async ({
  page,
}) => {
  const response = createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute({ writer }) {
        writer.write({ type: 'start', messageId: 'test-reply' });
        writer.write({ type: 'text-start', id: 'reply' });
        writer.write({
          type: 'text-delta',
          id: 'reply',
          delta:
            '## Test reply\n\n' +
            'A detailed answer about building reliable web applications.\n\n'.repeat(50),
        });
        writer.write({ type: 'text-end', id: 'reply' });
        writer.write({ type: 'finish' });
      },
    }),
  });
  const body = await response.text();
  await page.route('**/api/chat', (route) =>
    route.fulfill({
      headers: Object.fromEntries(response.headers.entries()),
      body,
    }),
  );
  await page.goto('/#projects');
  await expect
    .poll(() =>
      page.locator('#projects').evaluate((el) => Math.abs(el.getBoundingClientRect().top - 128)),
    )
    .toBeLessThan(2);
  const before = await page.evaluate(() => scrollY);
  await page.locator('header').getByRole('button', { name: 'Ask My AI', exact: true }).click();
  const input = page.getByRole('textbox', { name: 'Your message' });
  await input.fill('Tell me about the work');
  await page.getByRole('dialog').getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Test reply' })).toBeAttached();
  await expect(input).toBeEnabled();
  const log = page.getByRole('log', { name: 'Conversation' });
  await expect
    .poll(() =>
      log.evaluate(
        (el) => el.scrollTop > 0 && el.scrollHeight - el.scrollTop - el.clientHeight < 4,
      ),
    )
    .toBe(true);
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(before, 0);
  const scrollTop = await log.evaluate((el) => el.scrollTop);
  const box = await log.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + 100);
  await page.mouse.wheel(0, -400);
  await expect.poll(() => log.evaluate((el) => el.scrollTop)).toBeLessThan(scrollTop);
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(before, 0);
  await page.getByRole('button', { name: 'Clear conversation' }).click();
  await expect(page.getByRole('heading', { name: 'Test reply' })).toHaveCount(0);
  await expect(input).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
