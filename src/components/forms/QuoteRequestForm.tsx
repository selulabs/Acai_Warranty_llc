import { useRef, useState, type FormEvent } from 'react';
import { CircleCheck, LoaderCircle } from 'lucide-react';
import FormField, { inputClass } from '@/components/forms/FormField';
import { Button } from '@/components/ui/Button';
import { buildQuotePayload, submitQuoteRequest } from '@/lib/quoteSubmission';
import { validateQuoteForm } from '@/lib/validation';
import type { PlanId, ServiceType, QuoteFormErrors, QuoteFormValues } from '@/types/quote';
import { PROPERTY_TYPES, SYSTEM_OPTIONS } from '../../../supabase/functions/_shared/quote';
import { PROTECTION_PLANS } from '@/data/plans';
import { trackQuoteLead } from '@/lib/analytics';

const INITIAL_VALUES: QuoteFormValues = {
  fullName: '',
  email: '',
  phone: '',
  serviceType: '',
  selectedPlan: '',
  website: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: '',
  vehicleMileage: '',
  propertyZip: '',
  propertyType: '',
  systemsOfInterest: [],
  message: '',
  consentToContact: false,
};

const SERVICE_OPTIONS = [
  { value: 'auto', label: 'Auto Warranty', description: 'Vehicle service contract options' },
  { value: 'home', label: 'Home Warranty', description: 'Home systems and appliance protection' },
] as const;

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

interface QuoteRequestFormProps {
  initialServiceType?: ServiceType | '';
  initialPlan?: PlanId | '';
}

