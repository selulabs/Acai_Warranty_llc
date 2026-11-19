import type { QuoteFormValues, QuoteRequestPayload, QuoteSubmissionResult } from '@/types/quote';
import { normalizePhone } from '@/lib/validation';

export function buildQuotePayload(values: QuoteFormValues, requestId: string): QuoteRequestPayload {
  if (values.serviceType !== 'auto' && values.serviceType !== 'home') throw new Error('Choose a protection type.');
  const isAuto = values.serviceType === 'auto';
  const mileage = values.vehicleMileage.trim();
  const propertyType = values.propertyType.trim();

  return {
    requestId,
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    phone: normalizePhone(values.phone),
    serviceType: values.serviceType,
    selectedPlan: isAuto ? values.selectedPlan || null : null,
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
    consentToContact: values.consentToContact,
    sourcePath: window.location.pathname,
    website: values.website,
  };
}

export async function submitQuoteRequest(payload: QuoteRequestPayload): Promise<QuoteSubmissionResult> {
  const { getSupabaseClient } = await import('@/lib/supabase');
  const { data, error } = await getSupabaseClient().functions.invoke<QuoteSubmissionResult>('submit-quote', {
    body: payload,
  });
  if (error || data?.success !== true) {
    throw new Error('We could not confirm your request. Please try again or contact us directly.');
  }
  return data;
}
