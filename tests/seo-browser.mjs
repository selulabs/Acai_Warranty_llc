// Run against a configured test build; uses local headless Chrome on port 9222.
// Google tags and Supabase submissions are intercepted. No real lead/email sent.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

const root = resolve('dist');
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
const security = config.headers[0].headers;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  let file = resolve(root, `.${path === '/' ? '/index.html' : extname(path) ? path : `${path}.html`}`);
  if (!file.startsWith(root + '/')) { res.writeHead(403).end(); return; }
  let body;
  try { body = await readFile(file); } catch { file = resolve(root, '404.html'); body = await readFile(file); res.statusCode = 404; }
  for (const { key, value } of security) res.setHeader(key, value);
  res.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream');
  res.end(body);
});
await new Promise((resolve) => server.listen(4175, '127.0.0.1', resolve));
const tabs = await (await fetch('http://127.0.0.1:9222/json/list')).json();
const socket = new WebSocket(tabs.find((tab) => tab.type === 'page').webSocketDebuggerUrl);
await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
const errors = [];
let googleRequests = 0;
let submissions = 0;
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const current = ++id;
    const timer = setTimeout(() => { pending.delete(current); reject(new Error(`CDP timeout: ${method}`)); }, 20000);
    pending.set(current, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: current, method, params }));
  });
}
socket.addEventListener('message', async ({ data }) => {
  const message = JSON.parse(data);
  if (pending.has(message.id)) {
    const item = pending.get(message.id); pending.delete(message.id); clearTimeout(item.timer);
    message.error ? item.reject(message.error) : item.resolve(message.result);
  }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
  if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
    errors.push(message.params.args.map((arg) => arg.value ?? arg.description).join(' '));
  }
  if (message.method === 'Fetch.requestPaused') {
    const { requestId, request } = message.params;
    const google = request.url.includes('googletagmanager.com') || request.url.includes('google-analytics.com');
    const backend = request.url.includes('seo-test.supabase.co');
    if (google) googleRequests++;
    if (backend && request.method === 'POST') submissions++;
    await send('Fetch.fulfillRequest', { requestId, responseCode: 200,
      responseHeaders: [{ name: 'Content-Type', value: google ? 'text/javascript' : 'application/json' },
        { name: 'Access-Control-Allow-Origin', value: 'http://127.0.0.1:4175' },
        { name: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
        { name: 'Access-Control-Allow-Headers', value: 'authorization, apikey, x-client-info, content-type' }],
      body: Buffer.from(google ? '/* mocked analytics tag */' : '{"success":true}').toString('base64') });
  }
});
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function waitFor(expression) {
  for (let n = 0; n < 100; n++) {
    if (await evaluate(`Boolean(${expression})`)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Browser condition not reached: ${expression}`);
}
try {
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Fetch.enable', { patterns: ['*://*.googletagmanager.com/*', '*://*.google-analytics.com/*', '*://seo-test.supabase.co/*'].map((urlPattern) => ({ urlPattern })) });
  const runKey = `seo-test-${Date.now()}`;
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `if (!sessionStorage.getItem(${JSON.stringify(runKey)})) { localStorage.clear(); sessionStorage.setItem(${JSON.stringify(runKey)}, 'yes'); }` });
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Page.navigate', { url: 'http://127.0.0.1:4175/contact?service=auto&plan=gold&email=never-send-this' });
  await waitFor(`document.querySelector('input[name="serviceType"][value="auto"]')?.checked && document.body.innerText.includes('Selected plan: Gold') && document.querySelector('section[aria-label="Analytics cookie preferences"]')`);
  assert.equal(googleRequests, 0, 'No Google request before consent');
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Reject analytics').click()`);
  assert.equal(googleRequests, 0, 'No Google request after rejection');
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Privacy preferences').click()`);
  await waitFor(`!!Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Accept analytics')`);
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Accept analytics').click()`);
  await waitFor(`!!window.dataLayer?.some(e => e[0] === 'event' && e[1] === 'page_view')`);
  assert.equal((await evaluate(`window.dataLayer.filter(e => e[0] === 'event' && e[1] === 'page_view')`)).length, 1);
  assert.ok(googleRequests >= 1);
  await evaluate(`(() => {
    const input = (name, value) => { const el = document.getElementById('quote-' + name); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, value); el.dispatchEvent(new Event('input', {bubbles:true})); };
    input('fullName', 'Test Person'); input('email', 'person@example.test'); input('phone', '2025550147');
    input('vehicleMake', 'Test'); input('vehicleModel', 'Car'); input('vehicleYear', '2020');
    document.getElementById('quote-consentToContact').click();
  })()`);
  await evaluate(`document.querySelector('form').requestSubmit()`);
  await waitFor(`document.body.innerText.includes('Thank you for your quote request')`);
  assert.equal(submissions, 1);
  const events = await evaluate(`window.dataLayer.filter(e => e[0] === 'event')`);
  assert.equal(events.filter((entry) => entry[1] === 'generate_lead').length, 1);
  assert.doesNotMatch(JSON.stringify(events), /never-send-this|person@example|Test Person|2025550147|\?service/);
  await evaluate(`document.querySelector('a[href^="tel:"]').click()`);
  assert.ok((await evaluate(`window.dataLayer.filter(e => e[1] === 'contact_click')`)).length >= 1);
  assert.equal(await evaluate(`document.querySelectorAll('link[rel="canonical"]').length`), 1);
  assert.equal(await evaluate(`document.querySelector('link[rel="canonical"]').href`), 'https://acaiwarranty.com/contact');
  await evaluate(`document.cookie = '_ga=browser-test; Path=/'`);
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Privacy preferences').click()`);
  await waitFor(`!!Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Reject analytics')`);
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Reject analytics').click()`);
  await waitFor(`document.readyState === 'complete' && !document.getElementById('google-analytics') && document.querySelector('form')`);
  assert.equal(await evaluate(`document.cookie.includes('_ga=')`), false);
  assert.equal(await evaluate(`document.documentElement.scrollWidth > window.innerWidth`), false, 'Mobile horizontal overflow');
  const notFound = await fetch('http://127.0.0.1:4175/not-a-real-page');
  assert.equal(notFound.status, 404);
  await send('Page.navigate', { url: 'http://127.0.0.1:4175/not-a-real-page' });
  await waitFor(`document.querySelector('meta[name="robots"]')?.content.includes('noindex') && document.body.innerText.includes('This page could not be found')`);
  assert.equal(await evaluate(`document.querySelectorAll('link[rel="canonical"]').length`), 0);
  await send('Page.navigate', { url: 'http://127.0.0.1:4175/' });
  await waitFor(`!!document.querySelector('source[media="(max-width: 767px)"]') && document.title.startsWith('ACAI Warranty LLC')`);
  await waitFor(`document.readyState === 'complete'`);
  assert.ok((await evaluate(`document.querySelector('source[media="(max-width: 767px)"]').srcset`)).includes('images.pexels.com/photos/'));
  assert.equal(await evaluate(`document.documentElement.scrollWidth > innerWidth`), false);
  assert.deepEqual(errors, [], 'Hydration/runtime errors');
  console.log('Browser checks passed: hydration, mobile layout, preselection, consent/rejection/withdrawal, saved-lead event, PII exclusion, canonical updates, and 404 response.');
} finally {
  socket.close();
  server.closeAllConnections();
  server.close();
}
