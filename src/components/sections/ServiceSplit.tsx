import { CheckCircle2 } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

interface ServiceSplitProps {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  description: string | string[];
  bullets?: string[];
  cta?: { label: string; to: string; variant?: 'primary' | 'outline' };
  reverse?: boolean;
  id?: string;
}

export default function ServiceSplit({ image, imageAlt, eyebrow, title, description, bullets, cta, reverse = false, id }: ServiceSplitProps) {
  const paragraphs = Array.isArray(description) ? description : [description];

  return (
    <section id={id} className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className={`group relative overflow-hidden rounded-lg shadow-card ${reverse ? 'lg:order-2' : ''}`}>
          <img
            src={image}
            alt={imageAlt}
            width={2000}
            height={1300}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className={reverse ? 'lg:order-1' : ''}>
          {eyebrow && (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-accent-700">{eyebrow}</p>
          )}
          <h2>{title}</h2>
          <div className="mt-6 space-y-4 text-[17px] text-neutral-600">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {bullets && (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-[15px] font-medium text-neutral-800">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent-600" aria-hidden="true" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}
          {cta && (
            <ButtonLink to={cta.to} variant={cta.variant ?? 'primary'} size="lg" className="mt-10">
              {cta.label}
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
