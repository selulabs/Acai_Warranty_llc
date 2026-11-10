import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { NAV_LINKS, SITE } from '@/data/site';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    firstLinkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="mobile-navigation"
      className="fixed inset-x-0 bottom-0 top-20 z-40 origin-top animate-menu-in overflow-y-auto bg-white lg:hidden"
    >
      <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col px-5 py-6 sm:px-8">
        <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
          {NAV_LINKS.map((link, index) => (
            <li key={link.to}>
              <NavLink
                ref={index === 0 ? firstLinkRef : undefined}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex min-h-14 items-center justify-between font-display text-lg font-semibold transition-colors ${
                    isActive ? 'text-primary-600' : 'text-black hover:text-primary-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <ButtonLink to="/contact" size="lg" className="mt-8 w-full">
          Get Your Free Quote
        </ButtonLink>
        <p className="mt-6 text-sm text-neutral-600">
          Questions? Email{' '}
          <a href={`mailto:${SITE.email}`} className="font-semibold text-accent-700 underline-offset-4 hover:underline">
            {SITE.email}
          </a>
        </p>
      </nav>
    </div>
  );
}
