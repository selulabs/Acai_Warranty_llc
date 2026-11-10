import LegalDocument from '@/components/sections/LegalDocument';
import { PAGE_META, useDocumentHead } from '@/lib/seo';
import { SITE } from '@/data/site';

export default function PrivacyPolicyPage() {
  useDocumentHead(PAGE_META.privacy);

  return (
    <LegalDocument
      title="Privacy Policy"
      intro={`This page describes, in general terms, how ${SITE.name} may handle personal information submitted through this website. It must be finalized by the business and reviewed by counsel before it is relied upon.`}
      sections={[
        {
          heading: 'Information you provide',
          paragraphs: [
            'If you request a quote, you may provide your name, email address, phone number, and details about the vehicle or property you want to protect. You control what you share.',
          ],
        },
        {
          heading: 'How information is used',
          paragraphs: [
            'Information submitted through a quote request is intended to respond to your request and discuss protection options. Final handling practices must be confirmed by ACAI Warranty LLC before launch.',
          ],
        },
        {
          heading: 'Sharing and retention',
          paragraphs: [
            '[To be completed: categories of third parties, if any, that receive information, and how long records are kept.]',
          ],
        },
        {
          heading: 'Your choices and contact',
          paragraphs: [
            `To ask a question about this policy, contact ${SITE.name} at ${SITE.email}.`,
          ],
        },
      ]}
    />
  );
}
