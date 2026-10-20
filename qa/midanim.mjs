// Frames of the opening sequence while it plays, stitched into one sheet.
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import os from 'node:os'; import path from 'node:path';
const exe = path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const w = Number(process.argv[2] || 1440), h = w < 768 ? 844 : 900;
const b = await chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: w, height: h } });
await p.goto('http://localhost:4174/', { waitUntil: 'domcontentloaded' });
const frames = [];
for (let i = 0; i < 8; i++) { await p.waitForTimeout(i === 0 ? 250 : 380); frames.push(await p.screenshot()); }
await b.close();
const tw = w < 768 ? 260 : 480, th = Math.round((tw * h) / w);
const comps = await Promise.all(frames.map(async (f, i) => ({ input: await sharp(f).resize(tw, th).toBuffer(), left: (i % 4) * (tw + 6), top: Math.floor(i / 4) * (th + 6) })));
await sharp({ create: { width: 4 * (tw + 6), height: 2 * (th + 6), channels: 3, background: '#777' } }).composite(comps).png().toFile(`qa/shots/mid-${w}.png`);
console.log('ok');
