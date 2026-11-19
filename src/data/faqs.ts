export const AUTO_FAQS = [
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

export const HOME_FAQS = [
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

export const PROCESS_FAQS = [
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

export const PLAN_FAQS = [
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

export const FAQS_BY_PATH: Record<string, { question: string; answer: string }[]> = {
  '/auto-warranty': AUTO_FAQS,
  '/home-warranty': HOME_FAQS,
  '/how-it-works': PROCESS_FAQS,
  '/protection-plans': PLAN_FAQS,
};
