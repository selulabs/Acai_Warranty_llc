import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { getQuotePreselection, parseQuoteRequest } from '../supabase/functions/_shared/quote.ts';
import { createQuoteHandler } from '../supabase/functions/submit-quote/handler.ts';

const origin = 'https://website.test';
const auto = {
  requestId: '12345678-1234-4123-8123-123456789012', fullName: 'Test Customer',
  email: 'customer@example.test', phone: '+1 (202) 555-0147', serviceType: 'auto',
  selectedPlan: 'platinum', vehicle: { make: 'Test', model: 'Vehicle', year: 2020, mileage: 12345 },
  property: null, message: '<script>test</script>', consentToContact: true, sourcePath: '/contact', website: '',
};
const home = { ...auto, serviceType: 'home', selectedPlan: null, vehicle: null,
  property: { zip: '20001', type: 'Townhouse', systemsOfInterest: ['HVAC system', 'Plumbing'] } };

function setup(responses = [], overrides = {}) {
  const calls = [];
  const logs = [];
  const config = {
    ALLOWED_ORIGINS: origin, SUPABASE_URL: 'https://database.test',
    SUPABASE_SERVICE_ROLE_KEY: 'test-server-credential', RESEND_API_KEY: 'test-email-credential',
    QUOTE_FROM_EMAIL: 'sender@example.test', QUOTE_TO_EMAIL: 'first@example.test,second@example.test',
    ...overrides,
  };
  const handler = createQuoteHandler({
    env: (name) => config[name], log: (message) => logs.push(message),
    fetch: async (url, init) => {
      calls.push({ url, ...init, json: JSON.parse(init.body) });
      const response = responses.shift();
      if (response instanceof Error) throw response;
      if (!response) throw new Error('Unexpected outgoing request.');
      return response;
    },
  });
  const request = (payload = auto, headers = {}, method = 'POST') => handler(new Request(`${origin}/submit`, {
    method, headers: { Origin: origin, 'Content-Type': 'application/json', ...headers },
    ...(method === 'POST' ? { body: typeof payload === 'string' ? payload : JSON.stringify(payload) } : {}),
  }));
  return { calls, logs, request };
}
const saved = () => new Response(null, { status: 201 });
const sent = () => Response.json({ id: 'test-message-id' });
const updated = () => new Response(null, { status: 204 });

test('validates and normalizes both service payloads', () => {
  assert.equal(parseQuoteRequest(auto).phone, '2025550147');
  assert.deepEqual(parseQuoteRequest(home).property, home.property);
  assert.equal(parseQuoteRequest({ ...auto, vehicle: { ...auto.vehicle, mileage: null } }).vehicle.mileage, null);
});

test('rejects malformed and incompatible input without trusting browser validation', () => {
  for (const invalid of [null, [], {}, { ...auto, consentToContact: false }, { ...auto, email: 'invalid' },
    { ...auto, phone: '123' }, { ...auto, serviceType: 'other' }, { ...auto, selectedPlan: 'invented' },
    { ...home, selectedPlan: 'gold' }, { ...home, property: { ...home.property, zip: 'bad' } },
    { ...home, property: { ...home.property, systemsOfInterest: ['invented'] } },
    { ...auto, vehicle: { ...auto.vehicle, year: 1979 } },
    { ...auto, vehicle: { ...auto.vehicle, mileage: -1 } }, { ...auto, requestId: 'bad' },
    { ...auto, message: 'x'.repeat(1001) }, { ...auto, sourcePath: '//external' }]) {
    assert.throws(() => parseQuoteRequest(invalid));
  }
});

test('preselection rejects unknown plans and home/auto plan mismatches', () => {
  assert.deepEqual(getQuotePreselection('auto', 'gold'), { serviceType: 'auto', selectedPlan: 'gold' });
  assert.deepEqual(getQuotePreselection(null, 'gold'), { serviceType: 'auto', selectedPlan: 'gold' });
  assert.deepEqual(getQuotePreselection('home', 'gold'), { serviceType: 'home', selectedPlan: '' });
  assert.deepEqual(getQuotePreselection('unknown', 'invalid'), { serviceType: '', selectedPlan: '' });
});

