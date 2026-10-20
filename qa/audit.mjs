// Layout and visibility audit of the homepage across viewport widths.
// Usage: node qa/audit.mjs [widths=360,390,...] [height] [reduced]
// Requires `npx vite preview --port 4174`.
//
// Checks: horizontal overflow, clipped text, text left invisible by an
// animation, reveals stuck mid-flight, header covering the h1, the design
// credit, console errors, em or en dashes in visible copy, and (in the
// pinned horizontal chronology) that every chapter fits the viewport.
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const exe = path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const WIDTHS = (process.argv[2] || '360,375,390,414,430,600,768,900,1024,1180,1280,1366,1440,1680,1920').split(',').map(Number);
const FIXED_H = process.argv[3] ? Number(process.argv[3]) : null;
const REDUCED = process.argv[4] === 'reduced';

function inspect() {
  const vw = document.documentElement.clientWidth;
  const out = { scrollWidth: document.documentElement.scrollWidth, vw, overflow: [], clipped: [], invisible: [], stuck: [], dashes: [], credit: null };
  const ignore = (el) => el.closest('[aria-hidden="true"], .visually-hidden, #mobile-menu, .skip-link, noscript, svg, .passage.is-horizontal .passage__viewport, details:not([open]) > :not(summary)');
  const all = [...document.body.querySelectorAll('*')];

  const clipsX = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (/(hidden|clip)/.test(s.overflowX) || s.position === 'fixed') return true;
    }
    return false;
  };
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (!r.width || ignore(el)) continue;
    if ((r.right > vw + 1 || r.left < -1) && !clipsX(el) && getComputedStyle(el).position !== 'fixed') {
      out.overflow.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} [${Math.round(r.left)},${Math.round(r.right)}]`);
    }
  }
  out.overflow = out.overflow.slice(0, 8);

  const textEls = all.filter((el) => !ignore(el) && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1));
  for (const el of textEls) {
    if (getComputedStyle(el).display === 'none' || el.closest('[hidden]')) continue;
    // Measure only the element's own text, not nested (e.g. visually hidden) children.
    let tr = null;
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (!r.width) continue;
      tr = tr ? { top: Math.min(tr.top, r.top), bottom: Math.max(tr.bottom, r.bottom), left: Math.min(tr.left, r.left), right: Math.max(tr.right, r.right) } : { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
    }
    if (!tr) continue;
    if (el.scrollWidth > el.clientWidth + 2 && /(hidden|clip|auto|scroll)/.test(getComputedStyle(el).overflowX)) {
      out.clipped.push(`self-overflow: ${el.tagName} "${el.textContent.trim().slice(0, 40)}"`);
      continue;
    }
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (/(hidden|clip)/.test(s.overflowX + s.overflowY)) {
        const pr = p.getBoundingClientRect();
        if (tr.top < pr.top - 1 || tr.bottom > pr.bottom + 1 || tr.left < pr.left - 1 || tr.right > pr.right + 1) {
          out.clipped.push(`${el.tagName} "${el.textContent.trim().slice(0, 40)}" in ${p.tagName}.${String(p.className).slice(0, 40)}`);
        }
        break;
      }
    }
  }
  out.clipped = out.clipped.slice(0, 8);

  for (const el of textEls) {
    if (el.closest('[hidden]')) continue;
    let hidden = '';
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (s.display === 'none') {
        hidden = 'none';
        break;
      }
      if (s.visibility === 'hidden') hidden = 'visibility';
      else if (parseFloat(s.opacity) < 0.98) hidden = `opacity ${s.opacity}`;
      if (hidden) break;
    }
    if (hidden && hidden !== 'none') out.invisible.push(`${el.tagName} "${el.textContent.trim().slice(0, 40)}" (${hidden})`);
  }
  out.invisible = out.invisible.slice(0, 8);

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    const s = getComputedStyle(el);
    if (s.transform !== 'none' && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(s.transform) && el.dataset.reveal !== 'line') out.stuck.push(`${el.tagName} ${el.dataset.reveal} ${s.transform}`);
    if (s.clipPath && s.clipPath !== 'none' && !/inset\(0(px|%)?( 0(px|%)?)*\)/.test(s.clipPath)) out.stuck.push(`${el.tagName} clip ${s.clipPath}`);
  });
  document.querySelectorAll('.split-word').forEach((w) => {
    if (parseFloat(getComputedStyle(w).opacity) < 0.98) out.stuck.push(`split word "${w.textContent}" opacity ${getComputedStyle(w).opacity}`);
  });

  // Em or en dashes in visible copy (code and official names excepted: none expected).
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode()); ) {
    if (/[–—]/.test(n.textContent) && !n.parentElement.closest('script, style, noscript')) out.dashes.push(n.textContent.trim().slice(0, 60));
  }

  const credit = [...document.querySelectorAll('a')].find((a) => a.textContent.trim() === 'Designed by CoreConcepts Design');
  if (credit) {
    const r = credit.getBoundingClientRect();
    out.credit = { href: credit.href, target: credit.target, rel: credit.rel, w: r.width, visible: r.width > 0 && r.right <= vw + 1 };
  }
  return out;
}

const browser = await chromium.launch({ executablePath: exe });
const report = [];

async function run(w) {
  const h = FIXED_H ?? (w < 768 ? 820 : w < 1280 ? 860 : 900);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: REDUCED ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  const res = { w, h, errors };
  try {
    await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3400);
    res.headerOverlap = await page.evaluate(() => {
      const h1 = document.querySelector('main h1');
      const hd = document.querySelector('.site-header');
      return h1.getBoundingClientRect().top - hd.getBoundingClientRect().bottom;
    });
    res.heroVisible = await page.evaluate(() => {
      const h1 = document.querySelector('main h1').getBoundingClientRect();
      return h1.bottom <= innerHeight && h1.right <= document.documentElement.clientWidth;
    });

    // Pinned chronology: visit each chapter and confirm it fits.
    res.chapters = await page.evaluate(async () => {
      const sec = document.querySelector('.passage');
      if (!sec.classList.contains('is-horizontal')) return 'vertical';
      const problems = [];
      const btns = [...sec.querySelectorAll('.passage__index button')];
      for (let i = 0; i < btns.length; i++) {
        btns[i].click();
        await new Promise((r) => setTimeout(r, 2200));
        const ch = sec.querySelectorAll('.chapter')[i];
        const cr = ch.getBoundingClientRect();
        if (cr.left < -2 || cr.left > innerWidth * 0.5) problems.push(`ch${i} not brought into view (left ${Math.round(cr.left)})`);
        const cur = sec.querySelector('.passage__index button[aria-current="true"]');
        if (cur !== btns[i]) problems.push(`ch${i} index shows ${cur?.textContent}`);
        ch.querySelectorAll('p, h3, li, figcaption, .chapter__year, .label, .chapter__frame').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (!r.height) return;
          if (r.bottom > Math.min(innerHeight, cr.bottom) + 1 || r.top < cr.top - 1 || r.right > cr.right + 1) {
            problems.push(`ch${i} ${el.tagName} "${(el.textContent || el.className).trim().slice(0, 30)}" exceeds chapter (${Math.round(r.top)}..${Math.round(r.bottom)} of ${Math.round(cr.top)}..${Math.round(Math.min(innerHeight, cr.bottom))})`);
          }
          if (el.tagName !== 'IMG' && parseFloat(getComputedStyle(el).opacity) < 0.98 && !el.closest('.chapter__meta')) problems.push(`ch${i} ${el.tagName} faded`);
        });
      }
      return problems;
    });

    let y = 0;
    for (let i = 0; i < 200; i++) {
      const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      if (y >= max) break;
      y = Math.min(max, y + 420);
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(2800);
    if (process.env.INJECT) {
      // Self-test: plant one fault of each kind; every detector must fire.
      await page.evaluate(() => {
        const sec = document.querySelector('#holdings .wrap');
        sec.insertAdjacentHTML('beforeend', '<div style="width:140vw;height:4px">wide</div><div style="height:20px;overflow:hidden"><p style="font-size:40px">Clipped headline text</p></div><p style="opacity:0">Ghost copy here</p><p>An em dash — here</p>');
        const credit = [...document.querySelectorAll('a')].find((a) => a.textContent.trim() === 'Designed by CoreConcepts Design');
        credit.removeAttribute('target');
      });
    }
    Object.assign(res, await page.evaluate(inspect));
  } catch (e) {
    errors.push(String(e));
  }
  report.push(res);
  await ctx.close();
}

const CONC = 3;
for (let i = 0; i < WIDTHS.length; i += CONC) await Promise.all(WIDTHS.slice(i, i + CONC).map(run));
await browser.close();

let problems = 0;
for (const r of report.sort((a, b) => a.w - b.w)) {
  const issues = [];
  if (r.errors?.length) issues.push('ERRORS ' + r.errors.join(' | '));
  if (r.scrollWidth > r.vw + 1) issues.push(`OVERFLOW scrollWidth ${r.scrollWidth} > ${r.vw}`);
  if (r.overflow?.length) issues.push('overflowing: ' + r.overflow.join(' ; '));
  if (r.clipped?.length) issues.push('CLIPPED: ' + r.clipped.join(' ; '));
  if (r.invisible?.length) issues.push('INVISIBLE: ' + r.invisible.join(' ; '));
  if (r.stuck?.length) issues.push('STUCK: ' + r.stuck.slice(0, 4).join(' ; '));
  if (r.dashes?.length) issues.push('DASHES: ' + r.dashes.slice(0, 4).join(' ; '));
  if (Array.isArray(r.chapters) && r.chapters.length) issues.push('CHRONOLOGY: ' + r.chapters.slice(0, 6).join(' ; '));
  if (r.headerOverlap < 0) issues.push(`HEADER covers h1 by ${-r.headerOverlap}px`);
  if (r.heroVisible === false) issues.push('HERO h1 not fully visible in first viewport');
  if (!r.credit || r.credit.target !== '_blank' || !/noopener/.test(r.credit.rel) || !/noreferrer/.test(r.credit.rel) || !r.credit.visible || !/coreconcepts\.design/.test(r.credit.href)) issues.push('CREDIT missing or wrong');
  const mode = Array.isArray(r.chapters) ? 'horizontal' : r.chapters;
  if (issues.length) {
    problems++;
    console.log(`\n✗ ${r.w}x${r.h} (${mode})\n  ` + issues.join('\n  '));
  } else console.log(`✓ ${r.w}x${r.h} (${mode})`);
}
console.log(`\n${report.length} widths${REDUCED ? ' (reduced motion)' : ''}, ${problems} with issues`);
fs.writeFileSync(path.join(import.meta.dirname, 'audit-report.json'), JSON.stringify(report, null, 2));
