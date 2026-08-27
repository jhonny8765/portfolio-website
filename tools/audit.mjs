#!/usr/bin/env node
/**
 * audit.mjs — automated UI/UX + technical audit for this portfolio.
 *
 *   node tools/audit.mjs                                  # audits http://localhost:3000
 *   node tools/audit.mjs https://jhonreyconsolacion.vercel.app
 *   node tools/audit.mjs <url> --json report.json         # also write machine-readable output
 *
 * Requires: npx playwright install chromium   (one time)
 *
 * Every check is a MEASUREMENT, not an assertion. It prints the observed value
 * next to the expected one so a failure can never be summarised away.
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const TARGET = process.argv[2]?.startsWith('http') ? process.argv[2].replace(/\/$/, '') : 'http://localhost:3000';
const JSON_OUT = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;

const results = [];
const C = { g: '\x1b[32m', r: '\x1b[31m', y: '\x1b[33m', d: '\x1b[2m', b: '\x1b[1m', x: '\x1b[0m' };

function check(name, pass, observed, expected) {
  results.push({ name, pass, observed, expected });
  const tag = pass ? `${C.g}PASS${C.x}` : `${C.r}FAIL${C.x}`;
  console.log(`  [${tag}] ${name}`);
  console.log(`         ${C.d}observed:${C.x} ${observed}`);
  if (!pass) console.log(`         ${C.y}expected:${C.x} ${expected}`);
}
const head = (t) => console.log(`\n${C.b}${t}${C.x}\n${'─'.repeat(t.length)}`);

const overlayState = (page) => page.evaluate(() => {
  const o = document.getElementById('page-transition-overlay');
  if (!o) return { exists: false };
  const r = o.getBoundingClientRect();
  return { exists: true, top: Math.round(r.top), covering: r.top < 100 };
});

(async () => {
  console.log(`\n${C.b}Auditing ${TARGET}${C.x}`);
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--use-gl=swiftshader'],
  });

  const pageErrors = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => pageErrors.push(e.message.slice(0, 140)));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_CONNECTION_CLOSED/.test(m.text())) pageErrors.push(m.text().slice(0, 140)); });

  await page.goto(TARGET, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(5500); // let preloader + GSAP settle

  // ── 1. NAVIGATION — the class of bug that shipped a solid-yellow screen ──────
  head('1. Navigation — hash links must NOT trigger the transition overlay');
  for (const label of ['Work', 'Services', 'Skills']) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(900);
    try {
      await page.locator('header').getByText(label, { exact: true }).click({ timeout: 8000 });
      await page.waitForTimeout(1800);
      const o = await overlayState(page);
      const y = await page.evaluate(() => Math.round(window.scrollY));
      check(`"${label}" does not leave overlay covering the page`, !o.covering,
        `overlayTop=${o.top}px covering=${o.covering}, scrollY=${y}`, 'covering=false and scrollY>0');
      check(`"${label}" actually scrolls`, y > 100, `scrollY=${y}`, 'scrollY > 100');
    } catch { check(`"${label}" clickable`, false, 'link not found / not clickable', 'clickable'); }
  }

  head('2. Real route change — overlay must cover, then retract');
  try {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    await page.locator('header').getByText('Playground', { exact: true }).click({ timeout: 8000 });
    await page.waitForTimeout(400);
    const mid = await overlayState(page);
    await page.waitForTimeout(3200);
    const after = await overlayState(page);
    check('wipe plays on route change', mid.covering, `covering=${mid.covering} mid-nav`, 'covering=true');
    check('overlay retracts after landing', !after.covering, `covering=${after.covering} on ${new URL(page.url()).pathname}`, 'covering=false');
    await page.goBack(); await page.waitForTimeout(3200);
    const back = await overlayState(page);
    check('overlay retracts after back button', !back.covering, `covering=${back.covering}`, 'covering=false');
  } catch (e) { check('playground navigation', false, e.message.slice(0, 90), 'navigates cleanly'); }

  // ── 3. IMAGES ────────────────────────────────────────────────────────────────
  head('3. Images — no oversized variants, no broken sources');
  const html = await page.content();
  const oversized = (html.match(/w=3840/g) || []).length;
  check('no w=3840 variants', oversized === 0, `${oversized} occurrences`, '0');
  const imgs = await page.evaluate(() => [...document.querySelectorAll('img')].map((i) => ({
    src: (i.currentSrc || i.src || '').split('/').pop()?.slice(0, 48),
    broken: i.complete && i.naturalWidth === 0,
    renderW: Math.round(i.getBoundingClientRect().width),
    natW: i.naturalWidth,
  })));
  const broken = imgs.filter((i) => i.broken);
  check('no broken images', broken.length === 0, `${broken.length} broken`, '0');
  const bloated = imgs.filter((i) => i.renderW > 0 && i.natW > i.renderW * 3);
  check('no image >3x its rendered size', bloated.length === 0,
    bloated.length ? bloated.map((i) => `${i.src} ${i.natW}px for ${i.renderW}px`).join('; ') : 'none', '0');

  // ── 4. INTERACTIONS ──────────────────────────────────────────────────────────
  head('4. Interactions — magnetic, marquee, cursor, modal');
  const t = (el) => { let n = el; for (let i = 0; i < 3; i++) { if (getComputedStyle(n).transform !== 'none') return getComputedStyle(n).transform; n = n.parentElement; } return 'none'; };
  try {
    const btn = page.locator('header').getByText('Ask My AI').first();
    const box = await btn.boundingBox();
    const before = await btn.evaluate(t);
    await page.mouse.move(box.x + box.width / 2 + 22, box.y + box.height / 2 + 8);
    await page.waitForTimeout(600);
    const after = await btn.evaluate(t);
    check('magnetic responds on header CTA', before !== after, `${before} -> ${after}`, 'transform changes');
  } catch { check('magnetic', false, 'CTA not found', 'measurable'); }

  try { // marquee must be scrolled into view or mouseenter never fires
    await page.evaluate(() => document.querySelector('.w-max')?.closest('section')?.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(1400);
    const MT = () => page.evaluate(() => getComputedStyle(document.querySelector('.w-max')).transform);
    await page.mouse.move(30, 30); await page.waitForTimeout(700);
    const a = await MT(); await page.waitForTimeout(800); const b = await MT();
    check('marquee is running', a !== b, `${a} -> ${b}`, 'transform advances');
    const bx = await page.evaluate(() => { const r = document.querySelector('.w-max').closest('section').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await page.mouse.move(bx.x, bx.y, { steps: 10 }); await page.waitForTimeout(600);
    const h1 = await MT(); await page.waitForTimeout(1100); const h2 = await MT();
    check('marquee pauses on hover', h1 === h2, h1 === h2 ? 'frozen' : `${h1} -> ${h2}`, 'identical transform');
  } catch { check('marquee', false, 'not found', 'measurable'); }

  try {
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(900);
    await page.locator('main').getByText('Ask My AI').first().click({ force: true });
    await page.waitForTimeout(2600);
    const open = await page.evaluate(() => !!document.querySelector('[role="dialog"]'));
    check('Ask My AI modal opens', open, `dialog present=${open}`, 'true');
    await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
    const closed = await page.evaluate(() => !document.querySelector('[role="dialog"]'));
    check('modal closes on Escape', closed, `dialog gone=${closed}`, 'true');
  } catch { check('Ask My AI modal', false, 'could not open', 'opens and closes'); }

  // ── 5. SCROLL PIN ────────────────────────────────────────────────────────────
  head('5. Scroll pin — exactly one, desktop only');
  const pins = await page.evaluate(() => document.querySelectorAll('.pin-spacer').length);
  check('exactly 1 pin on desktop', pins === 1, `${pins} pin-spacers`, '1');

  // ── 6. ROUTES ────────────────────────────────────────────────────────────────
  head('6. Routes');
  for (const r of ['/playground', '/projects/sukisuite', '/projects/barangay-arena', '/projects/betteryield']) {
    const resp = await page.goto(TARGET + r, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1500);
    const over = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    check(`${r} loads and fits`, resp.status() === 200 && !over, `status=${resp.status()} overflowX=${over}`, 'status=200 overflowX=false');
  }

  // ── 7. MOBILE ────────────────────────────────────────────────────────────────
  head('7. Mobile 375x812');
  const m = await browser.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await m.goto(TARGET, { waitUntil: 'networkidle', timeout: 60000 });
  await m.waitForTimeout(4500);
  const mo = await m.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  check('no horizontal scroll', !mo, `scrollWidth=${await m.evaluate(() => document.documentElement.scrollWidth)} innerWidth=375`, 'no overflow');
  const mp = await m.evaluate(() => document.querySelectorAll('.pin-spacer').length);
  check('no scroll pin on mobile', mp === 0, `${mp} pin-spacers`, '0');
  const cursors = await m.evaluate(() => [...document.querySelectorAll('div')].filter((d) => { const s = getComputedStyle(d); return s.position === 'fixed' && s.pointerEvents === 'none' && parseInt(s.width) > 0 && parseInt(s.width) < 70; }).length);
  check('no custom cursor on touch', cursors === 0, `${cursors} cursor elements`, '0');
  try {
    await m.locator('header button').last().click(); await m.waitForTimeout(1200);
    await m.locator('#mobile-menu a').filter({ hasText: 'Services' }).first().click();
    await m.waitForTimeout(2200);
    const gone = await m.evaluate(() => !document.querySelector('#mobile-menu'));
    const ovr = await m.evaluate(() => { const o = document.getElementById('page-transition-overlay'); return o ? o.getBoundingClientRect().top < 100 : false; });
    const lock = await m.evaluate(() => getComputedStyle(document.body).overflow);
    check('mobile menu closes on link click', gone, `menu gone=${gone}`, 'true');
    check('mobile nav leaves no overlay', !ovr, `covering=${ovr}`, 'false');
    check('scroll lock released', lock !== 'hidden', `body overflow=${lock}`, 'not hidden');
  } catch { check('mobile menu', false, 'could not operate', 'opens, navigates, closes'); }

  // ── 8. ACCESSIBILITY + REDUCED MOTION ───────────────────────────────────────
  head('8. Accessibility & reduced motion');
  const rm = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await rm.emulateMedia({ reducedMotion: 'reduce' });
  await rm.goto(TARGET, { waitUntil: 'networkidle', timeout: 60000 });
  await rm.waitForTimeout(4000);
  const rmPins = await rm.evaluate(() => document.querySelectorAll('.pin-spacer').length);
  check('no pin under reduced motion', rmPins === 0, `${rmPins} pin-spacers`, '0');
  const h1vis = await rm.evaluate(() => { const h = document.querySelector('h1'); return h ? getComputedStyle(h).opacity : '0'; });
  check('hero visible under reduced motion', parseFloat(h1vis) > 0.9, `h1 opacity=${h1vis}`, '1');

  await page.goto(TARGET, { waitUntil: 'networkidle' }); await page.waitForTimeout(3000);
  const a11y = await page.evaluate(() => ({
    imgsNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
    btnsNoName: [...document.querySelectorAll('button')].filter((b) => !b.textContent.trim() && !b.getAttribute('aria-label')).length,
    emptySrc: [...document.querySelectorAll('img')].filter((i) => i.getAttribute('src') === '').length,
    skipLink: !!document.querySelector('a[href="#main-content"]'),
    h1Text: document.querySelector('h1')?.textContent || '',
    h1Label: document.querySelector('h1')?.getAttribute('aria-label') || '',
  }));
  check('all images have alt', a11y.imgsNoAlt === 0, `${a11y.imgsNoAlt} missing`, '0');
  check('all buttons have an accessible name', a11y.btnsNoName === 0, `${a11y.btnsNoName} unnamed`, '0');
  check('no empty img src', a11y.emptySrc === 0, `${a11y.emptySrc} empty`, '0');
  check('skip link present', a11y.skipLink, `${a11y.skipLink}`, 'true');
  const spaced = /\s/.test(a11y.h1Text.replace(/\u00a0/g, ' ').trim().slice(0, 30));
  check('h1 has word spacing', spaced, JSON.stringify(a11y.h1Text.slice(0, 46)), 'spaces between words');

  // ── 9. CONTENT HONESTY — project-specific guardrails ────────────────────────
  head('9. Content honesty (no fabricated claims)');
  const body = await page.evaluate(() => document.body.innerText);
  check('no leftover TODO markers', !/TODO\(jhonrey\)/.test(body), /TODO/.test(body) ? 'TODO found' : 'none', 'none');
  check('BetterYield stack not "Pending confirmation"', !/Pending confirmation/i.test(body),
    /Pending confirmation/i.test(body) ? 'placeholder visible' : 'resolved', 'resolved');
  check('Barangay Arena marked preview-on-request', /Preview on request/i.test(body), 'label present', 'label present');
  check('no raw "preview-on-request" slug leaking', !/preview-on-request/.test(body), 'clean', 'clean');

  head('10. Runtime errors');
  check('no page errors', pageErrors.length === 0, pageErrors.length ? pageErrors.join(' | ') : 'none', 'none');

  // ── SUMMARY ─────────────────────────────────────────────────────────────────
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${C.b}${'═'.repeat(58)}${C.x}`);
  console.log(`${C.b}  ${results.length - failed.length}/${results.length} passed${C.x}`);
  if (failed.length) {
    console.log(`\n${C.r}${C.b}  FAILURES${C.x}`);
    failed.forEach((f) => console.log(`    ${C.r}✗${C.x} ${f.name}\n      got: ${f.observed}\n      want: ${f.expected}`));
  } else {
    console.log(`  ${C.g}All checks passed.${C.x}`);
  }
  console.log(`${C.b}${'═'.repeat(58)}${C.x}\n`);

  if (JSON_OUT) {
    writeFileSync(JSON_OUT, JSON.stringify({ target: TARGET, at: new Date().toISOString(), passed: results.length - failed.length, total: results.length, results }, null, 2));
    console.log(`JSON written to ${JSON_OUT}\n`);
  }

  await browser.close();
  process.exit(failed.length ? 1 : 0);
})();
