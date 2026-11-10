export type ServiceType = 'auto' | 'home';

export interface QuoteFormValues {
  fullName: string;
  email: string;
  phone: string;
  serviceType: ServiceType | '';
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

export interface QuoteRequestPayload {
  fullName: string;
  email: string;
  phone: string;
  serviceType: ServiceType;
  vehicle: { make: string; model: string; year: number; mileage: number | null } | null;
  property: { zip: string; type: string | null; systemsOfInterest: string[] } | null;
  message: string | null;
  consentToContact: true;
  submittedAt: string;
}

export interface QuoteSubmissionResult {
  mode: 'preview';
  payload: QuoteRequestPayload;
}
