// Browser smoke test for the built course in ../docs.
//
//   node smoke.js                 every lesson loads without console errors
//   node smoke.js --python        additionally runs the checks of the first Python block in a few lessons
//   H=b3 OUT=shot.png node smoke.js --shot   screenshot of one page (env: H, OUT, SEL, NTH, W, HH, DARK, FULL)
//
// Needs: npm install (installs Playwright) and a Chromium browser (npx playwright install chromium).
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'docs');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.wasm': 'application/wasm', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8' };

function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
      const file = path.join(ROOT, rel);
      if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
      fs.readFile(file, (err, data) => {
        if (err) { res.writeHead(404); res.end(); return; }
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
        res.end(data);
      });
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

async function newPage(browser, errors) {
  const page = await browser.newPage({
    viewport: { width: Number(process.env.W || 1400), height: Number(process.env.HH || 1000) },
    colorScheme: process.env.DARK ? 'dark' : 'light',
  });
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  // fonts are optional; keep the test offline
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  return page;
}

(async () => {
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}/index.html`;
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE || undefined });
  let failed = 0;
  try {
    if (process.argv.includes('--shot')) {
      const errors = [];
      const page = await newPage(browser, errors);
      await page.goto(base + '#' + (process.env.H || 'home'));
      await page.waitForTimeout(1500);
      const out = process.env.OUT || 'shot.png';
      if (process.env.SEL) {
        const loc = page.locator(process.env.SEL).nth(Number(process.env.NTH || 0));
        await loc.scrollIntoViewIfNeeded();
        await loc.screenshot({ path: out });
      } else await page.screenshot({ path: out, fullPage: !!process.env.FULL });
      const real = errors.filter((e) => !/ERR_FAILED|net::/.test(e)); // blocked web fonts are expected
      console.log('saved', out, real.length ? '\n' + real.join('\n') : '');
      failed = real.length;
    } else {
      const errors = [];
      const page = await newPage(browser, errors);
      await page.goto(base);
      await page.waitForTimeout(800);
      const ids = await page.evaluate(() => ['home', ...window.COURSE.order]);
      for (const id of ids) {
        errors.length = 0;
        await page.goto(base + '#' + id);
        await page.waitForTimeout(600);
        const ok = errors.filter((e) => !/ERR_FAILED|net::/.test(e));
        console.log((ok.length ? 'FAIL ' : 'ok   ') + id + (ok.length ? '  ' + ok.join(' | ') : ''));
        failed += ok.length ? 1 : 0;
      }
      if (process.argv.includes('--python')) {
        for (const id of ['a5', 'b1', 'c3']) {
          await page.goto(base + '#' + id);
          await page.waitForTimeout(600);
          await page.locator('.exercise button:has-text("Prüfen")').first().click();
          await page.waitForFunction(() => /Prüfungen/.test((document.querySelector('.exercise') || {}).innerText || ''), null, { timeout: 120000 });
          const line = await page.evaluate(() => document.querySelector('.exercise').innerText.split('\n').find((l) => /Prüfungen/.test(l)));
          console.log('python ' + id + ': ' + line + ' (starter code, so failures are expected)');
        }
      }
    }
  } finally {
    await browser.close();
    srv.close();
  }
  process.exit(failed ? 1 : 0);
})();
