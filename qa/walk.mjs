// Viewport-by-viewport screenshots of the homepage.
// Usage: node qa/walk.mjs [width=1440] [height] [step=0.9] [prefix]
// Requires `npx vite preview --port 4174`.
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const exe = path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const w = Number(process.argv[2] || 1440);
const h = Number(process.argv[3] || (w < 768 ? 820 : 900));
const step = Number(process.argv[4] || 0.9);
const prefix = process.argv[5] || `w${w}`;
const out = path.join(import.meta.dirname, 'shots');
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3200);
let y = 0;
let i = 0;
for (;;) {
  await page.screenshot({ path: path.join(out, `${prefix}-${String(i).padStart(2, '0')}.png`) });
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  if (y >= max) break;
  y = Math.min(max, y + Math.round(h * step));
  // Scroll in small increments so scrubbed animations track naturally.
  for (let s = 0; s < 6; s++) {
    await page.mouse.wheel(0, Math.round((h * step) / 6));
    await page.waitForTimeout(60);
  }
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(1500);
  i++;
}
console.log(`${i + 1} shots, errors: ${errors.length ? errors.join(' | ') : 'none'}`);
await browser.close();
