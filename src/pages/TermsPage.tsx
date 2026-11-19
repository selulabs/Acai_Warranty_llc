import LegalDocument from '@/components/sections/LegalDocument';
import { PAGE_META, useDocumentHead } from '@/lib/seo';
import { SITE } from '@/data/site';

export default function TermsPage() {
  useDocumentHead(PAGE_META.terms);

  return (
    <LegalDocument
      title="Terms & Conditions"
      sections={[
        {
          heading: 'About these terms',
          paragraphs: [
            `By using ${SITE.url}, you agree to these terms. Please read them before submitting a quote request.`,
          ],
        },
        {
          heading: 'Quote requests',
          paragraphs: [
            'Submitting a quote request is not a purchase, enrollment, or contract. Our team follows up by phone or email to discuss your request and plan options. Coverage begins only as provided in the actual agreement, including any applicable effective date and waiting periods.',
            'Any prices or plan details shown on this website or discussed during a quote inquiry are for general guidance. Final pricing and terms are confirmed in the contract before enrollment.',
          ],
        },
        {
          heading: 'Accuracy of information',
          paragraphs: [
            'You must provide accurate contact, vehicle, and property details, as applicable to your request, so that quotes and eligibility checks are based on correct information.',
          ],
        },
        {
          heading: 'Limitation of liability',
          paragraphs: [
            'Website information is for general guidance only. Coverage, eligibility, exclusions, deductibles, waiting periods, fees, and benefits are set by the actual plan and contract.',
            `${SITE.name} is not responsible for decisions made by relying on website content alone. Review the actual agreement before deciding whether to enroll.`,
          ],
        },
      ]}
    />
  );
}
