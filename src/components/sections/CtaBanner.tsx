import { ButtonLink } from '@/components/ui/Button';

interface CtaBannerProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  cta: { label: string; to: string };
}

export default function CtaBanner({ image, imageAlt, title, description, cta }: CtaBannerProps) {
  return (
    <section className="relative isolate overflow-hidden bg-primary-900 text-white">
      <img
        src={image}
        alt={imageAlt}
        width={2000}
        height={1000}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-primary-900/85" aria-hidden="true" />
      <div className="mx-auto flex max-w-7xl flex-col items-center px-5 py-24 text-center sm:px-8 lg:px-10 lg:py-32">
        <span className="h-px w-16 bg-secondary-400" aria-hidden="true" />
        <h2 className="mt-8 max-w-3xl text-white">{title}</h2>
        <p className="mt-5 max-w-xl text-[17px] text-neutral-100">{description}</p>
        <ButtonLink to={cta.to} variant="light" size="lg" className="mt-10">
          {cta.label}
        </ButtonLink>
      </div>
    </section>
  );
}
