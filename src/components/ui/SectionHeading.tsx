import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
}

export default function SectionHeading({ eyebrow, title, description, align = 'left', tone = 'light' }: SectionHeadingProps) {
  const isDark = tone === 'dark';
  return (
    <header className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p className={`mb-3 text-xs font-bold uppercase tracking-[0.22em] ${isDark ? 'text-accent-300' : 'text-accent-700'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={isDark ? 'text-white' : undefined}>{title}</h2>
      {description && (
        <p className={`mt-4 text-[17px] ${isDark ? 'text-neutral-200' : 'text-neutral-600'}`}>{description}</p>
      )}
    </header>
  );
}
