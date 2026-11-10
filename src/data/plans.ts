import { IMAGES } from '@/data/images';

export interface ProtectionPlan {
  id: 'platinum' | 'gold' | 'powertrain' | 'pre-paid-maintenance';
  name: string;
  positioning: string;
  summary: string;
  categories: string[];
  image: string;
  imageAlt: string;
  category: 'breakdown' | 'maintenance';
}

export const PROTECTION_PLANS: ProtectionPlan[] = [
  {
    id: 'platinum',
    name: 'Platinum',
    positioning: 'Comprehensive coverage option',
    summary:
      'Our most comprehensive vehicle service contract, designed for drivers who want broad mechanical and electrical system protection. Plan details are subject to your contract.',
    categories: ['Engine', 'Transmission', 'Electrical systems', 'Air conditioning', 'Other eligible components'],
    image: IMAGES.sedanRoad,
    imageAlt: 'Black luxury sedan driving along a tree-lined country road',
    category: 'breakdown',
  },
  {
    id: 'gold',
    name: 'Gold',
    positioning: 'Balanced vehicle protection',
    summary:
      'A well-rounded option that balances core mechanical protection with suspension coverage for everyday driving.',
    categories: ['Engine', 'Transmission', 'Suspension'],
    image: IMAGES.mechanicLift,
    imageAlt: 'Mechanic lifting a car engine in a well-lit repair shop',
    category: 'breakdown',
  },
  {
    id: 'powertrain',
    name: 'Powertrain',
    positioning: 'Essential mechanical protection',
    summary:
      'Focused protection for the components that move your vehicle, ideal for drivers who want essential mechanical coverage.',
    categories: ['Engine', 'Transmission', 'Drivetrain'],
    image: IMAGES.engineDetail,
    imageAlt: 'Close-up of a car engine showing mechanical components',
    category: 'breakdown',
  },
  {
    id: 'pre-paid-maintenance',
    name: 'Pre-Paid Maintenance',
    positioning: 'Routine maintenance planning',
    summary:
      'A maintenance plan for planned service. It is a separate service category and does not provide mechanical breakdown protection.',
    categories: ['Oil changes', 'Filter replacement', 'Eligible scheduled maintenance'],
    image: IMAGES.mechanicHands,
    imageAlt: 'Mechanic performing routine maintenance with hands and engine components in view',
    category: 'maintenance',
  },
];

export type ComparisonValue = 'included' | 'confirm' | 'not-applicable';

export const COMPARISON_ROWS: { label: string; values: ComparisonValue[] }[] = [
  // Order matches PROTECTION_PLANS: Platinum, Gold, Powertrain, Pre-Paid Maintenance
  { label: 'Engine', values: ['included', 'included', 'included', 'not-applicable'] },
  { label: 'Transmission', values: ['included', 'included', 'included', 'not-applicable'] },
  { label: 'Drivetrain', values: ['confirm', 'confirm', 'included', 'not-applicable'] },
  { label: 'Suspension', values: ['confirm', 'included', 'confirm', 'not-applicable'] },
  { label: 'Electrical systems', values: ['included', 'confirm', 'confirm', 'not-applicable'] },
  { label: 'Oil changes & filters', values: ['not-applicable', 'not-applicable', 'not-applicable', 'included'] },
];
