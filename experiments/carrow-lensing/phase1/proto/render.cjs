// node render.cjs <law> <seeds> <out.png> [framesDir] [W] [H]
// Needs Playwright. Set CHROME to a Chromium build that can use the GPU; otherwise it falls back to software rendering.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const EXE = process.env.CHROME || undefined;
(async () => {
  const [law, seeds, out, framesDir, W = 1200, H = 800] = process.argv.slice(2);
  const b = await chromium.launch({ headless: true, executablePath: EXE, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 800, height: 600 } });
  p.on('console', (m) => console.log('[page]', m.text()));
  p.on('pageerror', (e) => console.log('[pageerror]', e.message));
  const url = 'file://' + path.join(__dirname, 'sheet.html') + `?law=${law}&seeds=${seeds}&w=${W}&h=${H}` + (framesDir ? '&frames=1' : '');
  await p.goto(url);
  await p.waitForFunction(() => window.DONE, null, { timeout: 600000, polling: 200 });
  const d = await p.evaluate(() => window.DONE);
  if (d.error) { console.error(d.error); process.exit(1); }
  fs.writeFileSync(out, Buffer.from(d.sheet.split(',')[1], 'base64'));
  if (framesDir) {
    fs.mkdirSync(framesDir, { recursive: true });
    seeds.split(',').forEach((s, i) => fs.writeFileSync(path.join(framesDir, `${law}-${s}.png`), Buffer.from(d.frames[i].split(',')[1], 'base64')));
  }
  console.log(law, 'ms per seed', d.times.join(' '));
  await b.close();
})();
