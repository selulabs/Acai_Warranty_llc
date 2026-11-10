import CtaBanner from '@/components/sections/CtaBanner';
import PageHero from '@/components/sections/PageHero';
import ServiceSplit from '@/components/sections/ServiceSplit';
import Accordion from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import SectionHeading from '@/components/ui/SectionHeading';
import { IMAGES } from '@/data/images';
import { PAGE_META, useDocumentHead } from '@/lib/seo';

const HOME_SYSTEMS = [
  {
    name: 'HVAC',
    image: IMAGES.hvacRepair,
    alt: 'Technician repairing an outdoor air conditioning unit on a building wall',
    text: 'Heating and cooling components that may be eligible under your plan, including systems that keep your home comfortable through changing seasons.',
  },
  {
    name: 'Plumbing',
    image: IMAGES.plumbing,
    alt: 'Plumber working on pipes with specialized tools',
    text: 'Eligible plumbing components such as supply and drain lines, depending on the plan and the terms of your contract.',
  },
  {
    name: 'Electrical',
    image: IMAGES.electrical,
    alt: 'Electrician examining a residential electrical panel',
    text: 'Selected electrical components that some plans may include. Specific coverage is listed in your contract.',
  },
];

const APPLIANCES = ['Refrigerators', 'Ovens and ranges', 'Dishwashers', 'Washers and dryers', 'Other potentially eligible appliances'];

const HOME_STEPS = [
  { title: 'Request a quote', text: 'Share your ZIP code, property type, and the systems you want to explore.' },
  { title: 'Review the available terms', text: 'We walk through plan options and what each contract includes.' },
  { title: 'Choose an appropriate plan', text: 'Select the plan that matches your household and priorities.' },
  { title: 'Complete enrollment', text: 'Review and accept the contract before your protection begins.' },
  { title: 'Follow the service request process', text: 'Use the steps in your contract when a covered item needs service.' },
];

const FAQS = [
  {
    question: 'What is a home warranty?',
    answer:
      'A home warranty is a home service contract that may help pay for eligible repairs or replacements of covered household systems and appliances, subject to the terms of your contract.',
  },
  {
    question: 'How is it different from homeowners insurance?',
    answer:
      'Homeowners insurance addresses damage to your home from covered events such as fire or storms. A home warranty is a separate contract focused on the breakdown of covered systems and appliances. It is not a substitute for insurance.',
  },
  {
    question: 'Which systems and appliances may be covered?',
    answer:
      'Plans may address HVAC, plumbing, electrical systems, and selected major appliances. Eligibility depends on the plan and contract. Items listed here are categories only and are not guaranteed to be covered.',
  },
  {
    question: 'Are pre-existing problems covered?',
    answer:
      'Contracts commonly address conditions that exist before enrollment differently. Ask about pre-existing conditions during your quote review and check the exclusions in your contract.',
  },
  {
    question: 'Are service fees involved?',
    answer:
      'Many home service contracts involve a service fee per service request. Any fees, amounts, and payment steps are defined in your contract. We recommend reviewing them before you enroll.',
  },
  {
    question: 'How are service requests handled?',
    answer:
      'Follow the service request steps in your contract. Process timing, authorizations, and repair arrangements are governed by the contract terms.',
  },
];

export default function HomeWarrantyPage() {
  useDocumentHead(PAGE_META.home);

  return (
    <>
      <PageHero
        image={IMAGES.heroHome}
        imageAlt="Elegant suburban home with a driveway at sunset"
        eyebrow="Home Warranty"
        title="Protect Your Home. Preserve Your Peace of Mind."
        description="Explore home warranty protection options for eligible household systems and appliances, helping you prepare for unexpected breakdowns."
        primaryCta={{ label: 'Get Home Warranty Quote', to: '/contact' }}
        secondaryCta={{ label: 'How It Works', to: '/how-it-works' }}
      />

      <ServiceSplit
        eyebrow="The basics"
        title="What is home warranty protection?"
        description={[
          'A home warranty is a home service contract. It may help pay for eligible repairs or replacements of covered systems and appliances when they break down from normal use.',
          'A home warranty is different from homeowners insurance. Insurance addresses damage from covered events, while a home warranty is a separate contract focused on breakdowns of listed systems and appliances.',
        ]}
        image={IMAGES.livingRoom}
        imageAlt="Elegant living room with warm lighting and classic furniture"
      />

      <section className="bg-neutral-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Home systems"
            title="The core systems a home warranty may address."
            description="Coverage for each system depends on your plan and the terms in your contract."
          />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {HOME_SYSTEMS.map((system) => (
              <article key={system.name} className="flex flex-col">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={system.image}
                    alt={system.alt}
                    width={2000}
                    height={1300}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <h3 className="mt-6 border-l-4 border-secondary-500 pl-4">{system.name}</h3>
                <p className="mt-3 text-[16px] text-neutral-600">{system.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ServiceSplit
        eyebrow="Major appliances"
        title="Everyday appliances, illustrated."
        description={[
          'Many plans list major household appliances as potentially eligible items. The categories below are illustrative only and are not guaranteed to be covered.',
          'Your contract specifies which appliances are included, any age or condition limits, and how service is requested.',
        ]}
        bullets={APPLIANCES}
        image={IMAGES.kitchenRound}
        imageAlt="Contemporary kitchen with sleek cabinets and a round dining table"
        reverse
      />

      <ServiceSplit
        eyebrow="Why homeowners explore protection"
        title="Predictable planning for unpredictable repairs."
        description="A breakdown rarely arrives at a convenient time. Exploring protection in advance lets you consider possible repair costs and decide what fits your household, without guaranteeing any outcome."
        bullets={['Plan around possible repair costs', 'Convenient, structured service requests', 'Review terms before you commit', 'Clear contract details in writing']}
        image={IMAGES.diningRoom}
        imageAlt="Dining room with a grand chandelier and classic furniture"
        cta={{ label: 'Request a Home Quote', to: '/contact', variant: 'outline' }}
      />

      <section className="border-y border-neutral-200 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading eyebrow="The process" title="How home protection works" />
          <ol className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            {HOME_STEPS.map((step, index) => (
              <li key={step.title} className="border-t border-neutral-300 pt-6">
                <span className="font-display text-sm font-bold text-secondary-600">Step {index + 1}</span>
                <h3 className="mt-3 text-lg">{step.title}</h3>
                <p className="mt-3 text-[15px] text-neutral-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading eyebrow="Frequently asked" title="Home warranty questions" align="center" />
        <div className="mt-12">
          <Accordion items={FAQS} groupName="home-faq" />
        </div>
        <div className="mt-12 text-center">
          <ButtonLink to="/protection-plans" variant="ghost">
            Looking for vehicle protection instead? View auto plans
          </ButtonLink>
        </div>
      </section>

      <CtaBanner
        image={IMAGES.kitchenWood}
        imageAlt="Stylish kitchen with wooden cabinets and large windows"
        title="Protect the Home You Care About."
        description="Tell us about your property and the systems you want to explore. We will help you review the options that apply."
        cta={{ label: 'Get Home Warranty Quote', to: '/contact' }}
      />
    </>
  );
}
