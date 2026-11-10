import CtaBanner from '@/components/sections/CtaBanner';
import ComparisonTable from '@/components/sections/ComparisonTable';
import PageHero from '@/components/sections/PageHero';
import PlanCard from '@/components/sections/PlanCard';
import Accordion from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import SectionHeading from '@/components/ui/SectionHeading';
import { PROTECTION_PLANS } from '@/data/plans';
import { IMAGES } from '@/data/images';
import { PAGE_META, useDocumentHead } from '@/lib/seo';

const BREAKDOWN_PLANS = PROTECTION_PLANS.filter((plan) => plan.category === 'breakdown');
const MAINTENANCE_PLANS = PROTECTION_PLANS.filter((plan) => plan.category === 'maintenance');

const FAQS = [
  {
    question: 'How do the breakdown plans differ?',
    answer:
      'Each plan lists a different set of categories. Platinum is positioned as the most comprehensive option, Gold balances engine, transmission, and suspension, and Powertrain focuses on essential mechanical components. The comparison table shows the general categories for each plan.',
  },
  {
    question: 'Is Pre-Paid Maintenance a breakdown plan?',
    answer:
      'No. Pre-Paid Maintenance is a routine service plan for eligible scheduled maintenance such as oil changes and filter replacement. It does not provide mechanical breakdown protection.',
  },
  {
    question: 'Does Platinum include roadside-related benefits?',
    answer:
      'Platinum is described as including roadside-related benefits. The specific benefits, limits, and conditions are defined in the contract, so please confirm them before enrolling.',
  },
  {
    question: 'Do you publish prices on this page?',
    answer:
      'No. Pricing depends on your vehicle and selected plan and is shared during your quote review. This page does not list prices.',
  },
  {
    question: 'What if a part I need is not listed?',
    answer:
      'Only the components named in your contract are covered. Review the covered list and the exclusions in your contract, or ask us during your quote review.',
  },
];

export default function ProtectionPlansPage() {
  useDocumentHead(PAGE_META.plans);

  return (
    <>
      <PageHero
        image={IMAGES.sedanPair}
        imageAlt="Two luxury sedans parked in front of a mountain sunset"
        eyebrow="Protection Plans"
        title="Explore Protection Built Around Your Drive."
        description="Compare four automotive plans, from comprehensive breakdown protection to routine maintenance planning. Coverage details depend on the contract you select."
        primaryCta={{ label: 'Request a Quote', to: '/contact' }}
        secondaryCta={{ label: 'Compare Plans', to: '#compare' }}
        size="compact"
      />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <SectionHeading
          eyebrow="Mechanical breakdown protection"
          title="Three plans for drivers who want repair protection."
          description="Plan overviews are subject to the terms of your contract. Review the covered categories and exclusions before you enroll."
        />
        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {BREAKDOWN_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} showSummary />
          ))}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50 py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-5">
            <p className="mb-4 inline-flex rounded-full bg-accent-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-accent-800">
              Separate service category
            </p>
            <h2>Pre-Paid Maintenance</h2>
            <p className="mt-4 text-[17px] text-neutral-600">
              Pre-Paid Maintenance is built for planning routine service. It is not a mechanical breakdown plan and should be
              compared separately from the plans above.
            </p>
          </div>
          <div className="lg:col-span-7">
            {MAINTENANCE_PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} showSummary />
            ))}
          </div>
        </div>
      </section>

      <section id="compare" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <SectionHeading
          eyebrow="Compare plans"
          title="See how the plans line up."
          description="Where a plan's inclusion of a category is not confirmed in its overview, the table says Confirm in contract rather than assuming coverage."
        />
        <div className="mt-12">
          <ComparisonTable />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 rounded-lg border border-neutral-200 bg-primary-50 p-8 md:flex-row md:items-center md:justify-between lg:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Looking for home protection?</p>
            <h2 className="mt-3 text-[26px]">Home warranty plans are on a separate page.</h2>
            <p className="mt-3 max-w-2xl text-[16px] text-neutral-600">
              Our home warranty options cover eligible household systems and appliances, and have their own terms.
            </p>
          </div>
          <ButtonLink to="/home-warranty" variant="outline" className="shrink-0">
            Explore Home Warranty
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading eyebrow="Frequently asked" title="Protection plan questions" align="center" />
        <div className="mt-12">
          <Accordion items={FAQS} groupName="plans-faq" />
        </div>
      </section>

      <CtaBanner
        image={IMAGES.mechanicLift}
        imageAlt="Mechanic lifting a car engine in a well-lit repair shop"
        title="Choose the Plan That Fits Your Drive."
        description="Tell us about your vehicle and we will walk through the plans, categories, and terms that apply."
        cta={{ label: 'Request a Quote', to: '/contact' }}
      />
    </>
  );
}
