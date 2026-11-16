import type { QuoteFormErrors, QuoteFormValues } from '@/types/quote';
import { EMAIL_PATTERN, MIN_YEAR, PROPERTY_TYPES, SYSTEM_OPTIONS, isPlanId, normalizePhone } from '../../supabase/functions/_shared/quote';
export { normalizePhone } from '../../supabase/functions/_shared/quote';

export function validateQuoteForm(values: QuoteFormValues): QuoteFormErrors {
  const errors: QuoteFormErrors = {};

  if (values.fullName.trim().length < 2 || values.fullName.trim().length > 150) {
    errors.fullName = 'Enter your full name (2–150 characters).';
  }

  if (!EMAIL_PATTERN.test(values.email.trim()) || values.email.trim().length > 254) {
    errors.email = 'Enter an email address in the format name@example.com.';
  }

  if (normalizePhone(values.phone).length !== 10 || values.phone.trim().length > 30) {
    errors.phone = 'Enter a 10-digit US phone number, such as (202) 555-0147.';
  }

  if (values.serviceType !== 'auto' && values.serviceType !== 'home') {
    errors.serviceType = 'Choose the type of protection you are interested in.';
  }

  if (values.selectedPlan && (values.serviceType !== 'auto' || !isPlanId(values.selectedPlan))) {
    errors.serviceType = 'Choose a valid protection type and plan.';
  }

  if (values.serviceType === 'auto') {
    if (!values.vehicleMake.trim() || values.vehicleMake.trim().length > 100) errors.vehicleMake = 'Enter the vehicle make (up to 100 characters).';
    if (!values.vehicleModel.trim() || values.vehicleModel.trim().length > 100) errors.vehicleModel = 'Enter the vehicle model (up to 100 characters).';

    const year = Number(values.vehicleYear);
    const MAX_YEAR = new Date().getFullYear() + 1;
    if (!values.vehicleYear.trim() || !Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
      errors.vehicleYear = `Enter a model year between ${MIN_YEAR} and ${MAX_YEAR}.`;
    }

    if (values.vehicleMileage.trim()) {
      const mileage = Number(values.vehicleMileage);
      if (!Number.isInteger(mileage) || mileage < 0 || mileage > 999999) {
        errors.vehicleMileage = 'Enter mileage as a whole number up to 999,999.';
      }
    }
  }

  if (values.serviceType === 'home') {
    if (!/^\d{5}$/.test(values.propertyZip.trim())) {
      errors.propertyZip = 'Enter a 5-digit US ZIP code.';
    }
    if (values.propertyType && !PROPERTY_TYPES.some((type) => type === values.propertyType)) {
      errors.propertyType = 'Choose a valid property type.';
    }
    if (values.systemsOfInterest.length > SYSTEM_OPTIONS.length ||
      !values.systemsOfInterest.every((system) => SYSTEM_OPTIONS.some((option) => option === system))) {
      errors.systemsOfInterest = 'Choose valid systems or appliances.';
    }
  }

  if (values.message.trim().length > 1000) errors.message = 'Keep your message within 1,000 characters.';

  if (!values.consentToContact) {
    errors.consentToContact = 'Please confirm consent so we can respond to your request.';
  }

  return errors;
}
