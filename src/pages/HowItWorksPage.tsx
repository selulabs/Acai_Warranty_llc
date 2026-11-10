import CtaBanner from '@/components/sections/CtaBanner';
import PageHero from '@/components/sections/PageHero';
import ServiceSplit from '@/components/sections/ServiceSplit';
import Accordion from '@/components/ui/Accordion';
import SectionHeading from '@/components/ui/SectionHeading';
import { IMAGES } from '@/data/images';
import { PAGE_META, useDocumentHead } from '@/lib/seo';

const STEPS = [
  {
    number: '01',
    title: 'Request Your Quote',
    text: 'Complete a short inquiry with your vehicle details or home protection needs.',
    image: IMAGES.suvDesert,
    alt: 'White SUV on a winding desert road',
  },
  {
    number: '02',
    title: 'Explore Your Options',
    text: 'Review available plans and discuss the coverage that fits your requirements.',
    image: IMAGES.mechanicRepair,
    alt: 'Mechanic inspecting a vehicle engine in a repair shop',
  },
  {
    number: '03',
    title: 'Complete Enrollment',
    text: 'Choose an available plan and review the contract terms before enrollment.',
    image: IMAGES.kitchenModern,
    alt: 'Bright modern kitchen with clean cabinetry',
  },
  {
    number: '04',
    title: 'Request Service When Needed',
    text: 'Follow the instructions in the applicable service contract to request assistance for an eligible problem.',
    image: IMAGES.hvacInspect,
    alt: 'Technician inspecting an outdoor HVAC unit',
  },
  {
    number: '05',
    title: 'Complete the Claims Process',
    text: 'Repairs, authorizations, payment, or reimbursements are handled according to the actual contract terms.',
    image: IMAGES.engineBelts,
    alt: 'Close-up of car engine belts and components',
  },
];

const PREPARE = [
  'Your vehicle year, make, model, and current mileage, or your home ZIP code and property type',
  'A list of the systems or appliances you want to explore',
  'Any questions about the terms you want to review before enrolling',
];

const FAQS = [
  {
    question: 'How long does the quote process take?',
    answer:
      'Timing depends on the details of your request. We do not promise a specific response time until it is confirmed for ACAI Warranty LLC.',
  },
  {
    question: 'Will my coverage start immediately?',
    answer:
      'Activation timing is defined in your contract. Review the effective date and any waiting periods before you enroll.',
  },
  {
    question: 'Do I choose my own repair shop?',
    answer:
      'Repair arrangements depend on the contract you select. Check the service instructions in your contract for how repair facilities are chosen.',
  },
  {
    question: 'What should I review before enrolling?',
    answer:
      'Review covered categories, exclusions, limitations, waiting periods, deductibles, and service fees. These details are set by the contract.',
  },
];

export default function HowItWorksPage() {
  useDocumentHead(PAGE_META.howItWorks);

  return (
    <>
      <PageHero
        image={IMAGES.homeBrick}
        imageAlt="Residential street with brick homes and landscaped lawns"
        eyebrow="How It Works"
        title="Getting Protected Should Be Simple."
        description="Five clear steps take you from your first question to using your contract when service is needed."
        primaryCta={{ label: 'Start Your Quote', to: '/contact' }}
        secondaryCta={{ label: 'View Protection Plans', to: '/protection-plans' }}
      />

      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 lg:px-10 lg:pt-28">
        <SectionHeading
          eyebrow="The process"
          title="From quote request to claims, step by step."
          description="The process is the same for auto and home protection. Specific terms for each contract are set in writing before you enroll."
        />
      </section>

      {STEPS.map((step, index) => (
        <ServiceSplit
          key={step.number}
          eyebrow={`Step ${step.number}`}
          title={step.title}
          description={step.text}
          image={step.image}
          imageAlt={step.alt}
          reverse={index % 2 === 1}
        />
      ))}

      <section className="bg-neutral-50 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div>
            <SectionHeading eyebrow="Before you start" title="What to prepare before requesting a quote." />
            <ul className="mt-10 space-y-5">
              {PREPARE.map((item) => (
                <li key={item} className="flex gap-4 border-b border-neutral-200 pb-5 text-[16px] text-neutral-700">
                  <span className="font-display font-bold text-secondary-600" aria-hidden="true">
                    /
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-10">
            <div>
              <h3>Understanding your selected coverage</h3>
              <p className="mt-3 text-[16px] text-neutral-600">
                Your contract is the final word on what is covered. Read the covered categories and how each one is described
                before you choose a plan.
              </p>
            </div>
            <div>
              <h3>Reviewing exclusions, waiting periods, and fees</h3>
              <p className="mt-3 text-[16px] text-neutral-600">
                Exclusions, waiting periods, deductibles, and service fees vary by contract. Ask us to walk through them
                before you enroll so nothing is a surprise later.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading eyebrow="Frequently asked" title="How it works questions" align="center" />
        <div className="mt-12">
          <Accordion items={FAQS} groupName="process-faq" />
        </div>
      </section>

      <CtaBanner
        image={IMAGES.livingRoom}
        imageAlt="Elegant living room with warm lighting"
        title="Start With a Simple Conversation."
        description="Share a few details and we will help you understand the next step, with no obligation to enroll."
        cta={{ label: 'Get Your Free Quote', to: '/contact' }}
      />
    </>
  );
}
