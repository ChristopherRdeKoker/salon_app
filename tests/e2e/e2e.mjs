import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PLAYWRIGHT = process.env.PLAYWRIGHT_MODULE ?? 'playwright';
const { chromium } = await import(path.isAbsolute(PLAYWRIGHT) ? pathToFileURL(PLAYWRIGHT).href : PLAYWRIGHT);
const DIST = fileURLToPath(new URL('../../dist', import.meta.url));
const SHOTS = process.env.SHOTS_DIR ?? fileURLToPath(new URL('out', import.meta.url));
const PREFIX = '/apps/salon/';
const REQUIRED_CSP = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests";
fs.mkdirSync(SHOTS, { recursive: true });
if (!fs.existsSync(path.join(DIST, 'index.html'))) { console.error('FAIL: dist/index.html missing, run npm run build first'); process.exit(2); }

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (!url.pathname.startsWith(PREFIX)) { res.writeHead(404).end(); return; }
  const rel = url.pathname.slice(PREFIX.length) || 'index.html';
  const file = path.join(DIST, path.normalize(rel));
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' }).end(fs.readFileSync(file));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const BASE = `http://127.0.0.1:${server.address().port}${PREFIX}`;
console.log('serving', DIST, 'at', BASE);

const problems = [];
let checks = 0;
function ok(cond, msg) { checks++; if (!cond) { problems.push('FAIL: ' + msg); console.log('  FAIL', msg); } else console.log('  ok  ', msg); }
const norm = (s) => (s ?? '').replace(/[  ]/g, ' ').replace(/\s+/g, ' ').trim();