for (const payload of [auto, home]) {
  test(`saves ${payload.serviceType} before emailing and recording status`, async () => {
    const { request, calls } = setup([saved(), sent(), updated()]);
    const response = await request(payload);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
    assert.equal(calls[0].method, 'POST');
    assert.equal(calls[0].json.id, payload.requestId);
    assert.equal(calls[0].json.email_status, undefined);
    assert.equal(calls[0].json.website, undefined);
    assert.equal(calls[0].json.service_type, payload.serviceType);
    assert.equal(calls[1].url, 'https://api.resend.com/emails');
    assert.deepEqual(calls[1].json.to, ['first@example.test', 'second@example.test']);
    assert.equal(calls[1].json.from, 'sender@example.test');
    assert.equal(calls[1].json.reply_to, payload.email);
    assert.equal(calls[1].json.html, undefined);
    assert.ok(calls[1].json.text.includes(payload.message));
    assert.ok(calls[1].json.text.includes(payload.serviceType === 'home' ? '20001' : '12345'));
    assert.equal(calls[2].method, 'PATCH');
    assert.equal(calls[2].json.email_status, 'sent');
    assert.equal(calls[2].json.email_id, 'test-message-id');
    assert.ok(calls[2].json.email_sent_at);
  });
}

test('uses configured recipients rather than browser-supplied addresses', async () => {
  const { request, calls } = setup([saved(), sent(), updated()]);
  await request({ ...auto, to: ['untrusted@example.test'], from: 'untrusted@example.test' });
  assert.deepEqual(calls[1].json.to, ['first@example.test', 'second@example.test']);
});

for (const failure of [new Error('network'), new Response(null, { status: 429 }), Response.json({ unexpected: true })]) {
  test(`email failure still returns success and records failed (${failure.constructor.name})`, async () => {
    const { request, calls } = setup([saved(), failure, updated()]);
    const response = await request();
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
    assert.equal(calls[2].json.email_status, 'failed');
    assert.equal(calls[2].json.email_sent_at, null);
  });
}

test('missing email secrets still saves the lead and marks notification failed', async () => {
  const { request, calls } = setup([saved(), updated()], { RESEND_API_KEY: undefined });
  assert.equal((await request()).status, 200);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].json.email_status, 'failed');
});

test('status update failure cannot turn a saved lead into a customer-facing failure', async () => {
  const { request, logs } = setup([saved(), sent(), new Error('database unavailable')]);
  assert.equal((await request()).status, 200);
  assert.ok(logs.some((line) => line.includes('pending leads')));
});

test('database failures never send email or report success', async () => {
  for (const failure of [new Error('network'), new Response(null, { status: 500 })]) {
    const { request, calls } = setup([failure]);
    assert.equal((await request()).status, 503);
    assert.equal(calls.length, 1);
  }
});

test('idempotent repeat does not send another email', async () => {
  const { request, calls } = setup([new Response(null, { status: 409 })]);
  assert.deepEqual(await (await request()).json(), { success: true });
  assert.equal(calls.length, 1);
});

test('honeypot requests are silently discarded without database or email calls', async () => {
  const { request, calls } = setup();
  assert.equal((await request({ ...auto, website: 'bot-value' })).status, 200);
  assert.equal(calls.length, 0);
});

test('blocks unapproved origins, wildcards, invalid JSON, large bodies and invalid fields', async () => {
  const { request, calls } = setup();
  assert.equal((await request(auto, { Origin: 'https://untrusted.test' })).status, 403);
  assert.equal((await request(auto, { Origin: '' })).status, 403);
  assert.equal((await request('invalid JSON')).status, 400);
  assert.equal((await request({ ...auto, consentToContact: false })).status, 400);
  assert.equal((await request('x'.repeat(16385))).status, 413);
  assert.equal((await request(auto, { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await request(auto, {}, 'GET')).status, 405);
  assert.equal((await setup([], { ALLOWED_ORIGINS: '*' }).request()).status, 503);
  assert.equal(calls.length, 0);
});

test('allows preflight only for the configured exact origin', async () => {
  const { request } = setup();
  const response = await request(auto, {}, 'OPTIONS');
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
  assert.ok(response.headers.get('Access-Control-Allow-Headers').includes('apikey'));
});

test('migration has RLS and service-role grants with no public grant or policy', () => {
  const sql = readFileSync(new URL('../supabase/migrations/20261116000100_create_quote_requests.sql', import.meta.url), 'utf8');
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /revoke all on table public\.quote_requests from public, anon, authenticated/i);
  assert.match(sql, /grant select, insert, update on table public\.quote_requests to service_role/i);
  assert.doesNotMatch(sql, /create policy|grant[^;]*to\s+(anon|authenticated|public)\b/i);
});
