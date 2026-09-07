import { test, expect } from '@playwright/test';

// Exercise real browser layout/animation behavior, not just presence of markup.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('hasSeenPreloader', 'true');
    } catch {
      /* storage can be blocked */
    }
  });
});

test('marquee pauses on hover and has a persistent keyboard-accessible pause', async ({ page }) => {
  await page.goto('/');
  const marquee = page.locator('#live-marquee');
  const track = page.locator('.marquee-animate');
  await marquee.hover();
  await expect(track).toHaveCSS('animation-play-state', 'paused');
  await page.getByRole('button', { name: 'Pause live updates' }).click();
  await page.mouse.move(10, 500);
  await page.locator('h1').click();
  await expect(track).toHaveCSS('animation-play-state', 'paused');
  await page.getByRole('button', { name: 'Resume live updates' }).click();
  await page.mouse.move(10, 500);
  await page.locator('h1').click();
  await expect(track).toHaveCSS('animation-play-state', 'running');
});

test('projects do not overlap the process and every card is reachable, including rapid clicks', async ({
  page,
}) => {
  await page.goto('/#projects');
  const track = page.locator('#project-showcase');
  await expect(track).toBeVisible();
  const gap = await page.evaluate(
    () =>
      document.querySelector('#projects')!.getBoundingClientRect().top -
      document.querySelector('#how-i-build')!.getBoundingClientRect().bottom,
  );
  expect(gap).toBeGreaterThan(40);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Previous project' })).toBeDisabled();
  const next = page.getByRole('button', { name: 'Next project' });
  await next.click();
  await next.click();
  await expect(next).toBeDisabled();
  const lastCard = page.locator('.project-card').last();
  await expect
    .poll(async () =>
      lastCard.evaluate((element) => {
        const card = element.getBoundingClientRect();
        const track = element.parentElement!.getBoundingClientRect();
        return card.left >= track.left - 2 && card.right <= track.right + 2;
      }),
    )
    .toBe(true);
  await track.focus();
  await page.keyboard.press('Home');
  await expect(page.getByRole('button', { name: 'Previous project' })).toBeDisabled();
  await page.keyboard.press('End');
  await expect(next).toBeDisabled();
});

test('AI locks background scrolling, traps enabled controls, and restores focus without jumping', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Work', exact: true }).click();
  await expect
    .poll(() =>
      page.locator('#projects').evaluate((el) => Math.round(el.getBoundingClientRect().top)),
    )
    .toBe(128);
  const before = await page.evaluate(() => window.scrollY);
  const trigger = page.locator('header').getByRole('button', { name: 'Ask My AI', exact: true });
  await trigger.click();
  const input = page.getByRole('textbox', { name: 'Your message' });
  await expect(input).toBeFocused();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(before, 0);
  await page.mouse.move(20, 500);
  await page.mouse.wheel(0, 600);
  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(before, 0);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Clear conversation' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(input).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(before, 0);
});

test('changing reduced-motion preferences stops effects and keeps projects accessible', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/lenis/);
  for (let iteration = 0; iteration < 2; iteration++) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
    await expect(page.locator('[data-custom-cursor]')).toHaveCount(0);
    await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
    await expect(page.locator('.marquee-animate')).toHaveCSS('animation-name', 'none');
    await expect(page.locator('#project-showcase')).toHaveCSS('overflow-x', 'auto');
    await expect(page.locator('.preloader-root')).toHaveCount(0);
    if (iteration === 0) {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await expect(page.locator('html')).toHaveClass(/lenis/);
    }
  }
  await page.getByRole('link', { name: 'Playground', exact: true }).click();
  await page.waitForURL('**/playground');
  await expect(page.locator('#page-transition-overlay')).toBeHidden();
});

test('route wipes clean up and never play on a direct load or browser back', async ({ page }) => {
  await page.goto('/');
  const overlay = page.locator('#page-transition-overlay');
  await expect(overlay).toBeHidden();
  for (let iteration = 0; iteration < 2; iteration++) {
    await page.getByRole('link', { name: 'Playground', exact: true }).click();
    await page.waitForURL('**/playground');
    await expect(overlay).toBeHidden();
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
    await page.getByRole('link', { name: 'Back to Portfolio' }).click();
    await page.waitForURL('/');
    await expect(overlay).toBeHidden();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  }
  await page.goBack();
  await page.waitForURL('**/playground');
  await expect(overlay).toBeHidden();
});