const browser = await chromium.launch();
async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, ...opts });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(`console.${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => problems.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
  page.on('response', (r) => { if (r.status() >= 400) problems.push(`http ${r.status()}: ${r.url()}`); });
  await page.addInitScript(() => { document.addEventListener('securitypolicyviolation', (e) => console.error(`CSP-VIOLATION ${e.violatedDirective} ${e.blockedURI}`)); });
  return { ctx, page };
}
const text = async (locator) => norm(await locator.first().textContent());

console.log('1. CSP meta and home');
const html = await (await fetch(BASE)).text();
const cspMatch = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]*)"/);
ok(!!cspMatch && cspMatch[1] === REQUIRED_CSP, 'built page carries the exact required CSP meta');
ok(!/<script(?![^>]*\bsrc=)[^>]*>/.test(html) && !/<style/.test(html) && !/\sstyle=/.test(html), 'no inline script or style in built HTML');
const { ctx, page } = await newPage();
await page.goto(BASE);
await page.waitForSelector('.hero');
ok(await page.locator('.menu-row').count() === 19, 'price list shows 19 treatments');
const builtText = fs.readdirSync(DIST, { recursive: true }).filter((f) => /\.(html|js|css|svg)$/.test(f)).map((f) => fs.readFileSync(path.join(DIST, f), 'utf8')).join('\n');
ok(await page.title() === 'Honeyvale beauty studio (demo)' && !/honeycomb|HNY-/i.test(builtText), 'page title names Honeyvale and the old name is nowhere in the build');
ok(await text(page.locator('.wordmark-name')) === 'Honeyvale' && await text(page.locator('.footer-name')) === 'Honeyvale', 'header and footer name Honeyvale');
ok((await text(page.locator('.site-footer'))).includes('A fictional beauty studio'), 'footer says the studio is fictional');
await page.waitForTimeout(1300);
await page.screenshot({ path: `${SHOTS}/phone-390-light.png`, fullPage: true });

console.log('2. treatment detail');
await page.getByRole('link', { name: /Gel overlay, hands/ }).click();
ok(await text(page.getByTestId('service-price')) === 'R 380', 'gel overlay costs R 380');
await page.getByTestId('book-service').click();
ok(await page.locator('input[value="gel-hands"]').isChecked(), 'booking opens with gel overlay ticked');

console.log('3. choose treatments and therapist');
await page.getByLabel(/Brow wax/).check();
ok((await text(page.locator('.picker-bar p'))).includes('2 chosen, 1 h 15 min, R 475'), 'running total shows 2 chosen, 1 h 15 min, R 475');
await page.getByRole('button', { name: 'Choose a therapist' }).click();
ok(await page.getByTestId('stylist-naledi').isDisabled(), 'Naledi is disabled (does not wax)');
ok((await text(page.getByTestId('stylist-zara'))).includes("Doesn't do nails"), 'Zara says she does not do nails');
await page.getByTestId('stylist-ines').click();

console.log('4. choose a day and time');
const firstDay = page.locator('[data-testid=day]:not([disabled])').first();
const date = await firstDay.getAttribute('data-date');
await firstDay.click();
const firstSlot = page.getByTestId('slot').first();
const start = await firstSlot.getAttribute('data-start');
const slotLabel = await text(firstSlot);
ok(!!date && !!start, `picked ${date} at ${slotLabel}`);
await page.screenshot({ path: `${SHOTS}/phone-390-light-time.png`, fullPage: true });
await firstSlot.click();
ok((await text(page.getByTestId('summary-time'))).includes(slotLabel), 'summary shows the chosen time');

console.log('5. contact details');
await page.fill('#name', 'Demo Person');
await page.fill('#phone', '12345');
await page.fill('#email', 'demo@example.com');
await page.check('#agree');
await page.getByRole('button', { name: 'Confirm appointment' }).click();
ok((await text(page.locator('#err-phone'))).includes('South African number'), 'bad phone number is refused with a clear message');
await page.fill('#phone', '082 000 0000');
await page.getByRole('button', { name: 'Confirm appointment' }).click();

console.log('6. confirmation');
await page.waitForSelector('[data-testid=appointment-ref]');
ok(await text(page.getByTestId('appointment-heading')) === "You're booked", 'confirmation heading');
const ref = await text(page.getByTestId('appointment-ref'));
ok(/^HVL-[A-Z2-9]{3}-[A-Z2-9]{3}$/.test(ref), `reference ${ref} has the HVL format`);
ok(await text(page.getByTestId('price-total')) === 'R 475,00', 'total R 475,00');
ok(await text(page.getByTestId('price-vat')) === 'R 61,96', 'VAT R 61,96 (15% inside R 475)');
ok((await text(page.getByTestId('appointment-when'))).includes(slotLabel), 'confirmation shows the time');
await page.screenshot({ path: `${SHOTS}/phone-390-light-confirmation.png`, fullPage: true });

console.log('7. no double booking');
const draftUrl = `${BASE}#/book?services=gel-hands,brow-wax&stylist=ines&date=${date}`;
await page.goto(draftUrl);
await page.waitForSelector('[data-testid=day]');
ok(await page.locator(`[data-testid=slot][data-start="${start}"]`).count() === 0, `slot ${slotLabel} on ${date} is no longer offered`);
await page.goto(`${draftUrl}&time=${start}`);
ok(await page.getByTestId('time-taken').count() === 1, 'forcing the taken time by URL shows "no longer free"');

console.log('8. my appointments and cancel');
await page.getByRole('link', { name: /My appointments/ }).click();
await page.waitForSelector('[data-testid=appointment-row]');
ok(await page.getByTestId('appointment-row').count() === 1, 'one appointment listed');
await page.getByTestId('appointment-row').first().click();
await page.getByRole('button', { name: 'Cancel appointment' }).click();
await page.getByRole('button', { name: 'Yes, cancel it' }).click();
ok(await text(page.getByTestId('appointment-status')) === 'Cancelled', 'status shows Cancelled');
await page.goto(draftUrl);
await page.waitForSelector('[data-testid=day]');
ok(await page.locator(`[data-testid=slot][data-start="${start}"]`).count() === 1, 'cancelled slot is offered again');

console.log('9. reload persists and corrupt storage recovers');
await page.goto(`${BASE}#/appointments`);
await page.reload();
ok(norm(await page.getByTestId('appointment-row').first().textContent()).includes('Cancelled'), 'cancelled appointment persisted over reload');
await page.evaluate(() => localStorage.setItem('honeyvale.appointments.v1', '[{"ref":'));
await page.reload();
await page.waitForSelector('[data-testid=notice]');
ok((await text(page.getByTestId('notice'))).includes('unreadable'), 'corrupt storage shows a notice');
ok(await page.evaluate(() => localStorage.getItem('honeyvale.appointments.v1.corrupt')) === '[{"ref":', 'corrupt data kept as a backup');
await ctx.close();

console.log('10. keyboard reachability');
{
  const { ctx: c, page: p } = await newPage();
  await p.goto(BASE);
  await p.waitForSelector('.hero');
  await p.keyboard.press('Tab');
  ok(await p.evaluate(() => document.activeElement?.className) === 'skip-link', 'first Tab lands on the skip link');
  await c.close();
}

console.log('11. screenshots');
for (const [name, opts, full] of [['phone-390-dark', { colorScheme: 'dark' }, true], ['desktop-1440-light', { viewport: { width: 1440, height: 900 } }, false], ['desktop-1440-dark', { viewport: { width: 1440, height: 900 }, colorScheme: 'dark' }, false]]) {
  const { ctx: c, page: p } = await newPage(opts);
  await p.goto(BASE);
  await p.waitForSelector('.hero');
  await p.waitForTimeout(1300);
  await p.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: full });
  if (!full) await p.screenshot({ path: `${SHOTS}/${name}-full.png`, fullPage: true });
  await p.goto(`${BASE}#/book?services=hydrating-facial,brow-lamination&stylist=zara`);
  await p.waitForSelector('[data-testid=day]');
  await p.locator('[data-testid=day]:not([disabled])').first().click();
  await p.screenshot({ path: `${SHOTS}/${name}-booking.png`, fullPage: true });
  await c.close();
}

await browser.close();
server.close();
const failures = problems.filter((p) => p.startsWith('FAIL'));
const errors = problems.filter((p) => !p.startsWith('FAIL'));
console.log(`\nchecks: ${checks}, failed: ${failures.length}, console/CSP/network problems: ${errors.length}`);
errors.forEach((e) => console.log('  ' + e));
console.log(`screenshots in ${SHOTS}: ${fs.readdirSync(SHOTS).filter((f) => f.endsWith('.png')).length} files`);
process.exit(problems.length ? 1 : 0);
