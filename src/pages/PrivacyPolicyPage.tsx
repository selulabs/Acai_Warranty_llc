import LegalDocument from '@/components/sections/LegalDocument';
import { PAGE_META, useDocumentHead } from '@/lib/seo';
import { SITE } from '@/data/site';

export default function PrivacyPolicyPage() {
  useDocumentHead(PAGE_META.privacy);

  return (
    <LegalDocument
      title="Privacy Policy"
      sections={[
        {
          heading: 'Who we are',
          paragraphs: [
            `${SITE.name} offers auto and home warranty protection options. This policy explains how we collect and use personal information submitted through this website.`,
          ],
        },
        {
          heading: 'What we collect',
          paragraphs: [
            'The quote form collects your full name, email address, phone number, selected service type (auto or home), selected vehicle protection plan when provided, and consent to be contacted about your quote request.',
            'For auto requests, it collects the vehicle make, model, and model year, plus current mileage if you provide it.',
            'For home requests, it collects the property ZIP code, plus property type and systems or appliances of interest if you provide them.',
            'You may also provide an optional message with your questions or other information about your request.',
            'Alongside your submission, we record a request identifier, the submission page path, the date and time the request is saved, and email notification status, message identifier, and sending time when available. The form also uses a hidden spam-check field; that field is not saved in the quote database or included in notification emails.',
            'If analytics is enabled and you accept analytics cookies, Google Analytics measures page visits, successful quote submissions, and clicks on phone or email links. Our analytics events include the page, service type, or selected plan where relevant; they do not include the contact details, vehicle or property details, or message entered in the quote form.',
          ],
        },
        {
          heading: 'How we use it',
          paragraphs: [
            'We use the details you provide to respond to quote requests, explain plan options, and arrange enrollment or service.',
            'Submissions are stored in our database using Supabase. Our submission function then uses Resend to send us an email notification containing your request details. If the email notification fails, your saved request remains in the database.',
            'When analytics is enabled, we use Google Analytics with your permission to understand website use and improve the site. You can reject analytics and still use the website and quote form.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            `You can ask to access, correct, or delete your personal information by contacting ${SITE.name} at ${SITE.email}.`,
            'When analytics is enabled, use Privacy preferences in the footer to change your analytics choice. We remember this preference in your browser for up to six months. Withdrawing consent stops analytics for that browser and clears the analytics cookies accessible to this website; it does not automatically delete information already received by Google.',
          ],
        },
      ]}
    />
  );
}
