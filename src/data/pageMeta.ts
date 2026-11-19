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
  },
  home: {
    title: 'Home Warranty Protection | ACAI Warranty LLC',
    description:
      'Explore home warranty protection for eligible HVAC, plumbing, electrical systems, and major appliances. Review terms before you enroll.',
    path: '/home-warranty',
  },
  plans: {
    title: 'Vehicle Protection Plans | ACAI Warranty LLC',
    description:
      'Compare Platinum, Gold, Powertrain, and Pre-Paid Maintenance vehicle protection options and request a free quote.',
    path: '/protection-plans',
  },
  howItWorks: {
    title: 'How Warranty Protection Works | ACAI Warranty LLC',
    description:
      'Learn the five steps to explore, enroll in, and use warranty protection from ACAI Warranty LLC, from quote request to claims.',
    path: '/how-it-works',
  },
  about: {
    title: 'About ACAI Warranty LLC | Auto & Home Protection',
    description:
      'ACAI Warranty LLC focuses on clear, customer-first guidance for auto and home warranty protection options.',
    path: '/about',
  },
  contact: {
    title: 'Get a Free Warranty Quote | ACAI Warranty LLC',
    description:
      'Request a free warranty quote from ACAI Warranty LLC. Tell us what you want to protect and we will help you discuss your options.',
    path: '/contact',
  },
  privacy: {
    title: 'Privacy Policy | ACAI Warranty LLC',
    description: 'How ACAI Warranty LLC handles personal information submitted through this website.',
    path: '/privacy-policy',
    noindex: false,
  },
  terms: {
    title: 'Terms & Conditions | ACAI Warranty LLC',
    description: 'Read the ACAI Warranty LLC website terms covering quote requests, accurate information, and the role of plan contracts.',
    path: '/terms-and-conditions',
  },
  notFound: {
    title: 'Page Not Found | ACAI Warranty LLC',
    description: 'The page you are looking for could not be found.',
    path: '/404',
    noindex: true,
  },
} satisfies Record<string, PageMeta>;


export const INDEXABLE_PAGES = Object.values(PAGE_META).filter((page) => !('noindex' in page && page.noindex));

// Actual content/metadata update dates. Update affected entries when publishing
// substantive changes; never advance these merely because a build/deploy runs.
export const PAGE_CONTENT_DATES: Record<string, string> = {
  '/': '2026-11-19',
  '/auto-warranty': '2026-11-19',
  '/home-warranty': '2026-11-19',
  '/protection-plans': '2026-11-19',
  '/how-it-works': '2026-11-19',
  '/about': '2026-11-19',
  '/contact': '2026-11-19',
  '/privacy-policy': '2026-11-19',
  '/terms-and-conditions': '2026-11-19',
};

export function getPageMeta(path: string): PageMeta {
  return Object.values(PAGE_META).find((page) => page.path === path.replace(/\/$/, '') || (path === '/' && page.path === '/')) ?? PAGE_META.notFound;
}
