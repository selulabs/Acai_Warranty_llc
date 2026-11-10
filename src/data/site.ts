export const SITE = {
  name: 'ACAI Warranty LLC',
  shortName: 'ACAI Warranty',
  url: 'https://acaiwarranty.com',
  email: 'info@acaiwarranty.com',
  // Placeholder number: not a verified customer-support line. Replace before launch.
  phoneDisplay: '(202) 555-0147',
  phoneHref: 'tel:+12025550147',
  location: 'United States',
  tagline: 'Auto & Home Protection Solutions',
  description:
    'ACAI Warranty LLC helps American drivers and homeowners explore auto and home warranty protection options with clarity and confidence.',
} as const;

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Auto Warranty', to: '/auto-warranty' },
  { label: 'Home Warranty', to: '/home-warranty' },
  { label: 'Protection Plans', to: '/protection-plans' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const;

export const FOOTER_GROUPS = [
  {
    title: 'Services',
    links: [
      { label: 'Auto Warranty', to: '/auto-warranty' },
      { label: 'Home Warranty', to: '/home-warranty' },
      { label: 'Protection Plans', to: '/protection-plans' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & Conditions', to: '/terms-and-conditions' },
    ],
  },
] as const;
