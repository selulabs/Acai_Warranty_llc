import CtaBanner from '@/components/sections/CtaBanner';
import PageHero from '@/components/sections/PageHero';
import ServiceSplit from '@/components/sections/ServiceSplit';
import { ButtonLink } from '@/components/ui/Button';
import SectionHeading from '@/components/ui/SectionHeading';
import { IMAGES } from '@/data/images';
import { SITE } from '@/data/site';
import { PAGE_META, useDocumentHead } from '@/lib/seo';

const PILLARS = [
  {
    title: 'Clarity',
    text: 'We explain plan categories, terms, and exclusions in plain language so you know what you are considering.',
  },
  {
    title: 'Customer-focused guidance',
    text: 'Our approach starts with your vehicle or home and your priorities, not with a one-size-fits-all package.',
  },
  {
    title: 'Protection options suited to you',
    text: 'We aim to help you compare options that fit your situation, with terms you can review before enrolling.',
  },
];

export default function AboutPage() {
  useDocumentHead(PAGE_META.about);

  return (
    <>
      <PageHero
        image={IMAGES.tuscanyRoom}
        imageAlt="Elegant living room with classic furniture and warm light"
        eyebrow="About Us"
        title="Protection Rooted in Confidence."
        description="ACAI Warranty LLC is focused on helping American customers explore auto and home warranty protection options with clarity and confidence."
        primaryCta={{ label: 'Talk to Us', to: '/contact' }}
        secondaryCta={{ label: 'Our Services', to: '/auto-warranty' }}
        imagePosition="center 40%"
      />

      <ServiceSplit
        eyebrow="Who we are"
        title="A warranty protection business built around straightforward guidance."
        description={[
          `${SITE.name} is a business focused on auto and home protection solutions. We help drivers and homeowners understand the warranty protection options available to them.`,
          'We believe a good protection decision starts with understanding the contract, so our role is to make the options easier to review and compare.',
        ]}
        image={IMAGES.sedanPair}
        imageAlt="Two luxury sedans parked in front of a mountain sunset"
      />

      <section className="bg-neutral-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Our approach"
            title="Three principles guide how we work with customers."
            description="These describe the approach we intend to bring to every conversation, not historical results."
          />
          <ol className="mt-14 grid gap-10 md:grid-cols-3">
            {PILLARS.map((pillar, index) => (
              <li key={pillar.title} className="border-t-2 border-secondary-500 pt-6">
                <span className="font-display text-sm font-bold text-primary-600">0{index + 1}</span>
                <h3 className="mt-3">{pillar.title}</h3>
                <p className="mt-3 text-[16px] text-neutral-600">{pillar.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <SectionHeading eyebrow="Our services" title="Two areas of protection, one clear process." />
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {[
            {
              title: 'Auto Warranty',
              text: 'Vehicle service contract options for eligible mechanical breakdown repairs, plus routine maintenance planning.',
              image: IMAGES.suvFog,
              alt: 'Silver SUV parked on a foggy countryside road',
              to: '/auto-warranty',
            },
            {
              title: 'Home Warranty',
              text: 'Home warranty options for eligible HVAC, plumbing, electrical systems, and major appliances.',
              image: IMAGES.homeDusk,
              alt: 'Two-story house with a manicured lawn at dusk',
              to: '/home-warranty',
            },
          ].map((service) => (
            <article key={service.title} className="group relative overflow-hidden rounded-lg">
              <img
                src={service.image}
                alt={service.alt}
                width={2000}
                height={1300}
                loading="lazy"
                decoding="async"
                className="aspect-[16/11] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/40 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <h3 className="text-white">{service.title}</h3>
                <p className="mt-2 max-w-md text-[15px] text-neutral-100">{service.text}</p>
                <ButtonLink to={service.to} variant="ghost" className="mt-4 !text-white hover:!text-accent-200">
                  Explore {service.title}
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Our commitment" title="Clear terms. Honest conversations." />
          </div>
          <p className="text-[17px] text-neutral-600 lg:col-span-7">
            We commit to presenting protection options accurately, pointing you to the contract for final coverage, and making
            it easy to ask questions before you decide. We will not overstate what a plan does or promise outcomes that the
            contract does not state.
          </p>
        </div>
      </section>

      <CtaBanner
        image={IMAGES.suvFog}
        imageAlt="Silver SUV on a foggy countryside road"
        title="Let's talk about what you want to protect."
        description="Reach out with your questions or start a free quote request. We are happy to walk through the options with you."
        cta={{ label: 'Contact Us', to: '/contact' }}
      />
    </>
  );
}
