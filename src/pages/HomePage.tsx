import { ShieldCheck } from 'lucide-react';
import CtaBanner from '@/components/sections/CtaBanner';
import PageHero from '@/components/sections/PageHero';
import PlanCard from '@/components/sections/PlanCard';
import ServiceSplit from '@/components/sections/ServiceSplit';
import SectionHeading from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { PROTECTION_PLANS } from '@/data/plans';
import { IMAGES } from '@/data/images';
import { SITE } from '@/data/site';
import { PAGE_META, useDocumentHead } from '@/lib/seo';

const WHY_POINTS = [
  {
    title: 'Prepare for unexpected repair expenses',
    text: 'Repairs rarely arrive on schedule. A protection plan lets you plan ahead for the costs that come with breakdowns.',
  },
  {
    title: 'Choose protection that fits your needs',
    text: 'Plans differ in the systems they cover and how they are structured, so you can match protection to how you use your vehicle or home.',
  },
  {
    title: 'Understand your options before you commit',
    text: 'We help you review coverage categories, terms, and exclusions so you know what your contract includes before you enroll.',
  },
];

const HOW_STEPS = [
  { title: 'Request a quote', text: 'Share a few details about your vehicle or home.' },
  { title: 'Review coverage options', text: 'Compare the plans and categories available to you.' },
  { title: 'Choose your plan', text: 'Select the option that fits your needs and budget.' },
  { title: 'Complete enrollment', text: 'Review your contract terms, then enroll with confidence.' },
  { title: 'Use the claims process', text: 'Follow the process in your contract when service is needed.' },
];

export default function HomePage() {
  useDocumentHead(PAGE_META.homepage);

  return (
    <>
      <PageHero
        image={IMAGES.heroAuto}
        imageAlt="Black luxury sedan driving along a forest road in soft daylight"
        eyebrow="ACAI Warranty LLC"
        title="Protection That Goes Beyond the Expected."
        description="Explore auto and home warranty protection designed to help you prepare for unexpected repair expenses and protect what matters most."
        primaryCta={{ label: 'Get Your Free Quote', to: '/contact' }}
        secondaryCta={{ label: 'Explore Protection Plans', to: '/protection-plans' }}
        footnote={SITE.tagline}
      />

      <ServiceSplit
        eyebrow="Auto Warranty"
        title="Vehicle protection for the parts that keep you moving."
        description="Vehicle service contracts can help you prepare for eligible mechanical breakdown repairs. Coverage for engine, transmission, drivetrain, suspension, and other eligible systems depends on the plan you select."
        bullets={['Engine and transmission options', 'Drivetrain and suspension plans', 'Pre-paid maintenance planning', 'Plan details confirmed in your contract']}
        image={IMAGES.suvFog}
        imageAlt="Silver SUV parked on a foggy countryside road"
        cta={{ label: 'Explore Auto Warranty', to: '/auto-warranty', variant: 'outline' }}
      />

      <ServiceSplit
        eyebrow="Home Warranty"
        title="Home system and appliance protection for everyday peace of mind."
        description="Home warranty plans are designed for eligible household systems and major appliances. Review the terms that apply to your property before you enroll."
        bullets={['HVAC systems', 'Plumbing systems', 'Electrical systems', 'Major household appliances']}
        image={IMAGES.homeDusk}
        imageAlt="Two-story house with a manicured lawn and garage at dusk"
        cta={{ label: 'Explore Home Warranty', to: '/home-warranty', variant: 'outline' }}
        reverse
      />

      <section className="bg-neutral-50 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-10">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Why consider protection"
              title="Plan ahead for the repairs you cannot predict."
              description="Warranty protection is a way to prepare for repair costs that arrive without warning. It is one option to weigh alongside your budget and needs."
            />
            <ButtonLink to="/how-it-works" variant="ghost" className="mt-8">
              See how it works
            </ButtonLink>
          </div>
          <div className="lg:col-span-7">
            <ul className="divide-y divide-neutral-200 border-y border-neutral-200 bg-white">
              {WHY_POINTS.map((point, index) => (
                <li key={point.title} className="grid gap-4 py-8 sm:grid-cols-[64px_1fr] sm:gap-6">
                  <span className="font-display text-3xl font-bold text-primary-200" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <div>
                    <h3>{point.title}</h3>
                    <p className="mt-2 text-[16px] text-neutral-600">{point.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Automotive protection plans"
            title="Four ways to protect your drive."
            description="Each plan is described in general terms. Confirm the specific coverage in the contract before you enroll."
          />
          <ButtonLink to="/protection-plans" variant="outline">
            Compare all plans
          </ButtonLink>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PROTECTION_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      <section className="bg-primary-900 py-20 text-white lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div className="relative overflow-hidden rounded-lg shadow-elevated">
            <img
              src={IMAGES.kitchenModern}
              alt="Bright modern kitchen with clean cabinetry and built-in appliances"
              width={2000}
              height={1300}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-accent-300">Home protection spotlight</p>
            <h2 className="text-white">Keep your home systems and appliances in view.</h2>
            <p className="mt-6 text-[17px] text-neutral-200">
              From heating and cooling to the kitchen appliances you use every day, home warranty protection can help you
              prepare for eligible breakdown repairs. Terms vary, so review your contract for specific coverage.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {['HVAC, plumbing, and electrical', 'Refrigerators, ranges, and dishwashers'].map((label) => (
                <li key={label} className="flex items-start gap-3 rounded-lg border border-white/15 bg-white/5 p-4 text-[15px]">
                  <ShieldCheck size={20} className="mt-0.5 shrink-0 text-accent-300" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
            <ButtonLink to="/home-warranty" variant="light" size="lg" className="mt-10">
              Explore Home Warranty
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <SectionHeading
          eyebrow="How it works"
          title="A simple path from quote to protection."
          description="Five steps, from your first question to using your contract when service is needed."
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-5">
          {HOW_STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-4 bg-white p-7">
              <span className="font-display text-sm font-bold text-secondary-600">0{index + 1}</span>
              <h3 className="text-lg">{step.title}</h3>
              <p className="text-[15px] text-neutral-600">{step.text}</p>
            </li>
          ))}
        </ol>
        <ButtonLink to="/how-it-works" variant="ghost" className="mt-8">
          Read the full process
        </ButtonLink>
      </section>

      <CtaBanner
        image={IMAGES.homeBrick}
        imageAlt="Residential street with brick homes and landscaped lawns at dusk"
        title="The Right Protection Starts With a Conversation."
        description="Tell us what you would like to protect and we will help you explore the options that fit your situation."
        cta={{ label: 'Get Your Free Quote', to: '/contact' }}
      />
    </>
  );
}
