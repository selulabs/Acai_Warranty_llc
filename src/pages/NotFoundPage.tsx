import { Link } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { PAGE_META, useDocumentHead } from '@/lib/seo';

export default function NotFoundPage() {
  useDocumentHead(PAGE_META.notFound);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
      <p className="font-display text-7xl font-bold text-primary-200 sm:text-8xl" aria-hidden="true">
        404
      </p>
      <h1 className="mt-6 text-black">This page could not be found.</h1>
      <p className="mt-5 max-w-md text-[17px] text-neutral-600">
        The link may be outdated, or the page may have moved. Head back to the homepage or request a quote.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink to="/" size="lg">
          Back to Home
        </ButtonLink>
        <ButtonLink to="/contact" variant="outline" size="lg">
          Get a Free Quote
        </ButtonLink>
      </div>
      <Link to="/protection-plans" className="mt-8 text-sm font-semibold text-accent-700 underline-offset-4 hover:underline">
        View protection plans
      </Link>
    </section>
  );
}
