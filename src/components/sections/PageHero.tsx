import type { CSSProperties } from 'react';
import { ButtonLink } from '@/components/ui/Button';

interface CtaLink {
  label: string;
  to: string;
}

interface PageHeroProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  eyebrow?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  size?: 'full' | 'compact';
  imagePosition?: CSSProperties['objectPosition'];
  footnote?: string;
}

export default function PageHero({
  image,
  imageAlt,
  title,
  description,
  eyebrow,
  primaryCta,
  secondaryCta,
  size = 'full',
  imagePosition = 'center',
  footnote,
}: PageHeroProps) {
  const isCompact = size === 'compact';

  return (
    <section className={`relative isolate overflow-hidden bg-primary-900 text-white ${isCompact ? 'min-h-[420px]' : 'min-h-[640px] lg:min-h-[720px]'}`}>
      <img
        src={image}
        alt={imageAlt}
        width={2000}
        height={1300}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-900/95 via-primary-900/75 to-primary-900/25" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-primary-900/80 to-transparent" aria-hidden="true" />

      <div className={`mx-auto flex max-w-7xl flex-col justify-end px-5 sm:px-8 lg:px-10 ${isCompact ? 'min-h-[420px] pb-16 pt-28' : 'min-h-[640px] pb-20 pt-40 lg:min-h-[720px]'}`}>
        <div className="max-w-2xl animate-fade-up">
          {eyebrow && (
            <p className="mb-5 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-200">
              <span className="h-px w-8 bg-accent-300" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          <h1 className="text-white">{title}</h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.5] text-neutral-100 sm:text-lg">{description}</p>
          {(primaryCta || secondaryCta) && (
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              {primaryCta && (
                <ButtonLink to={primaryCta.to} variant="light" size="lg">
                  {primaryCta.label}
                </ButtonLink>
              )}
              {secondaryCta && (
                <ButtonLink to={secondaryCta.to} variant="outline-light" size="lg">
                  {secondaryCta.label}
                </ButtonLink>
              )}
            </div>
          )}
          {footnote && <p className="mt-8 text-sm text-neutral-200">{footnote}</p>}
        </div>
      </div>
    </section>
  );
}
