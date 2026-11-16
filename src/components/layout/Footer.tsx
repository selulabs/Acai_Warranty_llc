import { Link } from 'react-router-dom';
import Logo from '@/components/layout/Logo';
import { FOOTER_GROUPS, SITE } from '@/data/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-800 text-neutral-200">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 lg:px-10 lg:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm text-[15px] leading-[1.5] text-neutral-200">{SITE.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">{group.title}</h3>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-[15px] text-neutral-200 transition-colors hover:text-white hover:underline underline-offset-4">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Contact</h3>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li>
                <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-white hover:underline underline-offset-4">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.phoneHref} className="transition-colors hover:text-white hover:underline underline-offset-4">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>{SITE.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-6 text-[13px] text-neutral-300 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} ACAI Warranty LLC. All rights reserved.</p>
          <p>Auto &amp; Home Protection Solutions</p>
        </div>
      </div>
    </footer>
  );
}
