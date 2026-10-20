// Interaction checks: mobile menu, anchor navigation, holdings tabs and
// accordion, enterprise rows, keyboard focus in the pinned chronology.
// Requires `npx vite preview --port 4174`.
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';

const exe = path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const browser = await chromium.launch({ executablePath: exe });
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok: !!ok, detail });
const wait = (p, ms) => p.waitForTimeout(ms);

/* ---------------- mobile ---------------- */
{
  const page = await browser.newPage({ viewport: { width: 390, height: 820 }, hasTouch: true });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
  await wait(page, 3300);

  await page.click('.menu-toggle');
  await wait(page, 1500);
  check('menu opens as dialog', await page.isVisible('#mobile-menu'));
  check('focus moves into menu', await page.evaluate(() => document.activeElement?.closest('#mobile-menu') !== null));
  check('page scroll locked', await page.evaluate(() => document.documentElement.style.overflow === 'hidden'));
  const count = await page.evaluate(() => document.querySelectorAll('#mobile-menu a[href], #mobile-menu button').length);
  for (let i = 0; i < count + 1; i++) await page.keyboard.press('Tab');
  check('focus trapped in menu', await page.evaluate(() => document.activeElement?.closest('#mobile-menu') !== null));
  const linkOpacity = await page.evaluate(() => [...document.querySelectorAll('.mobile-menu__link')].map((a) => getComputedStyle(a).opacity));
  check('menu links fully visible', linkOpacity.every((o) => Number(o) >= 0.99), linkOpacity.join(','));
  await page.keyboard.press('Escape');
  await wait(page, 1200);
  check('Escape closes menu', !(await page.isVisible('#mobile-menu')));
  check('focus returns to toggle', await page.evaluate(() => document.activeElement?.classList.contains('menu-toggle')));

  await page.click('.menu-toggle');
  await wait(page, 1400);
  await page.click('.mobile-menu__link[href="#leadership"]');
  await wait(page, 2500);
  const off = await page.evaluate(() => document.getElementById('leadership').getBoundingClientRect().top);
  check('menu link scrolls to section', !(await page.isVisible('#mobile-menu')) && off > -4 && off < 120, `top ${Math.round(off)}`);
  check('scroll unlocked after menu', await page.evaluate(() => document.documentElement.style.overflow === ''));

  // Accordion
  await page.evaluate(() => document.getElementById('holdings').scrollIntoView());
  await wait(page, 800);
  const btn = page.locator('.acc-btn').nth(2);
  await btn.click();
  await wait(page, 1000);
  check('accordion opens', (await btn.getAttribute('aria-expanded')) === 'true' && (await page.isVisible('#acc-timberland')));
  await btn.click();
  await wait(page, 900);
  check('accordion closes', (await btn.getAttribute('aria-expanded')) === 'false' && !(await page.isVisible('#acc-timberland')));
  check('no mobile page errors', errors.length === 0, errors.join(' | '));
  await page.close();
}

