export const PLAN_IDS = ['platinum', 'gold', 'powertrain', 'pre-paid-maintenance'] as const;
export type PlanId = (typeof PLAN_IDS)[number];
export type ServiceType = 'auto' | 'home';

export const SYSTEM_OPTIONS = [
  'HVAC system', 'Plumbing', 'Electrical', 'Refrigerator',
  'Oven or range', 'Dishwasher', 'Washer and dryer', 'Other',
] as const;
export const PROPERTY_TYPES = ['Single-family home', 'Townhouse', 'Condominium', 'Multi-family', 'Other'] as const;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MIN_YEAR = 1980;

export interface QuoteRequestPayload {
  requestId: string;
  fullName: string;
  email: string;
  phone: string;
  serviceType: ServiceType;
  selectedPlan: PlanId | null;
  vehicle: { make: string; model: string; year: number; mileage: number | null } | null;
  property: { zip: string; type: string | null; systemsOfInterest: string[] } | null;
  message: string | null;
  consentToContact: boolean;
  sourcePath: string;
  website: string;
}

export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
}

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === 'string' && PLAN_IDS.some((id) => id === value);
}

export function getQuotePreselection(service: string | null, plan: string | null): {
  serviceType: ServiceType | '';
  selectedPlan: PlanId | '';
} {
  const serviceType = service === 'auto' || service === 'home' ? service : '';
  const selectedPlan = serviceType !== 'home' && isPlanId(plan) ? plan : '';
  return { serviceType: selectedPlan ? 'auto' as const : serviceType, selectedPlan };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown, min: number, max: number): string {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
    throw new Error('Invalid field.');
  }
  return value.trim();
}

/** Validate untrusted JSON independently of all browser validation. */
export function parseQuoteRequest(input: unknown): QuoteRequestPayload {
  if (!isRecord(input)) throw new Error('Invalid request.');
  const requestId = text(input.requestId, 36, 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
    throw new Error('Invalid request ID.');
  }
  const fullName = text(input.fullName, 2, 150);
  const email = text(input.email, 3, 254);
  if (!EMAIL_PATTERN.test(email)) throw new Error('Invalid email.');
  const phone = normalizePhone(text(input.phone, 10, 30));
  if (!/^\d{10}$/.test(phone)) throw new Error('Invalid phone.');
  if (input.serviceType !== 'auto' && input.serviceType !== 'home') throw new Error('Invalid service.');
  const serviceType = input.serviceType;
  const selectedPlan = input.selectedPlan == null ? null : input.selectedPlan;
  if (selectedPlan !== null && (!isPlanId(selectedPlan) || serviceType !== 'auto')) {
    throw new Error('Invalid plan.');
  }
  if (input.consentToContact !== true) throw new Error('Consent is required.');
  const message = input.message == null ? null : text(input.message, 0, 1000) || null;
  const sourcePath = text(input.sourcePath, 1, 200);
  if (!/^\/(?!\/)[^?#\s]*$/.test(sourcePath)) throw new Error('Invalid source path.');
  const website = text(input.website, 0, 200);
  if (website) throw new Error('Invalid request.');

  let vehicle: QuoteRequestPayload['vehicle'] = null;
  let property: QuoteRequestPayload['property'] = null;
  if (serviceType === 'auto') {
    if (!isRecord(input.vehicle) || input.property != null) throw new Error('Invalid vehicle.');
    const { year, mileage } = input.vehicle;
    if (typeof year !== 'number' || !Number.isInteger(year) || year < MIN_YEAR || year > new Date().getFullYear() + 1) {
      throw new Error('Invalid vehicle year.');
    }
    if (mileage !== null && (typeof mileage !== 'number' || !Number.isInteger(mileage) || mileage < 0 || mileage > 999999)) {
      throw new Error('Invalid mileage.');
    }
    vehicle = { make: text(input.vehicle.make, 1, 100), model: text(input.vehicle.model, 1, 100), year, mileage };
  } else {
    if (!isRecord(input.property) || input.vehicle != null) throw new Error('Invalid property.');
    const zip = text(input.property.zip, 5, 5);
    if (!/^\d{5}$/.test(zip)) throw new Error('Invalid ZIP.');
    const type = input.property.type == null ? null : text(input.property.type, 1, 100);
    if (type !== null && !PROPERTY_TYPES.some((option) => option === type)) throw new Error('Invalid property type.');
    const systems = input.property.systemsOfInterest;
    if (!Array.isArray(systems) || systems.length > SYSTEM_OPTIONS.length ||
      !systems.every((item) => SYSTEM_OPTIONS.some((option) => option === item)) ||
      new Set(systems).size !== systems.length) throw new Error('Invalid systems.');
    property = { zip, type, systemsOfInterest: systems };
  }
  return { requestId, fullName, email, phone, serviceType, selectedPlan, vehicle, property,
    message, consentToContact: true, sourcePath, website };
}
