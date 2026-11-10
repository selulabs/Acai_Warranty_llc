import PageHero from '@/components/sections/PageHero';
import QuoteRequestForm from '@/components/forms/QuoteRequestForm';
import { IMAGES } from '@/data/images';
import { SITE } from '@/data/site';
import { PAGE_META, useDocumentHead } from '@/lib/seo';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  useDocumentHead(PAGE_META.contact);

  return (
    <>
      <PageHero
        image={IMAGES.suvFog}
        imageAlt="Silver SUV on a foggy countryside road"
        eyebrow="Free Quote"
        title="Let's Find the Right Protection for You."
        description="Tell us what you would like to protect, and share the information needed to discuss your coverage options."
        size="compact"
      />

      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-28">
        <aside className="lg:col-span-4" aria-labelledby="contact-details-heading">
          <h2 id="contact-details-heading" className="text-[26px]">
            Contact details
          </h2>
          <p className="mt-4 text-[16px] text-neutral-600">
            Prefer to reach out directly? Use the details below. Submitting the form is the fastest way to start your request.
          </p>

          <dl className="mt-10 space-y-8 border-t border-neutral-200 pt-8">
            <div className="flex gap-4">
              <Mail className="mt-1 shrink-0 text-accent-700" size={20} aria-hidden="true" />
              <div>
                <dt className="text-sm font-semibold text-neutral-500">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${SITE.email}`} className="font-semibold text-accent-700 underline-offset-4 hover:underline">
                    {SITE.email}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-1 shrink-0 text-accent-700" size={20} aria-hidden="true" />
              <div>
                <dt className="text-sm font-semibold text-neutral-500">Phone</dt>
                <dd className="mt-1">
                  <a href={SITE.phoneHref} className="font-semibold text-accent-700 underline-offset-4 hover:underline">
                    {SITE.phoneDisplay}
                  </a>
                  <span className="mt-1 block rounded-lg bg-warning-50 px-3 py-2 text-sm text-warning-700">
                    Placeholder number. Not yet verified as a customer support line.
                  </span>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="mt-1 shrink-0 text-accent-700" size={20} aria-hidden="true" />
              <div>
                <dt className="text-sm font-semibold text-neutral-500">Location</dt>
                <dd className="mt-1 text-black">{SITE.location}</dd>
              </div>
            </div>
          </dl>
        </aside>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-card sm:p-10 lg:col-span-8">
          <h2 className="text-[26px]">Request your free quote</h2>
          <p className="mt-3 text-[16px] text-neutral-600">Fields marked with an asterisk are required.</p>
          <div className="mt-10">
            <QuoteRequestForm />
          </div>
        </div>
      </section>
    </>
  );
}
