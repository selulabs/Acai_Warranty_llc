import { SITE } from '@/data/site';
import { getPageMeta } from '@/data/pageMeta';
import { isPlanId, type ServiceType } from '../../supabase/functions/_shared/quote';

export type AnalyticsConsent = 'granted' | 'denied';
export const CONSENT_KEY = 'acai-analytics-consent-v1';
export const CONSENT_EVENT = 'acai-analytics-consent-change';
const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID?.trim() ?? '';
export const analyticsConfigured = /^G-[A-Z0-9]+$/.test(measurementId);
let consent: AnalyticsConsent | null = null;
let initialized = false;
let lastPage = '';
const recordedLeads = new Set<string>();

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  try {
    const stored = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? 'null');
    const age = Date.now() - stored?.decidedAt;
    return stored?.version === 1 && age >= 0 && age < 180 * 86400000 &&
      (stored.choice === 'granted' || stored.choice === 'denied') ? stored.choice : null;
  } catch { return null; }
}

function clearAnalyticsCookies() {
  // GA is configured for host-only cookies; also clear prior domain cookies.
  const parts = location.hostname.split('.');
  const domains = ['', ...parts.map((_, index) => `; Domain=.${parts.slice(index).join('.')}`)];
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (name === '_ga' || name.startsWith('_ga_')) {
      for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax`;
    }
  }
}

export function applyAnalyticsConsent(choice: AnalyticsConsent | null) {
  consent = choice;
  if (!analyticsConfigured) return;
  window[`ga-disable-${measurementId}`] = choice !== 'granted';
  if (choice !== 'granted') {
    document.getElementById('google-analytics')?.remove();
    clearAnalyticsCookies();
    initialized = false;
    window.dataLayer = [];
    window.gtag = undefined;
    lastPage = '';
    return;
  }
  if (!initialized) {
    initialized = true;
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = (...args) => { window.dataLayer!.push(args); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    const meta = getPageMeta(location.pathname);
    let referrer = '';
    try { referrer = document.referrer ? new URL(document.referrer).origin : ''; } catch { /* omit */ }
    window.gtag('config', measurementId, { send_page_view: false, allow_google_signals: false,
      page_location: `${SITE.url}${meta.path}`, page_title: meta.title, page_referrer: referrer,
      allow_ad_personalization_signals: false, cookie_domain: 'none', cookie_flags: 'SameSite=Lax;Secure' });
    const script = document.createElement('script');
    script.id = 'google-analytics';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }
  trackPageView(location.pathname);
}

export function saveAnalyticsConsent(choice: AnalyticsConsent) {
  const withdrawing = consent === 'granted' && choice === 'denied';
  let persisted = false;
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 1, choice, decidedAt: Date.now() }));
    persisted = true;
  } catch { /* Respect the choice for this visit when storage is blocked. */ }
  applyAnalyticsConsent(choice);
  window.dispatchEvent(new Event(CONSENT_EVENT));
  // End the loaded tag's execution context on withdrawal; no cookieless pings.
  if (withdrawing && persisted) location.reload();
}

function sendEvent(name: string, parameters: Record<string, string>) {
  if (!analyticsConfigured || consent !== 'granted') return;
  const meta = getPageMeta(location.pathname);
  if (meta.noindex) return;
  let referrer = '';
  try { referrer = document.referrer ? new URL(document.referrer).origin : ''; } catch { /* omit invalid referrer */ }
  window.gtag?.('event', name, { ...parameters, page_location: `${SITE.url}${meta.path}`,
    page_title: meta.title, page_referrer: referrer });
}

export function trackPageView(path: string) {
  if (consent !== 'granted' || !analyticsConfigured || path === lastPage) return;
  lastPage = path;
  sendEvent('page_view', {});
}

export function trackQuoteLead(id: string, service: ServiceType, plan: string) {
  if (consent !== 'granted' || !analyticsConfigured || recordedLeads.has(id)) return;
  recordedLeads.add(id); // The request ID is never sent to Google.
  sendEvent('generate_lead', { service_type: service,
    ...(isPlanId(plan) ? { selected_plan: plan } : {}) });
}

export function trackContactClick(method: 'phone' | 'email') {
  sendEvent('contact_click', { contact_method: method });
}
