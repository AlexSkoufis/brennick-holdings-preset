// Collects every link on the page; checks anchors resolve and external URLs respond.
// Requires `npx vite preview --port 4174`.
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';

const exe = path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
const links = await page.evaluate(() =>
  [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.getAttribute('href'), target: a.target, rel: a.rel, text: a.textContent.trim().slice(0, 40) })),
);
await browser.close();

let bad = 0;
const anchors = [...new Set(links.filter((l) => l.href.startsWith('#')).map((l) => l.href))];
const page2 = await (await chromium.launch({ executablePath: exe })).newPage();
await page2.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
for (const a of anchors) {
  const ok = await page2.evaluate((id) => !!document.getElementById(id), a.slice(1));
  if (!ok) bad++;
  console.log(`${ok ? '✓' : '✗'} anchor ${a}`);
}
await page2.context().browser().close();

for (const l of links.filter((l) => /^https?:/.test(l.href))) {
  if (l.target !== '_blank' || !/noopener/.test(l.rel)) {
    bad++;
    console.log(`✗ ${l.href} missing target/rel`);
  }
}
const ext = [...new Set(links.filter((l) => /^https?:/.test(l.href)).map((l) => l.href))];
for (const url of ext) {
  let status = 'ERR';
  try {
    const r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36' }, signal: AbortSignal.timeout(20000) });
    status = r.status;
  } catch (e) {
    status = 'ERR ' + e.cause?.code;
  }
  const ok = typeof status === 'number' && status < 400;
  if (!ok) bad++;
  console.log(`${ok ? '✓' : '?'} ${status} ${url}`);
}
const other = links.filter((l) => /^(mailto|tel):/.test(l.href)).map((l) => l.href);
console.log([...new Set(other)].map((h) => '· ' + h).join('\n'));
console.log(`\n${anchors.length} anchors, ${ext.length} external URLs, ${bad} need attention`);
