import { ShieldCheck } from 'lucide-react';

interface LogoProps {
  tone?: 'dark' | 'light';
}

export default function Logo({ tone = 'dark' }: LogoProps) {
  const isLight = tone === 'light';
  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`grid h-10 w-10 place-items-center rounded-lg ${isLight ? 'bg-white text-primary-700' : 'bg-primary-600 text-white'}`}
      >
        <ShieldCheck size={22} strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[17px] font-bold tracking-[0.12em] ${isLight ? 'text-white' : 'text-primary-700'}`}>
          ACAI
        </span>
        <span className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${isLight ? 'text-neutral-200' : 'text-neutral-600'}`}>
          Warranty LLC
        </span>
      </span>
    </span>
  );
}
