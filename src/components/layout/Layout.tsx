import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import AnalyticsConsent from '@/components/layout/AnalyticsConsent';
import { trackContactClick, trackPageView } from '@/lib/analytics';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const href = event.target.closest('a')?.getAttribute('href');
      if (href?.startsWith('tel:')) trackContactClick('phone');
      if (href?.startsWith('mailto:')) trackContactClick('email');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
      <AnalyticsConsent />
    </div>
  );
}
