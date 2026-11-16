import { EMAIL_PATTERN, parseQuoteRequest, type QuoteRequestPayload } from '../_shared/quote.ts';

interface Dependencies {
  env: (name: string) => string | undefined;
  fetch: typeof fetch;
  log?: (message: string) => void;
}

const MAX_BODY_BYTES = 16384;

class RequestError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

async function readJson(request: Request): Promise<unknown> {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    throw new RequestError(415, 'Send JSON data.');
  }
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
    throw new RequestError(413, 'Request is too large.');
  }
  if (!request.body) throw new RequestError(400, 'Request data is required.');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RequestError(413, 'Request is too large.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new RequestError(400, 'Invalid JSON.'); }
}

function emailText(quote: QuoteRequestPayload) {
  return [
    `Request ID: ${quote.requestId}`,
    `Name: ${quote.fullName}`,
    `Email: ${quote.email}`,
    `Phone: ${quote.phone}`,
    `Service: ${quote.serviceType}`,
    `Selected plan: ${quote.selectedPlan ?? 'Not selected'}`,
    ...(quote.vehicle ? [
      `Vehicle: ${quote.vehicle.year} ${quote.vehicle.make} ${quote.vehicle.model}`,
      `Mileage: ${quote.vehicle.mileage ?? 'Not provided'}`,
    ] : []),
    ...(quote.property ? [
      `Property ZIP: ${quote.property.zip}`,
      `Property type: ${quote.property.type ?? 'Not provided'}`,
      `Systems/appliances: ${quote.property.systemsOfInterest.join(', ') || 'Not provided'}`,
    ] : []),
    `Message: ${quote.message ?? 'Not provided'}`,
    'Consent to contact: Yes (quote inquiry only)',
    `Source path: ${quote.sourcePath}`,
  ].join('\n');
}

export function createQuoteHandler(dependencies: Dependencies) {
  const { env, fetch: fetchRequest } = dependencies;
  const log = dependencies.log ?? ((message: string) => console.error(message));

  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get('origin');
    const allowedOrigins = (env('ALLOWED_ORIGINS') ?? '').split(',').map((value) => value.trim()).filter(Boolean);
    const allowed = !!origin && allowedOrigins.includes(origin);
    const headers: Record<string, string> = { 'Content-Type': 'application/json', Vary: 'Origin' };
    if (allowed) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
      headers['Access-Control-Allow-Headers'] = 'authorization, apikey, content-type, x-client-info';
      headers['Access-Control-Max-Age'] = '600';
    }
    const respond = (status: number, body: object) => new Response(JSON.stringify(body), { status, headers });
    if (!allowedOrigins.length || allowedOrigins.includes('*')) return respond(503, { error: 'Quote requests are unavailable.' });
    if (!allowed) return respond(403, { error: 'Origin not allowed.' });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return respond(405, { error: 'Method not allowed.' });

    try {
      const input = await readJson(request);
      // Silently discard bots. Honeypot values are never saved or emailed.
      if (typeof input === 'object' && input !== null && 'website' in input &&
        typeof input.website === 'string' && input.website.trim()) return respond(200, { success: true });
      let quote: QuoteRequestPayload;
      try { quote = parseQuoteRequest(input); }
      catch { return respond(400, { error: 'Check the required fields and try again.' }); }

      const supabaseUrl = env('SUPABASE_URL');
      const serviceRoleKey = env('SUPABASE_SERVICE_ROLE_KEY');
      if (!supabaseUrl || !serviceRoleKey) return respond(503, { error: 'Quote requests are unavailable.' });
      const tableUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/quote_requests`;
      const databaseHeaders = {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      };
      const saved = await fetchRequest(tableUrl, {
        method: 'POST', headers: databaseHeaders, signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          id: quote.requestId, full_name: quote.fullName, email: quote.email, phone: quote.phone,
          service_type: quote.serviceType, selected_plan: quote.selectedPlan, vehicle: quote.vehicle,
          property: quote.property, message: quote.message, consent_to_contact: true,
          source_path: quote.sourcePath,
        }),
      });
      // Repeated requests use the same UUID. Never send a duplicate notification.
      if (saved.status === 409) return respond(200, { success: true });
      if (!saved.ok) {
        log(`Quote save failed: HTTP ${saved.status}`);
        return respond(503, { error: 'Unable to save your request. Please try again.' });
      }

      // Once persisted, email/configuration failures must never become form failures.
      let emailStatus = 'failed';
      let emailId: string | null = null;
      try {
        const resendKey = env('RESEND_API_KEY');
        const from = env('QUOTE_FROM_EMAIL')?.trim();
        const to = (env('QUOTE_TO_EMAIL') ?? '').split(',').map((value) => value.trim()).filter(Boolean);
        if (!resendKey || !from || /[\r\n]/.test(from) || !to.length ||
          !to.every((address) => EMAIL_PATTERN.test(address))) throw new Error('Email configuration missing or invalid.');
        const sent = await fetchRequest('https://api.resend.com/emails', {
          method: 'POST', signal: AbortSignal.timeout(8000),
          headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json',
            'Idempotency-Key': `quote/${quote.requestId}` },
          body: JSON.stringify({ from, to, reply_to: quote.email,
            subject: `New ${quote.serviceType} quote request`, text: emailText(quote) }),
        });
        if (!sent.ok) throw new Error('Email provider rejected the message.');
        const result: unknown = await sent.json();
        if (typeof result !== 'object' || result === null || !('id' in result) || typeof result.id !== 'string') {
          throw new Error('Invalid email provider response.');
        }
        emailId = result.id;
        emailStatus = 'sent';
      } catch {
        log(`Quote notification failed for ${quote.requestId}; lead remains saved.`);
      }

      try {
        const updated = await fetchRequest(`${tableUrl}?id=eq.${quote.requestId}`, {
          method: 'PATCH', headers: databaseHeaders, signal: AbortSignal.timeout(5000),
          body: JSON.stringify({ email_status: emailStatus, email_id: emailId,
            email_sent_at: emailStatus === 'sent' ? new Date().toISOString() : null }),
        });
        if (!updated.ok) throw new Error('Status update failed.');
      } catch {
        log(`Quote notification status could not be recorded for ${quote.requestId}; inspect pending leads.`);
      }
      return respond(200, { success: true });
    } catch (error) {
      if (error instanceof RequestError) return respond(error.status, { error: error.message });
      log('Quote request failed before persistence could be confirmed.');
      return respond(503, { error: 'Unable to confirm your request. Please try again.' });
    }
  };
}
