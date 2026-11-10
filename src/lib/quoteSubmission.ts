import type { QuoteFormValues, QuoteRequestPayload, QuoteSubmissionResult } from '@/types/quote';
import { normalizePhone } from '@/lib/validation';

export function buildQuotePayload(values: QuoteFormValues): QuoteRequestPayload {
  const isAuto = values.serviceType === 'auto';
  const mileage = values.vehicleMileage.trim();
  const propertyType = values.propertyType.trim();

  return {
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    phone: normalizePhone(values.phone),
    serviceType: values.serviceType === 'home' ? 'home' : 'auto',
    vehicle: isAuto
      ? {
          make: values.vehicleMake.trim(),
          model: values.vehicleModel.trim(),
          year: Number(values.vehicleYear),
          mileage: mileage ? Number(mileage) : null,
        }
      : null,
    property: isAuto
      ? null
      : {
          zip: values.propertyZip.trim(),
          type: propertyType || null,
          systemsOfInterest: values.systemsOfInterest,
        },
    message: values.message.trim() || null,
    consentToContact: true,
    submittedAt: new Date().toISOString(),
  };
}

/**
 * Frontend-only preview: nothing is sent and nothing is stored.
 *
 * Future Supabase integration goes here. Replace the body with an insert into
 * your quote requests table (e.g. supabase.from('quote_requests').insert(payload))
 * and keep this signature so QuoteRequestForm does not need to change.
 */
export async function submitQuoteRequest(payload: QuoteRequestPayload): Promise<QuoteSubmissionResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return { mode: 'preview', payload };
}
