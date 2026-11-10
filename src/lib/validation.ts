import type { QuoteFormErrors, QuoteFormValues } from '@/types/quote';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_YEAR = new Date().getFullYear() + 1;
const MIN_YEAR = 1980;

export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
}

export function validateQuoteForm(values: QuoteFormValues): QuoteFormErrors {
  const errors: QuoteFormErrors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = 'Enter your full name.';
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter an email address in the format name@example.com.';
  }

  if (normalizePhone(values.phone).length !== 10) {
    errors.phone = 'Enter a 10-digit US phone number, such as (202) 555-0147.';
  }

  if (!values.serviceType) {
    errors.serviceType = 'Choose the type of protection you are interested in.';
  }

  if (values.serviceType === 'auto') {
    if (!values.vehicleMake.trim()) errors.vehicleMake = 'Enter the vehicle make.';
    if (!values.vehicleModel.trim()) errors.vehicleModel = 'Enter the vehicle model.';

    const year = Number(values.vehicleYear);
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
  }

  if (!values.consentToContact) {
    errors.consentToContact = 'Please confirm consent so we can respond to your request.';
  }

  return errors;
}
