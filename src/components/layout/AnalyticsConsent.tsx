import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { analyticsConfigured, applyAnalyticsConsent, CONSENT_EVENT, readAnalyticsConsent,
  saveAnalyticsConsent } from '@/lib/analytics';

const OPEN_EVENT = 'acai-open-privacy-preferences';

export default function AnalyticsConsent() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!analyticsConfigured) return;
    const stored = readAnalyticsConsent();
    applyAnalyticsConsent(stored);
    setOpen(stored === null);
    const show = () => setOpen(true);
    const close = () => setOpen(false);
    const sync = (event: StorageEvent) => {
      if (event.key !== 'acai-analytics-consent-v1' && event.key !== null) return;
      const choice = readAnalyticsConsent();
      applyAnalyticsConsent(choice);
      setOpen(choice === null);
    };
    window.addEventListener(OPEN_EVENT, show);
    window.addEventListener(CONSENT_EVENT, close);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(OPEN_EVENT, show); window.removeEventListener(CONSENT_EVENT, close); window.removeEventListener('storage', sync); };
  }, []);
  if (!analyticsConfigured || !open) return null;
  return (
    <section aria-label="Analytics cookie preferences" className="fixed inset-x-0 bottom-0 z-[60] border-t border-neutral-200 bg-white p-5 shadow-elevated sm:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-sm text-neutral-700">
          With your permission, we use Google Analytics cookies to measure website visits and quote requests.
          You can accept or reject optional analytics and change your choice using Privacy preferences.
          {' '}<Link to="/privacy-policy" className="font-semibold text-accent-700 underline">Privacy Policy</Link>
        </p>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Button variant="outline" onClick={() => saveAnalyticsConsent('denied')}>Reject analytics</Button>
          <Button variant="outline" onClick={() => saveAnalyticsConsent('granted')}>Accept analytics</Button>
        </div>
      </div>
    </section>
  );
}

export function PrivacyPreferencesButton() {
  if (!analyticsConfigured) return null;
  return <button type="button" className="text-left underline underline-offset-4 hover:text-white"
    onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>Privacy preferences</button>;
}
