import { useEffect } from 'react';
import { SITE } from '@/data/site';
import { IMAGES } from '@/data/images';

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}

export const PAGE_META = {
  homepage: {
    title: 'ACAI Warranty LLC | Auto & Home Warranty Protection',
    description:
      'Explore auto and home warranty protection options from ACAI Warranty LLC. Request a free quote and compare plans built for everyday needs.',
    path: '/',
  },
  auto: {
    title: 'Auto Warranty Protection | ACAI Warranty LLC',
    description:
      'Explore vehicle service contract options covering engine, transmission, drivetrain, and other eligible components. Coverage varies by plan.',
    path: '/auto-warranty',
    image: IMAGES.heroAuto,
  },
  home: {
    title: 'Home Warranty Protection | ACAI Warranty LLC',
    description:
      'Explore home warranty protection for eligible HVAC, plumbing, electrical systems, and major appliances. Review terms before you enroll.',
    path: '/home-warranty',
    image: IMAGES.heroHome,
  },
  plans: {
    title: 'Vehicle Protection Plans | ACAI Warranty LLC',
    description:
      'Compare Platinum, Gold, Powertrain, and Pre-Paid Maintenance vehicle protection options and request a free quote.',
    path: '/protection-plans',
    image: IMAGES.sedanRoad,
  },
  howItWorks: {
    title: 'How Warranty Protection Works | ACAI Warranty LLC',
    description:
      'Learn the five steps to explore, enroll in, and use warranty protection from ACAI Warranty LLC, from quote request to claims.',
    path: '/how-it-works',
    image: IMAGES.kitchenWood,
  },
  about: {
    title: 'About ACAI Warranty LLC | Auto & Home Protection',
    description:
      'ACAI Warranty LLC focuses on clear, customer-first guidance for auto and home warranty protection options.',
    path: '/about',
    image: IMAGES.tuscanyRoom,
  },
  contact: {
    title: 'Get a Free Warranty Quote | ACAI Warranty LLC',
    description:
      'Request a free warranty quote from ACAI Warranty LLC. Tell us what you want to protect and we will help you discuss your options.',
    path: '/contact',
    image: IMAGES.sedanPair,
  },
  privacy: {
    title: 'Privacy Policy | ACAI Warranty LLC',
    description: 'How ACAI Warranty LLC handles personal information submitted through this website.',
    path: '/privacy-policy',
    noindex: false,
  },
  terms: {
    title: 'Terms & Conditions | ACAI Warranty LLC',
    description: 'Website terms and conditions for ACAI Warranty LLC. Draft pending business and legal review.',
    path: '/terms-and-conditions',
  },
  notFound: {
    title: 'Page Not Found | ACAI Warranty LLC',
    description: 'The page you are looking for could not be found.',
    path: '/404',
    noindex: true,
  },
} satisfies Record<string, PageMeta>;

const DEFAULT_IMAGE = IMAGES.heroAuto;

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useDocumentHead({ title, description, path, image = DEFAULT_IMAGE, noindex = false }: PageMeta) {
  useEffect(() => {
    const url = `${SITE.url}${path}`;
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:site_name', SITE.name);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertCanonical(url);
  }, [title, description, path, image, noindex]);
}
