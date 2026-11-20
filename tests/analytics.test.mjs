import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { build } from 'esbuild';

const bundle = await build({ entryPoints: ['src/lib/analytics.ts'], bundle: true, write: false,
  format: 'iife', globalName: 'analytics', platform: 'browser', tsconfig: 'tsconfig.app.json',
  define: { 'import.meta.env.VITE_GA4_MEASUREMENT_ID': '"G-TESTANALYTICS"' } });

function setup() {
  const scripts = [];
  const storage = new Map();
  let reloads = 0;
  const location = { hostname: 'acaiwarranty.com', pathname: '/contact', reload: () => reloads++ };
  const window = { dispatchEvent() {} };
  const document = { cookie: '', referrer: 'https://www.google.com/search?q=private-test-query',
    createElement: () => ({ remove() {} }),
    getElementById: (id) => scripts.find((script) => script.id === id),
    head: { appendChild: (script) => scripts.push(script) } };
  const context = vm.createContext({ window, document, location, URL, Event,
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } });
  vm.runInContext(bundle.outputFiles[0].text, context);
  return { api: context.analytics, window, scripts, location, storage, get reloads() { return reloads; } };
}

test('Google command protocol: accepted consent/config/events use Arguments objects', () => {
  const state = setup();
  state.api.applyAnalyticsConsent('granted');
  const commands = state.window.dataLayer;
  // Google processes gtag commands through the Arguments protocol shown in its
  // installation snippet. A plain array here is not a valid gtag command.
  for (const command of commands) {
    assert.equal(Object.prototype.toString.call(command), '[object Arguments]');
    assert.equal(Array.isArray(command), false);
  }
  assert.deepEqual(Array.from(commands, (command) => command[0]), ['consent', 'consent', 'js', 'config', 'event']);
  assert.equal(commands[0][2].analytics_storage, 'denied');
  assert.equal(commands[1][2].analytics_storage, 'granted');
  assert.equal(commands[3][1], 'G-TESTANALYTICS');
  assert.equal(commands[4][1], 'page_view');
  assert.equal(state.scripts.length, 1);
  assert.match(state.scripts[0].src, /gtag\/js\?id=G-TESTANALYTICS$/);
});

test('no script or analytics events are created before consent or after rejection', () => {
  const state = setup();
  state.api.trackPageView('/contact');
  state.api.trackQuoteLead('private-request-id', 'auto', 'gold');
  assert.equal(state.scripts.length, 0);
  assert.equal(state.window.dataLayer, undefined);
  state.api.applyAnalyticsConsent('denied');
  state.api.trackContactClick('email');
  assert.equal(state.scripts.length, 0);
  assert.equal(state.window.dataLayer.length, 0);
});

test('page/lead/click commands are deduplicated and exclude IDs and query strings', () => {
  const state = setup();
  state.api.applyAnalyticsConsent('granted');
  state.api.trackPageView('/contact');
  state.api.trackQuoteLead('private-request-id', 'auto', 'gold');
  state.api.trackQuoteLead('private-request-id', 'auto', 'gold');
  state.api.trackContactClick('phone');
  const events = state.window.dataLayer.filter((command) => command[0] === 'event');
  assert.deepEqual(Array.from(events, (command) => command[1]), ['page_view', 'generate_lead', 'contact_click']);
  assert.equal(events[1][2].service_type, 'auto');
  assert.equal(events[1][2].selected_plan, 'gold');
  assert.equal(events[2][2].contact_method, 'phone');
  assert.doesNotMatch(JSON.stringify(events), /private-request-id|private-test-query/);
  assert.equal(events[0][2].page_referrer, 'https://www.google.com');
});

test('withdrawing consent disables collection, persists the choice and reloads', () => {
  const state = setup();
  state.api.saveAnalyticsConsent('granted');
  state.api.saveAnalyticsConsent('denied');
  assert.equal(state.window['ga-disable-G-TESTANALYTICS'], true);
  assert.equal(state.api.readAnalyticsConsent(), 'denied');
  assert.equal(state.reloads, 1);
  state.api.trackQuoteLead('another-id', 'home', '');
  assert.equal(state.window.dataLayer.length, 0);
});
