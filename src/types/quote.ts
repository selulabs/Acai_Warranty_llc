import type { PlanId, ServiceType } from '../../supabase/functions/_shared/quote';
export type { PlanId, ServiceType, QuoteRequestPayload } from '../../supabase/functions/_shared/quote';

export interface QuoteFormValues {
  fullName: string;
  email: string;
  phone: string;
  serviceType: ServiceType | '';
  selectedPlan: PlanId | '';
  website: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleMileage: string;
  propertyZip: string;
  propertyType: string;
  systemsOfInterest: string[];
  message: string;
  consentToContact: boolean;
}

export type QuoteFormErrors = Partial<Record<keyof QuoteFormValues, string>>;

export interface QuoteSubmissionResult {
  success: true;
}
