import CtaBanner from '@/components/sections/CtaBanner';
import PageHero from '@/components/sections/PageHero';
import PlanCard from '@/components/sections/PlanCard';
import ServiceSplit from '@/components/sections/ServiceSplit';
import Accordion from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import SectionHeading from '@/components/ui/SectionHeading';
import { PROTECTION_PLANS } from '@/data/plans';
import { IMAGES } from '@/data/images';
import { PAGE_META, useDocumentHead } from '@/lib/seo';

const COVERAGE_CATEGORIES = [
  { name: 'Engine', text: 'Internal engine components that are listed as eligible in your contract.' },
  { name: 'Transmission', text: 'Transmission components covered under the plan you select.' },
  { name: 'Drivetrain', text: 'Components that deliver power to the wheels, where included by plan.' },
  { name: 'Suspension', text: 'Suspension parts available on select plans, as defined in your contract.' },
  { name: 'Selected electrical systems', text: 'Electrical components that some plans include. Check your contract for specifics.' },
  { name: 'Other eligible components', text: 'Additional parts that may be eligible depending on the plan and contract terms.' },
];

const START_STEPS = [
  { title: 'Request a quote', text: 'Tell us your vehicle make, model, year, and mileage.' },
  { title: 'Review your options', text: 'We walk through plan categories and the terms that apply.' },
  { title: 'Enroll and keep your contract', text: 'Keep your contract handy for the service request process.' },
];

const FAQS = [
  {
    question: 'What is a vehicle service contract?',
    answer:
      'A vehicle service contract is an agreement that may help pay for eligible mechanical repairs under the plan you choose. It is separate from the manufacturer warranty and from routine maintenance. Your contract defines what is covered.',
  },
  {
    question: 'Which vehicle components may be covered?',
    answer:
      'Depending on the plan, eligible coverage may include engine, transmission, drivetrain, suspension, selected electrical systems, and other eligible components. The specific list appears in your contract.',
  },
  {
    question: 'Are older vehicles eligible?',
    answer:
      'Eligibility is set by each contract. Share your vehicle year and mileage in the quote form and we will explain what is available for your vehicle.',
  },
  {
    question: 'Does coverage include regular maintenance?',
    answer:
      'Mechanical breakdown plans do not cover routine maintenance. Pre-Paid Maintenance is a separate plan for eligible scheduled services such as oil changes and filter replacement.',
  },
  {
    question: 'How do I submit a service request?',
    answer:
      'Follow the service request instructions in your contract. The steps for contacting the plan administrator and documenting a problem are included with your enrollment documents.',
  },
  {
    question: 'Where can I find exclusions and limitations?',
    answer:
      'Exclusions, limitations, waiting periods, and fees are listed in your contract. Review them carefully before you enroll.',
  },
];

export default function AutoWarrantyPage() {
  useDocumentHead(PAGE_META.auto);

  return (
    <>
      <PageHero
        image={IMAGES.suvDesert}
        imageAlt="White SUV driving along a winding desert road under a clear sky"
        eyebrow="Auto Warranty"
        title="Drive With Confidence. Protect What Moves You."
        description="Explore vehicle service contract options that help you prepare for eligible mechanical breakdown repair expenses."
        primaryCta={{ label: 'Get Auto Warranty Quote', to: '/contact' }}
        secondaryCta={{ label: 'View Protection Plans', to: '/protection-plans' }}
      />

      <ServiceSplit
        eyebrow="The basics"
        title="What is auto warranty protection?"
        description={[
          'A vehicle service contract is a separate agreement that may help cover the cost of eligible mechanical repairs after your contract begins. It is not the manufacturer warranty that comes with a new vehicle.',
          'Routine maintenance, such as oil changes and filter replacement, is ordinary upkeep you plan for yourself. A service contract is designed for the unexpected: eligible breakdowns that come with normal driving, subject to your contract terms.',
        ]}
        image={IMAGES.sedanPair}
        imageAlt="Two luxury sedans parked in front of a mountain sunset"
      />

      <section className="bg-neutral-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Coverage categories"
            title="Systems that vehicle protection may include."
            description="Plans vary. The categories below describe what plans may address. Your contract lists exactly what is covered."
          />
          <ul className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {COVERAGE_CATEGORIES.map((item, index) => (
              <li key={item.name} className="border-t-2 border-primary-600 pt-6">
                <span className="font-display text-sm font-bold text-secondary-600">0{index + 1}</span>
                <h3 className="mt-3">{item.name}</h3>
                <p className="mt-3 text-[15px] text-neutral-600">{item.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-12 text-sm text-neutral-600">
            Coverage varies by plan and contract. Listed categories are not guarantees that a particular repair is covered.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <SectionHeading
          eyebrow="Protection plans"
          title="Four options, each built around a different need."
          description="Each plan has its own categories and terms. Select a plan to compare details or request a quote."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PROTECTION_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
        <ButtonLink to="/protection-plans" variant="outline" className="mt-12">
          Compare every plan
        </ButtonLink>
      </section>

      <ServiceSplit
        eyebrow="Why explore protection"
        title="Plan for the repairs you cannot schedule."
        description="An unexpected repair can disrupt your budget and your week. Exploring protection now means you can review your options calmly, before a breakdown happens."
        bullets={['Review plans at your own pace', 'Understand categories before enrolling', 'Plan around predictable costs', 'Clear terms in writing']}
        image={IMAGES.mechanicRepair}
        imageAlt="Mechanic working on a vehicle engine in a repair shop"
        reverse
      />

      <section className="border-y border-neutral-200 bg-white py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Getting started" title="How to get started." />
          </div>
          <ol className="grid gap-8 lg:col-span-8">
            {START_STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-6">
                <span className="font-display text-3xl font-bold text-primary-200" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p className="mt-2 text-[16px] text-neutral-600">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading eyebrow="Frequently asked" title="Auto warranty questions" align="center" />
        <div className="mt-12">
          <Accordion items={FAQS} groupName="auto-faq" />
        </div>
      </section>

      <CtaBanner
        image={IMAGES.engineDetail}
        imageAlt="Close-up of engine components under a car hood"
        title="Find the Right Vehicle Protection for Your Drive."
        description="Share your vehicle details and we will help you explore the protection options available."
        cta={{ label: 'Get Auto Warranty Quote', to: '/contact' }}
      />
    </>
  );
}