test('modifier clicks keep native new-tab behavior without covering the current page', async ({
  page,
  context,
}) => {
  await page.goto('/');
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page
      .getByRole('link', { name: 'Playground', exact: true })
      .click({ modifiers: ['ControlOrMeta'] }),
  ]);
  await expect(page).toHaveURL('/');
  await expect(page.locator('#page-transition-overlay')).toBeHidden();
  await popup.close();
});

test('a stalled navigation cannot strand the visitor behind the overlay', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/playground*', async (route) => {
    await gate;
    await route.continue();
  });
  try {
    await page.goto('/');
    await page.getByRole('link', { name: 'Playground', exact: true }).click();
    await expect(page.locator('#page-transition-overlay')).toBeVisible();
    await expect(page.locator('#page-transition-overlay')).toBeHidden({ timeout: 4000 });
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  } finally {
    release();
  }
  await page.waitForURL('**/playground');
});

test('blocked session storage does not crash the preloader or lock the page', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', {
      get() {
        throw new DOMException('Storage blocked', 'SecurityError');
      },
    });
  });
  await page.goto('/');
  await page.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page.locator('.preloader-root')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  expect(errors).toEqual([]);
});

test('content and the native project scroller remain usable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#contact')).toHaveCSS('opacity', '1');
  await expect(page.locator('#project-showcase')).toHaveCSS('overflow-x', 'auto');
  await expect(page.locator('.project-card')).toHaveCount(3);
  await expect(page.locator('.preloader-root')).toHaveCount(0);
  await expect(page.locator('#page-transition-overlay')).toBeHidden();
  await context.close();
});

test.describe('mobile and tablet interactions', () => {
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

  test('menu-to-AI handoff keeps scrolling locked and returns focus to the hamburger', async ({
    page,
  }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Open navigation menu' });
    await trigger.click();
    await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
    await page.getByRole('dialog').getByRole('button', { name: 'Ask My AI', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Your message' })).toBeFocused();
    await expect(page.locator('#mobile-menu')).toHaveCount(0);
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
  });

  test('resizing out of the mobile menu closes it and releases its scroll lock', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open navigation menu' }).click();
    await page.setViewportSize({ width: 1100, height: 800 });
    await expect(page.locator('#mobile-menu')).toHaveCount(0);
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  });
});

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`home and playground fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const path of ['/', '/playground']) {
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      if (path === '/playground') {
        for (const name of ['Reset', 'Enhance with AI', 'Generate']) {
          const button = page.getByRole('button', { name, exact: true });
          const rect = await button.boundingBox();
          expect(rect).not.toBeNull();
          expect(rect!.x).toBeGreaterThanOrEqual(0);
          expect(rect!.x + rect!.width).toBeLessThanOrEqual(width);
          // Ignore sub-pixel rounding while a parent entrance transform is finishing.
          expect(Math.round(rect!.height)).toBeGreaterThanOrEqual(44);
        }
      }
    }
    expect(errors).toEqual([]);
  });
}

test('section anchors remain aligned after their reveal animations finish', async ({ page }) => {
  await page.goto('/');
  for (const [name, id] of [
    ['Services', 'services'],
    ['Skills', 'skills'],
    ['Credentials', 'credentials'],
    ['Contact', 'contact'],
  ]) {
    await page.locator('header').getByRole('link', { name, exact: true }).click();
    await expect
      .poll(() =>
        page.locator(`#${id}`).evaluate((el) => Math.abs(el.getBoundingClientRect().top - 128)),
      )
      .toBeLessThan(2);
    await expect(page.locator(`#${id} > div`).first()).toHaveCSS('opacity', '1');
  }
});

test('the skip link actually bypasses navigation and focuses main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('main').getByRole('button', { name: 'Ask My AI', exact: true }),
  ).toBeFocused();
});

test('the first-visit preloader exits, restores scrolling, and does not replay', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  await page.goto('/');
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem('hasSeenPreloader')))
    .toBe('true');
  await expect(page.locator('.preloader-root')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await page.reload();
  await expect(page.locator('.preloader-root')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await context.close();
});
