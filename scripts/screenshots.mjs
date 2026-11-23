#!/usr/bin/env node
/**
 * Screenshots of the built site in light and dark at phone and desktop widths.
 *   npm run build && npm run preview   (in another terminal)
 *   node scripts/screenshots.mjs [outDir] [path ...]
 */
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

// Use the project's playwright if installed, else the machine's global one.
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require(`${execSync('npm root -g').toString().trim()}/playwright`); }
const { chromium } = pw;
import { mkdirSync } from 'node:fs';

const [outDir = 'screenshots', ...paths] = process.argv.slice(2);
const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const pages = paths.length ? paths : ['/'];
const sizes = [
  { name: 'mobile-375', width: 375, height: 812, scale: 2 },
  { name: 'desktop-1440', width: 1440, height: 900, scale: 1 },
];
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const theme of ['light', 'dark']) {
  for (const s of sizes) {
    const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: s.scale, colorScheme: theme, reducedMotion: 'reduce', hasTouch: s.width < 800, isMobile: s.width < 800 });
    await ctx.addInitScript((t) => { try { localStorage.setItem('op-theme', t); sessionStorage.setItem('op-intro', '1'); } catch {} }, theme);
    const page = await ctx.newPage();
    for (const p of pages) {
      await page.goto(BASE + p, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      // Scroll through so lazy images load, then return to the top.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState('networkidle');
      const slug = p === '/' ? 'home' : p.replace(/\//g, '');
      await page.screenshot({ path: `${outDir}/${slug}-${s.name}-${theme}-fold.png` });
      await page.screenshot({ path: `${outDir}/${slug}-${s.name}-${theme}-full.png`, fullPage: true });
    }
    await ctx.close();
  }
}
await browser.close();
console.log('saved to', outDir);