/* ---------------- desktop ---------------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
  await wait(page, 3300);

  for (const id of ['heritage', 'holdings', 'enterprise', 'leadership', 'contact']) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await wait(page, 600);
    await page.click(`.site-header a[href="#${id}"]`);
    await wait(page, 2600);
    const top = await page.evaluate((i) => document.getElementById(i).getBoundingClientRect().top, id);
    check(`nav #${id} lands below header`, top > -4 && top < 130, `top ${Math.round(top)}`);
    check(`nav #${id} updates hash`, (await page.evaluate(() => location.hash)) === `#${id}`);
  }
  // Scrolling up brings the hidden header back, as it would for a reader.
  await page.mouse.wheel(0, -400);
  await wait(page, 900);
  check('header returns on scroll up', await page.evaluate(() => !document.querySelector('.site-header').classList.contains('is-hidden')));
  await page.click('.site-header .brand');
  await wait(page, 2400);
  check('brand returns to top', (await page.evaluate(() => window.scrollY)) < 4);

  // Holdings tabs
  await page.evaluate(() => {
    const el = document.querySelector('.holdings__split');
    window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 120);
  });
  await wait(page, 1500);
  await page.click('#tab-oil-gas');
  await wait(page, 1600);
  check('tab selects', (await page.getAttribute('#tab-oil-gas', 'aria-selected')) === 'true');
  check('tab panel visible', await page.evaluate(() => getComputedStyle(document.getElementById('panel-oil-gas')).visibility === 'visible'));
  check('other panels hidden from AT', await page.evaluate(() => document.getElementById('panel-real-estate').hidden));
  check('active image shown', await page.evaluate(() => {
    const img = document.querySelectorAll('.holdings__media img')[3];
    const s = getComputedStyle(img);
    return s.opacity === '1' && (s.clipPath === 'none' || /inset\(0(px|%)?( 0(px|%)?)*\)/.test(s.clipPath));
  }));
  await page.focus('#tab-oil-gas');
  await page.keyboard.press('ArrowDown');
  await wait(page, 400);
  check('arrow key moves tab', (await page.getAttribute('#tab-renewable', 'aria-selected')) === 'true' && (await page.evaluate(() => document.activeElement.id)) === 'tab-renewable');
  await page.hover('#tab-agriculture');
  await wait(page, 600);
  check('hover selects tab', (await page.getAttribute('#tab-agriculture', 'aria-selected')) === 'true');
  const ind = await page.evaluate(() => {
    const i = document.querySelector('.holdings__indicator').getBoundingClientRect();
    const t = document.getElementById('tab-agriculture').getBoundingClientRect();
    return Math.abs(i.top - t.top) + Math.abs(i.height - t.height);
  });
  await wait(page, 900);
  const ind2 = await page.evaluate(() => {
    const i = document.querySelector('.holdings__indicator').getBoundingClientRect();
    const t = document.getElementById('tab-agriculture').getBoundingClientRect();
    return Math.abs(i.top - t.top) + Math.abs(i.height - t.height);
  });
  check('indicator follows active tab', ind2 < 2, `delta ${ind.toFixed(1)} then ${ind2.toFixed(1)}`);

  // Enterprise rows (Flip)
  await page.evaluate(() => document.getElementById('enterprise').scrollIntoView());
  await wait(page, 1500);
  const rowBtn = page.locator('.ent-row__btn').nth(1);
  await rowBtn.click();
  await wait(page, 1800);
  check('enterprise row opens', (await rowBtn.getAttribute('aria-expanded')) === 'true' && (await page.isVisible('#ent-louisiana')));
  check('previous row closes', (await page.locator('.ent-row__btn').nth(0).getAttribute('aria-expanded')) === 'false');
  check('flip settles (no leftover transforms)', await page.evaluate(() => [...document.querySelectorAll('.ent-row')].every((r) => ['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(r).transform))));
  check('opened panel content visible', await page.evaluate(() => [...document.querySelectorAll('#ent-louisiana dd, #ent-louisiana p')].every((e) => getComputedStyle(e).opacity === '1')));

  // Chronology keyboard focus
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(page, 800);
  await page.evaluate(() => document.querySelector('.passage__index button').scrollIntoView());
  await wait(page, 1200);
  await page.evaluate(() => document.querySelector('#ch-ellen-and-ap').closest('.chapter').querySelector('a').focus());
  await wait(page, 1500);
  const chLeft = await page.evaluate(() => document.querySelector('#ch-ellen-and-ap').closest('.chapter').getBoundingClientRect().left);
  check('focused chapter scrolls into view', chLeft > -2 && chLeft < 400, `left ${Math.round(chLeft)}`);
  await page.click('.passage__index button:nth-child(1)', { trial: true }).catch(() => {});
  await page.locator('.passage__index button').nth(6).click();
  await wait(page, 2400);
  const last = await page.evaluate(() => ({
    cur: document.querySelector('.passage__index button[aria-current="true"]')?.textContent,
    left: document.querySelector('#ch-anton').closest('.chapter').getBoundingClientRect().left,
  }));
  check('index jumps to last chapter', last.cur === '2021' && last.left < 720, JSON.stringify(last));

  check('no desktop page errors', errors.length === 0, errors.join(' | '));
  await page.close();
}

await browser.close();
let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? '✓' : '✗'} ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
}
console.log(`\n${results.length} checks, ${failed} failed`);
