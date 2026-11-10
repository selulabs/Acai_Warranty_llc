import LegalDocument from '@/components/sections/LegalDocument';
import { PAGE_META, useDocumentHead } from '@/lib/seo';
import { SITE } from '@/data/site';

export default function TermsPage() {
  useDocumentHead(PAGE_META.terms);

  return (
    <LegalDocument
      title="Terms & Conditions"
      intro="These website terms describe how visitors may use this site. They do not form a vehicle service contract or a home service contract. Those agreements are provided separately."
      sections={[
        {
          heading: 'Website information',
          paragraphs: [
            'Content on this site is provided for general information about auto and home warranty protection. It is not an offer, a quote, or a guarantee of coverage.',
          ],
        },
        {
          heading: 'Contracts govern coverage',
          paragraphs: [
            'Coverage, eligibility, exclusions, deductibles, waiting periods, service fees, and benefits vary by plan and contract. The applicable contract determines the final terms.',
          ],
        },
        {
          heading: 'Quote requests',
          paragraphs: [
            '[To be completed: how quote requests are processed, expected response practices, and any limits on use of the contact form.]',
          ],
        },
        {
          heading: 'Limitation of liability and governing law',
          paragraphs: [
            '[To be completed by counsel: limitations of liability, governing law, and dispute resolution for ' + SITE.name + '.]',
          ],
        },
      ]}
    />
  );
}