export default function QuoteRequestForm({ initialServiceType = '', initialPlan = '' }: QuoteRequestFormProps) {
  const [values, setValues] = useState<QuoteFormValues>({ ...INITIAL_VALUES, serviceType: initialServiceType, selectedPlan: initialPlan });
  const [errors, setErrors] = useState<QuoteFormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submissionError, setSubmissionError] = useState('');
  const requestId = useRef<string | null>(null);
  const submitting = useRef(false);

  const update = <K extends keyof QuoteFormValues>(key: K, value: QuoteFormValues[K]) => {
    if (submitting.current) return;
    requestId.current = null;
    setSubmissionError('');
    setValues((previous) => ({ ...previous, [key]: value,
      ...(key === 'serviceType' && value !== 'auto' ? { selectedPlan: '' as const } : {}),
    }));
    setErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const toggleSystem = (system: string) => {
    const next = values.systemsOfInterest.includes(system)
      ? values.systemsOfInterest.filter((item) => item !== system)
      : [...values.systemsOfInterest, system];
    update('systemsOfInterest', next);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    const validationErrors = validateQuoteForm(values);
    setErrors(validationErrors);

    const firstInvalid = Object.keys(validationErrors)[0];
    if (firstInvalid) {
      document.getElementById(`quote-${firstInvalid}`)?.focus();
      return;
    }

    submitting.current = true;
    setSubmitState('submitting');
    setSubmissionError('');
    try {
      requestId.current ??= crypto.randomUUID();
      await submitQuoteRequest(buildQuotePayload(values, requestId.current));
      setSubmitState('success');
      try {
        if (!values.website && values.serviceType) trackQuoteLead(requestId.current, values.serviceType, values.selectedPlan);
      } catch { /* Optional measurement must never change a saved request's success. */ }
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Unable to send your request. Please try again.');
      setSubmitState('error');
    } finally {
      submitting.current = false;
    }
  };

  const describedBy = (key: keyof QuoteFormValues, hasHint = false) => {
    const parts: string[] = [];
    if (errors[key]) parts.push(`quote-${key}-error`);
    else if (hasHint) parts.push(`quote-${key}-hint`);
    return parts.length ? parts.join(' ') : undefined;
  };

  if (submitState === 'success') {
    return (
      <div role="status" className="rounded-lg border border-accent-200 bg-accent-50 p-8 lg:p-10">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-accent-600 text-white">
            <CircleCheck size={24} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-800">Request received</p>
            <h2 className="mt-2 text-[26px]">Thank you for your quote request</h2>
            <p className="mt-3 text-[15px] text-neutral-700">
              Your request has been received. We will review the information you provided.
            </p>
          </div>
        </div>

        <dl className="mt-8 grid gap-5 rounded-lg bg-white p-6 text-[15px] sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-neutral-500">Name</dt>
            <dd className="mt-1 text-black">{values.fullName.trim()}</dd>
          </div>
          <div>
            <dt className="font-semibold text-neutral-500">Protection type</dt>
            <dd className="mt-1 text-black">{values.serviceType === 'auto' ? 'Auto Warranty' : 'Home Warranty'}</dd>
          </div>
        </dl>

        <Button variant="outline" className="mt-8" onClick={() => {
          setValues({ ...INITIAL_VALUES, serviceType: initialServiceType, selectedPlan: initialPlan });
          requestId.current = null;
          setErrors({});
          setSubmitState('idle');
        }}>
          Submit another request
        </Button>
      </div>
    );
  }

  const isAuto = values.serviceType === 'auto';
  const isHome = values.serviceType === 'home';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10" aria-label="Free warranty quote request" aria-busy={submitState === 'submitting'}>
      <div hidden aria-hidden="true">
        <label htmlFor="quote-website">Website</label>
        <input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off"
          value={values.website} onChange={(event) => update('website', event.target.value)} />
      </div>
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-black">
          Which protection are you interested in?<span className="ml-1 text-secondary-600" aria-hidden="true">*</span>
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {SERVICE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="group relative flex cursor-pointer flex-col gap-1 rounded-lg border border-neutral-300 bg-white p-5 transition-all duration-200 hover:border-primary-300 has-[:checked]:border-primary-600 has-[:checked]:bg-primary-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-500 has-[:focus-visible]:ring-offset-2"
            >
              <input
                id={option.value === 'auto' ? 'quote-serviceType' : undefined}
                type="radio"
                name="serviceType"
                value={option.value}
                checked={values.serviceType === option.value}
                onChange={() => update('serviceType', option.value)}
                aria-describedby={describedBy('serviceType')}
                className="sr-only"
              />
              <span className="font-display text-lg font-bold text-black">{option.label}</span>
              <span className="text-sm text-neutral-600">{option.description}</span>
            </label>
          ))}
        </div>
        {errors.serviceType && (
          <p id="quote-serviceType-error" className="text-sm font-medium text-error-700">
            {errors.serviceType}
          </p>
        )}
      </fieldset>

      {values.selectedPlan && (
        <p className="text-sm text-neutral-600">
          Selected plan: {PROTECTION_PLANS.find((plan) => plan.id === values.selectedPlan)?.name}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField id="quote-fullName" label="Full name" error={errors.fullName}>
          <input
            id="quote-fullName"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={describedBy('fullName')}
            className={inputClass(Boolean(errors.fullName))}
          />
        </FormField>
        <FormField id="quote-email" label="Email address" error={errors.email}>
          <input
            id="quote-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy('email')}
            className={inputClass(Boolean(errors.email))}
          />
        </FormField>
        <FormField id="quote-phone" label="Phone number" error={errors.phone} hint="US numbers only, for example (202) 555-0147.">
          <input
            id="quote-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy('phone', true)}
            className={inputClass(Boolean(errors.phone))}
          />
        </FormField>
      </div>

      {isAuto && (
        <div className="grid gap-6 rounded-lg border border-neutral-200 bg-neutral-50 p-6 sm:grid-cols-2 lg:p-8" role="group" aria-label="Vehicle details">
          <FormField id="quote-vehicleMake" label="Vehicle make" error={errors.vehicleMake}>
            <input
              id="quote-vehicleMake"
              type="text"
              value={values.vehicleMake}
              onChange={(e) => update('vehicleMake', e.target.value)}
              aria-invalid={Boolean(errors.vehicleMake)}
              aria-describedby={describedBy('vehicleMake')}
              placeholder="Toyota"
              className={inputClass(Boolean(errors.vehicleMake))}
            />
          </FormField>
          <FormField id="quote-vehicleModel" label="Vehicle model" error={errors.vehicleModel}>
            <input
              id="quote-vehicleModel"
              type="text"
              value={values.vehicleModel}
              onChange={(e) => update('vehicleModel', e.target.value)}
              aria-invalid={Boolean(errors.vehicleModel)}
              aria-describedby={describedBy('vehicleModel')}
              placeholder="Highlander"
              className={inputClass(Boolean(errors.vehicleModel))}
            />
          </FormField>
          <FormField id="quote-vehicleYear" label="Model year" error={errors.vehicleYear}>
            <input
              id="quote-vehicleYear"
              type="number"
              inputMode="numeric"
              min={1980}
              max={new Date().getFullYear() + 1}
              value={values.vehicleYear}
              onChange={(e) => update('vehicleYear', e.target.value)}
              aria-invalid={Boolean(errors.vehicleYear)}
              aria-describedby={describedBy('vehicleYear')}
              placeholder="2020"
              className={inputClass(Boolean(errors.vehicleYear))}
            />
          </FormField>
          <FormField id="quote-vehicleMileage" label="Current mileage" optional error={errors.vehicleMileage}>
            <input
              id="quote-vehicleMileage"
              type="number"
              inputMode="numeric"
              min={0}
              max={999999}
              value={values.vehicleMileage}
              onChange={(e) => update('vehicleMileage', e.target.value)}
              aria-invalid={Boolean(errors.vehicleMileage)}
              aria-describedby={describedBy('vehicleMileage')}
              placeholder="62000"
              className={inputClass(Boolean(errors.vehicleMileage))}
            />
          </FormField>
        </div>
      )}

      {isHome && (
        <div className="grid gap-6 rounded-lg border border-neutral-200 bg-neutral-50 p-6 sm:grid-cols-2 lg:p-8" role="group" aria-label="Property details">
          <FormField id="quote-propertyZip" label="Property ZIP code" error={errors.propertyZip}>
            <input
              id="quote-propertyZip"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              value={values.propertyZip}
              onChange={(e) => update('propertyZip', e.target.value)}
              aria-invalid={Boolean(errors.propertyZip)}
              aria-describedby={describedBy('propertyZip')}
              placeholder="20001"
              className={inputClass(Boolean(errors.propertyZip))}
            />
          </FormField>
          <FormField id="quote-propertyType" label="Property type" optional error={errors.propertyType}>
            <select
              id="quote-propertyType"
              value={values.propertyType}
              aria-invalid={Boolean(errors.propertyType)}
              aria-describedby={describedBy('propertyType')}
              onChange={(e) => update('propertyType', e.target.value)}
              className={inputClass(Boolean(errors.propertyType))}
            >
              <option value="">Select a property type</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </FormField>
          <fieldset className="space-y-4 sm:col-span-2">
            <legend className="text-sm font-semibold text-black">
              Systems or appliances of interest <span className="font-normal text-neutral-500">(optional)</span>
            </legend>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SYSTEM_OPTIONS.map((system) => (
                <label key={system} className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-[15px] text-neutral-800 transition-colors hover:border-primary-300 has-[:checked]:border-primary-600 has-[:checked]:bg-primary-50">
                  <input
                    type="checkbox"
                    checked={values.systemsOfInterest.includes(system)}
                    onChange={() => toggleSystem(system)}
                    className="h-5 w-5 rounded border-neutral-400 text-primary-600 focus:ring-accent-500"
                  />
                  {system}
                </label>
              ))}
            </div>
          </fieldset>
          {errors.systemsOfInterest && <p role="alert" className="text-sm font-medium text-error-700">{errors.systemsOfInterest}</p>}
        </div>
      )}

      <FormField id="quote-message" label="Message" optional error={errors.message}>
        <textarea
          id="quote-message"
          rows={5}
          maxLength={1000}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy('message')}
          value={values.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Tell us what you would like to protect or any questions you have."
          className={inputClass(Boolean(errors.message))}
        />
      </FormField>

      <div className="space-y-3">
        <label className="flex cursor-pointer items-start gap-3 text-[15px] text-neutral-700">
          <input
            id="quote-consentToContact"
            type="checkbox"
            checked={values.consentToContact}
            onChange={(e) => update('consentToContact', e.target.checked)}
            aria-invalid={Boolean(errors.consentToContact)}
            aria-describedby={describedBy('consentToContact')}
            className="mt-1 h-5 w-5 shrink-0 rounded border-neutral-400 text-primary-600 focus:ring-accent-500"
          />
          <span>
            I agree that ACAI Warranty LLC may contact me by email or phone about this quote request. This does not authorize
            text messages or recurring marketing calls.
          </span>
        </label>
        {errors.consentToContact && (
          <p id="quote-consentToContact-error" className="text-sm font-medium text-error-700">
            {errors.consentToContact}
          </p>
        )}
      </div>

      {submissionError && <p role="alert" className="text-sm font-medium text-error-700">{submissionError}</p>}

      <div className="flex flex-col gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-sm text-neutral-500">
          Submitting this form is not a purchase or enrollment. Coverage terms are set by your contract.
        </p>
        <Button type="submit" size="lg" disabled={submitState === 'submitting'} className="w-full sm:w-auto">
          {submitState === 'submitting' ? (
            <>
              <LoaderCircle size={20} className="animate-spin" aria-hidden="true" />
              Sending request
            </>
          ) : (
            <>
              <CircleCheck size={20} aria-hidden="true" />
              Request My Free Quote
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
